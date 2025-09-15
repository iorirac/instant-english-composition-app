import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  qaListAtom,
  qaLoadingAtom,
  qaErrorAtom,
  loadQaFromApiAtom,
} from "@/state/atoms";

export function useLoadQaOnce() {
  const reload = useSetAtom(loadQaFromApiAtom);
  const data = useAtomValue(qaListAtom);
  const loading = useAtomValue(qaLoadingAtom);
  const error = useAtomValue(qaErrorAtom);

  useEffect(() => {
    reload().catch(() => void 0);
  }, [reload]);

  return { data, loading, error, reload };
}
