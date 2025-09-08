import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import jaMessages from "@/locales/ja.json";
import enMessages from "@/locales/en.json";
// demo
import raw from "@/data/friends_demo.json";

// 使用可能な言語コードを定義
export type Lang = "ja" | "en";

// Speakerの型定義
export type Speaker = { en: string; ja: string };

// 質問・回答データの型定義
export type QA = {
  uid: string;
  id: string | null;
  ja: string;
  en: string;
  meta?: { season?: number; episode?: number; speaker?: Speaker } | null;
};

// QAデータのリストを保持するatom（デモデータを初期値として使用）
export const qaListAtom = atom((raw as QA[]).map((i) => ({ ...i })));

// UIの表示モード（ライト・ダーク）
export const modeAtom = atomWithStorage<"light" | "dark">("qa.mode", "light");
// 問題と解答の言語を逆転させるかどうかの状態
export const reverseAtom = atomWithStorage<boolean>("qa.reverse", false);
// 現在表示しているQAのインデックス
export const idxAtom = atomWithStorage<number>("qa.idx", 0);

// 問題表示のトグル（表示・非表示）
export const showAtom = atom<boolean>(false);
// UIの表示言語
export const uiLangAtom = atomWithStorage<Lang>("qa.uiLang", "ja");

// 現在表示中のQAデータを取得するセレクタ
export const currentAtom = atom((get) => {
  const data = get(qaListAtom);
  const idx = get(idxAtom);
  return data[Math.max(0, Math.min(idx, data.length - 1))];
});

// 逆転設定に応じて問題文の言語を決定
export const questionLangAtom = atom<Lang>((get) =>
  get(reverseAtom) ? "en" : "ja"
);

// 逆転設定に応じて解答文の言語を決定
export const answerLangAtom = atom<Lang>((get) =>
  get(reverseAtom) ? "ja" : "en"
);

// UIのメッセージデータを逆転設定に応じて切り替える
export const messagesAtom = atom((get) =>
  get(reverseAtom) ? enMessages : jaMessages
);
