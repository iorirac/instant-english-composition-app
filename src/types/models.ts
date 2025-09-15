// アプリ全体で使用する型定義
export type Lang = "ja" | "en";

export type Speaker = { en: string; ja: string };

export type QA = {
  uid: string;
  id: string | null;
  ja: string;
  en: string;
  meta?: { season?: number; episode?: number; speaker?: Speaker } | null;
};
