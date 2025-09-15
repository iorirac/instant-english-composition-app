import { createTheme } from "@mui/material/styles";

export const createAppTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      // ダーク/ライトで主要色を切り替え
      primary: { main: mode === "light" ? "#1976d2" : "#90caf9" },
      background: {
        default: mode === "light" ? "#f5f7fb" : "#0b0f19",
        paper: mode === "light" ? "#ffffff" : "#111827",
      },
      text: {
        primary: mode === "light" ? "#111827" : "#e5e7eb",
        secondary: mode === "light" ? "#4b5563" : "#9ca3af",
      },
      divider: mode === "light" ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)",
    },
    shape: { borderRadius: 10 },
  });
