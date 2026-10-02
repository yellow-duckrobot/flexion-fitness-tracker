import { useEffect, useState } from "react";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getTheme } from "./theme";
import Auth from "./pages/Auth";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Workouts from "./pages/Workouts";
import Nutrition from "./pages/Nutrition";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";
import Support from "./pages/Support";
import Game from "./pages/Game";
import Landing from "./pages/Landing";

function Protected({ children }) {
  const token = localStorage.getItem("flexion_token");
  const [status, setStatus] = useState(token ? "checking" : "out");

  useEffect(() => {
    if (!token) return setStatus("out");
    fetch("const API = "https://sublime-grad-interventions-malpractice.trycloudflare.com/api";/api/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.ok) setStatus("in");
        else { localStorage.clear(); setStatus("out"); }
      })
      .catch(() => setStatus("out"));
  }, [token]);

  if (status === "checking")
    return <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "#9ca3af", fontWeight: 700 }}>Loading…</Box>;
  return status === "in" ? children : <Navigate to="/auth" replace />;
}

function App() {
  // theme preference: saved in localStorage, synced from Settings page via custom event
  const [mode, setMode] = useState(() => localStorage.getItem("flexion_theme") || "dark");

  useEffect(() => {
    const apply = () => {
      const m = localStorage.getItem("flexion_theme") || "dark";
      setMode(m);
      document.documentElement.dataset.theme = m; // drives CSS variables
    };
    apply();
    window.addEventListener("flexion-theme", apply);
    return () => window.removeEventListener("flexion-theme", apply);
  }, []);

  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route element={<Protected><AppLayout /></Protected>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/support" element={<Support />} />
            <Route path="/game" element={<Game />} />
          </Route>
          <Route path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;