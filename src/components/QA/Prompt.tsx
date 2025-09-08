import { Typography } from "@mui/material";
import { useAtom } from "jotai";
import { currentAtom, questionLangAtom, messagesAtom } from "@/state/atoms";

export default function Prompt() {
  const [current] = useAtom(currentAtom);
  const [qLang] = useAtom(questionLangAtom);
  const [messages] = useAtom(messagesAtom);

  return (
    <Typography variant="h6" sx={{ mb: 1.5 }}>
      <strong>{messages.label[qLang]}：</strong> {current[qLang]}
    </Typography>
  );
}
