# 英会話学習アプリ（React + TypeScript + Vite）

## 概要

- React + TypeScript + Vite 構成の英会話学習アプリ。
- 「Friends」のセリフをもとに英日ペアを学習。未認証ユーザーは常にデモデータを表示、許可ユーザーのみ S3 の本番データを取得。

## 主な機能

- 翻訳ペア（JA/EN）の表示と反転
- ライト/ダークテーマ切替（MUI）
- キーボードショートカット
- Google ログイン（GSI）

## 環境変数

フロント（公開可、Vite に埋め込み）

- `VITE_GOOGLE_CLIENT_ID`: Google OAuth のクライアント ID

サーバ（Vercel Functions / Node 実行時）

- `SESSION_SECRET`
- `VITE_GOOGLE_CLIENT_ID`
- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `S3_BUCKET`
- `S3_KEY`（例: `private/friends_s1.json`）
- `ALLOWED_GOOGLE_EMAILS`
- `ALLOWED_GOOGLE_SUBS`

ローカル開発の `.env`

```
VITE_GOOGLE_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
SESSION_SECRET=change-me-in-production
AWS_REGION=ap-northeast-1
AWS_ACCESS_KEY_ID=AKIA...REDACTED
AWS_SECRET_ACCESS_KEY=...REDACTED...
S3_BUCKET=your-s3-bucket
S3_KEY=private/friends_s1.json
ALLOWED_GOOGLE_EMAILS=you@example.com
```

## 開発（ローカル）

フロント（Vite）と API（Vercel Functions）を別プロセスで起動。

1. 依存インストール

```
npm install
```

2. API を起動（ポート 3000）

```
npm run vercel-dev
```

3. フロントを起動（ポート 5173）

```
npm run vite-dev
```

Vite の `vite.config.ts` で `"/api" -> http://localhost:3000` にプロキシされます。

## デプロイ（Vercel）

- プロジェクトの環境変数に上記を設定し、デプロイします。
- フロントの `VITE_*` はビルド時に埋め込まれます。サーバは `process.env.*` を実行時に参照。
- Google Cloud Console の OAuth クライアントで「Authorized JavaScript origins」に本番ドメインと `http://localhost:5173` を登録。

## データ管理

- デモデータ: `src/data/friends_demo.json`（初期表示は常にこれを使用）
- 本番データ: S3 上の JSON（許可ユーザーのみ取得）

## プロジェクト構造

```
├── api
│   ├── translation.ts
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── src
│   ├── App.tsx
│   ├── components
│   │   ├── AppShell
│   │   │   ├── GlobalHotkeys.tsx
│   │   │   ├── Header.tsx
│   │   │   └── LoadStatus.tsx
│   │   ├── Auth
│   │   │   └── GoogleLoginButton.tsx
│   │   └── QA
│   │       ├── Answer.tsx
│   │       ├── Controls.tsx
│   │       ├── Meta.tsx
│   │       ├── Progress.tsx
│   │       └── Prompt.tsx
│   ├── data
│   │   ├── friends_demo.json
│   │   └── friends_s1.json
│   ├── hooks
│   │   └── useLoadQa.ts
│   ├── locales
│   │   ├── en.json
│   │   └── ja.json
│   ├── main.tsx
│   ├── state
│   │   └── atoms.ts
│   ├── themes
│   │   └── theme.ts
│   ├── types
│   │   └── models.ts
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## よくあるトラブル

- Google ボタンが出ない: `VITE_GOOGLE_CLIENT_ID` 未設定、拡張機能によるブロック、許可オリジン未登録を確認。
- Network に GSI のエラー: 拡張/プライバシー設定や FedCM 無効化が原因のことがあります（ボタン運用なら多くは無視可）。
- `FUNCTION_INVOCATION_FAILED`: API 実行環境の env 未設定、`vercel dev` 未起動などを確認。
