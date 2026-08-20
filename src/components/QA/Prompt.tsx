import { Typography } from "@mui/material";
import { useAtom } from "jotai";
import { currentAtom, questionLangAtom, messagesAtom } from "@/state/atoms";

export default function Prompt() {
  const [current] = useAtom(currentAtom);
  const [qLang] = useAtom(questionLangAtom);
  const [messages] = useAtom(messagesAtom);

  return (
    <Typography variant="h6" component="h2" sx={{ mb: 1.5, fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
      <strong>{messages.label[qLang]}：</strong> {current[qLang]}
    </Typography>
  );
}
