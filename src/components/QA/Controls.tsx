import { Box, Button } from "@mui/material";
import { useAtom } from "jotai";
import { showAtom, idxAtom, qaListAtom, messagesAtom } from "@/state/atoms";

export default function Controls() {
  const [show, setShow] = useAtom(showAtom);
  const [, setIdx] = useAtom(idxAtom);
  const [data] = useAtom(qaListAtom);
  const [messages] = useAtom(messagesAtom);

  return (
    <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
      <Button
        variant="outlined"
        onClick={() => setShow((s) => !s)}
        aria-pressed={show}
      >
        {show ? messages.hideAnswer : messages.showAnswer}
      </Button>
      <Button
        variant="contained"
        onClick={() => setIdx((i) => (i + 1) % data.length)}
      >
        {messages.next}
      </Button>
    </Box>
  );
}
