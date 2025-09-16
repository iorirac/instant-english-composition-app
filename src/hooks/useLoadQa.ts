import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  qaListAtom,
  loadQaFromApiAtom,
  idTokenAtom,
  qaSourceAtom,
} from "@/state/atoms";
import raw from "@/data/friends_demo.json";
import type { QA } from "@/types/models";

// 認証状態に応じてQAデータを同期する
// ログイン時はAPIからデータを取得する
// ログアウト時はデモデータを使用する
export function useSyncQaWithAuth() {
  const token = useAtomValue(idTokenAtom);
  const reload = useSetAtom(loadQaFromApiAtom);
  const setList = useSetAtom(qaListAtom);
  const setSource = useSetAtom(qaSourceAtom);

  useEffect(() => {
    if (token) {
      reload().catch(() => void 0);
    } else {
      setList((raw as QA[]).map((i) => ({ ...i })));
      setSource("demo");
    }
  }, [token, reload, setList, setSource]);
}
