import type { VercelRequest, VercelResponse } from "@vercel/node";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "node:stream";
import { buffer } from "node:stream/consumers";
import { OAuth2Client } from "google-auth-library";

const AWS_ERROR_MAP: Record<
  string,
  { status: number; code: string; message: string }
> = {
  NoSuchKey: {
    status: 404,
    code: "NotFound",
    message: "対象のファイルが見つかりません。",
  },
  AccessDenied: {
    status: 403,
    code: "AccessDenied",
    message: "アクセスが拒否されました。",
  },
};

type ApiErrorPayload = {
  error: string;
  message: string;
  details?: unknown;
};

function sendError(
  res: VercelResponse,
  status: number,
  code: string,
  message: string,
  details?: unknown
) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.status(status).json({
    error: code,
    message,
    ...(details ? { details } : {}),
  } as ApiErrorPayload);
}

function mapAwsErrorToHttp(err: unknown): {
  status: number;
  code: string;
  message: string;
} {
  const e = err as
    | {
        name?: string;
        message?: string;
        $metadata?: { httpStatusCode?: number };
      }
    | undefined;
  const name = (e?.name || "").toString();
  const predefined = AWS_ERROR_MAP[name];
  if (predefined) return predefined;
  return {
    status: 500,
    code: "InternalError",
    message: "サーバーエラーが発生しました。",
  };
}

// S3クライアント
const s3 = new S3Client({
  region: process.env.AWS_REGION,
});

// Google ID トークン検証（サーバ側は process.env を使用）
const googleClientId = process.env.VITE_GOOGLE_CLIENT_ID || "";
const oauth2 = googleClientId ? new OAuth2Client(googleClientId) : undefined;

async function verifyGoogleIdToken(
  token: string
): Promise<{ email?: string; sub?: string } | null> {
  if (!oauth2 || !googleClientId) return null;
  try {
    const ticket = await oauth2.verifyIdToken({
      idToken: token,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();
    if (!payload) return null;
    return { email: payload.email || undefined, sub: payload.sub };
  } catch {
    return null;
  }
}

/**
 * GET /api/translation
 * vercelのサーバレスapi
 * 必要な環境変数:
 *   - AWS_REGION
 *   - AWS_ACCESS_KEY_ID
 *   - AWS_SECRET_ACCESS_KEY
 *   - S3_BUCKET
 *   - S3_KEY（デフォルト: "private/friends_s1.json"）
 *
 * S3のJSONファイルを取得してJSONで返す。
 */
export default async function translationApi(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET");
      return sendError(
        res,
        405,
        "MethodNotAllowed",
        "このエンドポイントは GET のみ対応です。"
      );
    }

    // Auth: Google ID token を検証して、許可ユーザー以外はダミーデータを返す
    const authHeader = req.headers.authorization || "";
    const bearer = authHeader.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : undefined;
    const allowEmails = (process.env.ALLOWED_GOOGLE_EMAILS || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    const allowSubs = (process.env.ALLOWED_GOOGLE_SUBS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!googleClientId) {
      // 認証設定が無い場合はエラーを返す（クライアント側でデモにフォールバック）
      return sendError(res, 503, "AuthNotConfigured", "認証設定が不十分です。");
    }

    // トークンが無ければ未認証
    if (!bearer) {
      return sendError(res, 401, "Unauthorized", "認証が必要です。");
    }

    // verify via Google public keys (server-side)
    const info = await verifyGoogleIdToken(bearer);
    const email = (info?.email || "").toLowerCase();
    const sub = info?.sub || "";
    const emailAllowed =
      allowEmails.length > 0 && email ? allowEmails.includes(email) : false;
    const subAllowed =
      allowSubs.length > 0 && sub ? allowSubs.includes(sub) : false;

    if (!emailAllowed && !subAllowed) {
      // 許可外
      return sendError(res, 403, "Forbidden", "アクセスが許可されていません。");
    }

    const bucket = process.env.S3_BUCKET;
    const defaultKey = process.env.S3_KEY;
    const key =
      (typeof req.query.key === "string" ? req.query.key : undefined) ||
      defaultKey;

    if (!bucket || !key) {
      return sendError(
        res,
        400,
        "BadRequest",
        "設定またはリクエストが不十分です（S3_BUCKET または key が不足しています）。"
      );
    }

    const cmd = new GetObjectCommand({ Bucket: bucket, Key: key });
    const s3Res = await s3.send(cmd);

    const body = s3Res.Body;
    if (!(body instanceof Readable)) {
      return sendError(
        res,
        502,
        "UpstreamError",
        "S3 からのレスポンスが不正です。"
      );
    }

    const buf: Buffer = await buffer(body);
    const text = buf.toString("utf8");

    const lower = key.toLowerCase();
    if (lower.endsWith(".json")) {
      try {
        const data = JSON.parse(text);
        return res.status(200).json(data);
      } catch {
        return sendError(
          res,
          400,
          "InvalidJSON",
          "S3 オブジェクトの内容が有効な JSON ではありません。"
        );
      }
    } else {
      return sendError(
        res,
        415,
        "UnsupportedMediaType",
        "S3 のオブジェクトは JSON (.json) を想定しています。"
      );
    }
  } catch (err: unknown) {
    const mapped = mapAwsErrorToHttp(err);
    return sendError(res, mapped.status, mapped.code, mapped.message);
  }
}
