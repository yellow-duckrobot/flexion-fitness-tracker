// src/theme.js — Flexion design system. Drop-in MUI theme.
// Usage: <ThemeProvider theme={getTheme(mode)}> and toggle mode with a state.
import { createTheme } from "@mui/material/styles";

const palette = (mode) =>
  mode === "dark"
    ? {
        mode: "dark",
        background: { default: "#0a0a14", paper: "rgba(255,255,255,0.04)" },
        primary: { main: "#22d3ee" },
        secondary: { main: "#a855f7" },
        success: { main: "#34d399" },
        warning: { main: "#f97316" },
        error: { main: "#ef4444" },
        text: { primary: "#f9fafb", secondary: "#9ca3af" },
        divider: "rgba(255,255,255,0.08)",
      }
    : {
        mode: "light",
        background: { default: "#eef1f7", paper: "#ffffff" },
        primary: { main: "#0891b2" },
        secondary: { main: "#7c3aed" },
        success: { main: "#059669" },
        warning: { main: "#ea580c" },
        error: { main: "#dc2626" },
        text: { primary: "#111827", secondary: "#5b6472" },
        divider: "rgba(17,24,39,0.08)",
      };

export const GRADIENTS = {
  primary: "linear-gradient(135deg,#22d3ee,#a855f7)",
  fire: "linear-gradient(135deg,#f97316,#ef4444)",
  success: "linear-gradient(135deg,#34d399,#22d3ee)",
};

// THEME-AWARE glass card — colors resolve from CSS variables set in index.css
// (see :root[data-theme="dark"] / :root[data-theme="light"])
export const glassCard = {
  borderRadius: "20px",
  border: "1px solid var(--card-border)",
  background: "var(--card-bg)",
  backdropFilter: "blur(12px)",
  boxShadow: "var(--card-shadow)",
  p: 3,
};

export const getTheme = (mode) =>
  createTheme({
    palette: palette(mode),
    shape: { borderRadius: 14 },
    typography: {
      fontFamily: "'Inter','Space Grotesk',system-ui,sans-serif",
      h3: { fontWeight: 800, letterSpacing: "-0.02em" },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
      button: { textTransform: "none", fontWeight: 600 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { borderRadius: "12px", padding: "10px 20px" },
          containedPrimary: {
            background: GRADIENTS.primary,
            boxShadow: "0 8px 24px rgba(34,211,238,0.35)",
            "&:hover": { boxShadow: "0 12px 32px rgba(168,85,247,0.45)" },
          },
        },
      },
      MuiPaper: { defaultProps: { elevation: 0 } },
    },
  });