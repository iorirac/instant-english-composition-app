import { Provider } from "jotai";
import { ThemeProvider, CssBaseline, Container, Box } from "@mui/material";
import { useAtom } from "jotai";
import { modeAtom } from "@/state/atoms";
import { useMemo } from "react";
import Header from "@/components/AppShell/Header";
import GlobalHotkeys from "@/components/AppShell/GlobalHotkeys";
import Prompt from "@/components/QA/Prompt";
import Answer from "@/components/QA/Answer";
import Controls from "@/components/QA/Controls";
import Meta from "@/components/QA/Meta";
import Progress from "@/components/QA/Progress";
import { createAppTheme } from "@/themes/theme";
import { useLoadQaOnce } from "@/hooks/useLoadQa";
import LoadStatus from "@/components/AppShell/LoadStatus";

export default function App() {
  return (
    <Provider>
      <ThemedApp />
    </Provider>
  );
}

function ThemedApp() {
  const [mode] = useAtom(modeAtom);
  const theme = useMemo(() => createAppTheme(mode), [mode]);
  const { loading, error, reload } = useLoadQaOnce();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Header />
        <GlobalHotkeys />
        <Container
          maxWidth="md"
          sx={{ py: 5, flex: 1, display: "flex", alignItems: "center" }}
        >
          <Box sx={{ width: "100%" }}>
            <LoadStatus loading={loading} error={error} onRetry={reload} />
            <Meta />
            <Prompt />
            <Answer />
            <Controls />
            <Progress />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
