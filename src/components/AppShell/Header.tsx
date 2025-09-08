import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useAtom } from "jotai";
import { modeAtom, reverseAtom, messagesAtom } from "../../state/atoms";

export default function Header() {
  const [mode, setMode] = useAtom(modeAtom);
  const [reverse, setReverse] = useAtom(reverseAtom);
  const [messages] = useAtom(messagesAtom);

  return (
    <AppBar elevation={0} color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {messages.title}
        </Typography>
        <Button
          color="inherit"
          onClick={() => setReverse((v) => !v)}
          sx={{ mr: 1 }}
        >
          {reverse ? "EN→JA" : "JA→EN"}
        </Button>
        <IconButton
          color="inherit"
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
        >
          {mode === "light" ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
