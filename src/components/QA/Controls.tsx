import { Box, Button, useMediaQuery, useTheme } from "@mui/material";
import { useAtom } from "jotai";
import { showAtom, idxAtom, qaListAtom, messagesAtom } from "@/state/atoms";

export default function Controls() {
  const [show, setShow] = useAtom(showAtom);
  const [, setIdx] = useAtom(idxAtom);
  const [data] = useAtom(qaListAtom);
  const [messages] = useAtom(messagesAtom);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mt: 2 }}>
      <Button
        variant="outlined"
        onClick={() => setShow((s) => !s)}
        aria-pressed={show}
        fullWidth={isMobile}
        size={isMobile ? "large" : "medium"}
      >
        {show ? (isMobile ? messages.hideAnswerMobile : messages.hideAnswer) : (isMobile ? messages.showAnswerMobile : messages.showAnswer)}
      </Button>
      <Button
        variant="contained"
        onClick={() => setIdx((i) => (i + 1) % data.length)}
        fullWidth={isMobile}
        size={isMobile ? "large" : "medium"}
      >
        {isMobile ? messages.nextMobile : messages.next}
      </Button>
    </Box>
  );
}
