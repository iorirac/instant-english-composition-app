import { useEffect } from "react";
import { useAtom } from "jotai";
import { idxAtom, qaListAtom, showAtom, reverseAtom } from "@/state/atoms";

export default function GlobalHotkeys() {
  const [, setShow] = useAtom(showAtom);
  const [, setIdx] = useAtom(idxAtom);
  const [data] = useAtom(qaListAtom);
  const [, setReverse] = useAtom(reverseAtom);

  // キーイベントの登録とクリーンアップ処理
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setShow((s) => !s);
      } else if (e.key.toLowerCase() === "r") {
        setReverse((v) => !v);
      } else if (e.key.toLowerCase() === "n" || e.key === "ArrowRight") {
        setIdx((i) => (i + 1) % data.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [data.length, setIdx, setReverse, setShow]);

  return null;
}
