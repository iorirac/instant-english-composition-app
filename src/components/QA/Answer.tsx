import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useAtom } from "jotai";
import {
  showAtom,
  currentAtom,
  answerLangAtom,
  messagesAtom,
} from "../../state/atoms";

export default function Answer() {
  const [show] = useAtom(showAtom);
  const [current] = useAtom(currentAtom);
  const [aLang] = useAtom(answerLangAtom);
  const [messages] = useAtom(messagesAtom);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={(theme) => ({
        backgroundColor:
          theme.palette.mode === "light"
            ? theme.palette.grey[100]
            : "rgba(255,255,255,0.06)",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        p: 2,
        minHeight: 60,
        fontSize: { xs: 16, sm: 20 },
      })}
      aria-live="polite"
    >
      {show ? (
        <>
          <strong>{messages.label[aLang]}：</strong> {current[aLang]}
        </>
      ) : (
        <Typography component="span" color="text.secondary">
          {isMobile ? messages.hiddenMobile : messages.hidden}
        </Typography>
      )}
    </Box>
  );
}
