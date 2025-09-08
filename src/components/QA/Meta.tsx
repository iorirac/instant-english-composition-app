import { Box } from "@mui/material";
import { useAtom } from "jotai";
import { currentAtom, questionLangAtom, messagesAtom } from "@/state/atoms";

export default function Meta() {
  const [current] = useAtom(currentAtom);
  const [qLang] = useAtom(questionLangAtom);
  const [messages] = useAtom(messagesAtom);

  if (!current?.meta)
    return (
      <Box sx={{ color: "text.secondary", fontSize: 12, mb: 1 }}>&nbsp;</Box>
    );

  const sp = current.meta.speaker;
  let spTxt = "";
  if (sp) {
    spTxt =
      qLang === "ja" ? sp.ja || messages.nothing : sp.en || messages.nothing;
  }

  return (
    <Box sx={{ color: "text.secondary", fontSize: 12, mb: 1 }}>
      {`S${current.meta.season}E${current.meta.episode} ${spTxt}`}
    </Box>
  );
}
