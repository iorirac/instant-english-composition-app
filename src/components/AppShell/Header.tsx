import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useAtom } from "jotai";
import {
  modeAtom,
  reverseAtom,
  messagesAtom,
  idTokenAtom,
} from "../../state/atoms";
import { GoogleLoginButton } from "@/components/Auth/GoogleLoginButton";

export default function Header() {
  const [mode, setMode] = useAtom(modeAtom);
  const [reverse, setReverse] = useAtom(reverseAtom);
  const [messages] = useAtom(messagesAtom);
  const [idToken, setIdToken] = useAtom(idTokenAtom);

  return (
    <AppBar elevation={0} color="primary">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {messages.title}
        </Typography>
        <Box sx={{ mr: 1 }}>
          {idToken ? (
            <Button
              color="inherit"
              onClick={() => {
                try {
                  google?.accounts?.id?.disableAutoSelect?.();
                } catch {
                  console.error("ログアウト失敗");
                }
                setIdToken(null);
              }}
            >
              {messages.logout}
            </Button>
          ) : (
            <GoogleLoginButton onToken={(t) => setIdToken(t)} />
          )}
        </Box>
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
