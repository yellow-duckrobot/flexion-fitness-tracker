import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box, Typography, TextField, Button, IconButton, InputAdornment, Alert, CircularProgress,
} from "@mui/material";
import {
  Mail, Lock, User, AtSign, Eye, EyeOff, Flame, Trophy, Zap, Dumbbell, ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import { GRADIENTS } from "../theme";
import { useNavigate } from "react-router-dom";

const API = "const API = "https://sublime-grad-interventions-malpractice.trycloudflare.com/api";/api";

/* ---------- Left visual panel: floating glass stat chips ---------- */
function VisualPanel() {
  const chips = [
    { icon: <Flame size={18} />, label: "12-day streak", color: "#f97316", x: "8%", y: "22%", delay: 0 },
    { icon: <Trophy size={18} />, label: "New PR: Bench 80kg", color: "#f59e0b", x: "48%", y: "38%", delay: 1.2 },
    { icon: <Zap size={18} />, label: "Fitness Score 87", color: "#34d399", x: "14%", y: "58%", delay: 0.6 },
    { icon: <Dumbbell size={18} />, label: "5 workouts this week", color: "#22d3ee", x: "52%", y: "72%", delay: 1.8 },
  ];
  return (
    <Box sx={{
      display: { xs: "none", md: "flex" },
      flex: 1.1, position: "relative", overflow: "hidden",
      flexDirection: "column", justifyContent: "center", p: 6,
      background: "linear-gradient(135deg, rgba(34,211,238,0.10), rgba(168,85,247,0.14) 55%, rgba(249,115,22,0.08))",
      borderRight: "1px solid rgba(255,255,255,0.07)",
    }}>
      {/* glow orbs */}
      <Box sx={{ position: "absolute", width: 420, height: 420, borderRadius: "50%", top: -140, left: -140, background: "radial-gradient(circle, rgba(34,211,238,0.22), transparent 70%)", filter: "blur(10px)" }} />
      <Box sx={{ position: "absolute", width: 460, height: 460, borderRadius: "50%", bottom: -160, right: -120, background: "radial-gradient(circle, rgba(168,85,247,0.22), transparent 70%)", filter: "blur(10px)" }} />

      <Box sx={{ position: "relative", zIndex: 1, maxWidth: 480 }}>
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 4 }}>
            <Box sx={{ width: 42, height: 42, borderRadius: "12px", background: GRADIENTS.primary, display: "grid", placeItems: "center", fontWeight: 800, fontSize: 20, color: "#fff" }}>F</Box>
            <Box>
              <Typography sx={{ fontWeight: 800, letterSpacing: "0.06em", lineHeight: 1 }}>FLEXION</Typography>
              <Typography sx={{ fontSize: 10, color: "#22d3ee", letterSpacing: "0.28em", fontWeight: 700 }}>FITNESS OS</Typography>
            </Box>
          </Box>
          <Typography sx={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.15, mb: 2 }}>
            Your fitness journey,
            <Box component="span" sx={{ display: "block", background: GRADIENTS.primary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              beautifully tracked.
            </Box>
          </Typography>
          <Typography sx={{ color: "text.secondary", fontWeight: 500, fontSize: 15, lineHeight: 1.7, mb: 5 }}>
            Workouts, nutrition, and progress — unified in one stunning dashboard with analytics that actually motivate you.
          </Typography>
        </motion.div>

        {/* floating chips */}
        <Box sx={{ position: "relative", height: 220 }}>
          {chips.map((c) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
              transition={{
                opacity: { delay: 0.4 + c.delay * 0.2, duration: 0.5 },
                scale: { delay: 0.4 + c.delay * 0.2, duration: 0.5 },
                y: { delay: c.delay, duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{ position: "absolute", left: c.x, top: c.y }}
            >
              <Box sx={{
                display: "flex", alignItems: "center", gap: 1.2, px: 2, py: 1.4,
                borderRadius: "14px", background: "rgba(20,20,32,0.72)", backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.10)", boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
                color: c.color, fontSize: 13, fontWeight: 700, whiteSpace: "nowrap",
              }}>
                {c.icon} <Box component="span" sx={{ color: "#e5e7eb" }}>{c.label}</Box>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/* ---------- Shared input styling ---------- */
const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px", background: "rgba(255,255,255,0.04)",
    "& fieldset": { borderColor: "rgba(255,255,255,0.12)" },
    "&:hover fieldset": { borderColor: "rgba(34,211,238,0.5)" },
    "&.Mui-focused fieldset": { borderColor: "#22d3ee" },
  },
  "& .MuiInputLabel-root": { color: "#9ca3af", fontWeight: 600 },
  mb: 2,
};

function PasswordField({ label, value, onChange, name }) {
  const [show, setShow] = useState(false);
  return (
    <TextField
      fullWidth variant="outlined" type={show ? "text" : "password"}
      label={label} name={name} value={value} onChange={onChange} sx={inputSx}
      InputProps={{
        startAdornment: <InputAdornment position="start"><Lock size={17} color="#9ca3af" /></InputAdornment>,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShow(!show)} edge="end" size="small" sx={{ color: "#9ca3af" }}>
              {show ? <EyeOff size={17} /> : <Eye size={17} />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

/* ---------- The form panel ---------- */
function AuthForm() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");

    // client-side validation
    if (tab === "register") {
      if (!form.name || !form.username || !form.email || !form.password)
        return setError("Please fill in all fields.");
      if (!consent) return setError("Please accept the privacy policy to continue.");
      if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Enter a valid email address.");
      if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    } else if (!form.username || !form.password) {
      return setError("Enter your username and password.");
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/${tab}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      if (tab === "register") {
        setSuccess("Account created! You can log in now 🎉");
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.4 }, colors: ["#22d3ee", "#a855f7", "#f97316"] });
        setTab("login");
        setForm({ ...form, password: "" });
      } else {
        // success login -> save token if your API sends one, then redirect
        if (data.token) localStorage.setItem("flexion_token", data.token);
        setSuccess("Logged in! Redirecting to dashboard…");
        setTimeout(() => navigate("/dashboard"), 800);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (t) => { setTab(t); setError(""); setSuccess(""); };

  return (
    <Box sx={{
      flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
      p: { xs: 2.5, sm: 4 }, position: "relative",
    }} className="app-bg">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} style={{ width: "100%", maxWidth: 420 }}>
        {/* mobile-only logo */}
        <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 1.2, mb: 4 }}>
          <Box component="img" src="/icon-64.png" alt="Flexion logo" sx={{ width: 38, height: 38, borderRadius: "10px", display: "block" }} />
          <Typography sx={{ fontWeight: 800, letterSpacing: "0.06em" }}>FLEXION</Typography>
        </Box>

        {/* tab switch */}
        <Box sx={{
          display: "grid", gridTemplateColumns: "1fr 1fr", p: 0.6, mb: 3,
          borderRadius: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
        }}>
          {["login", "register"].map((t) => (
            <Box key={t} component="button" onClick={() => switchTab(t)} sx={{
              position: "relative", border: 0, cursor: "pointer", py: 1.2, borderRadius: "11px",
              background: "transparent", fontWeight: 700, fontSize: 14,
              color: tab === t ? "#fff" : "#9ca3af", textTransform: "capitalize",
              transition: "color 0.25s",
            }}>
              {tab === t && (
                <motion.span layoutId="auth-tab" style={{
                  position: "absolute", inset: 0, borderRadius: "11px", background: GRADIENTS.primary, zIndex: 0,
                }} />
              )}
              <Box component="span" sx={{ position: "relative", zIndex: 1 }}>{t}</Box>
            </Box>
          ))}
        </Box>

        <Typography sx={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", mb: 0.5 }}>
          {tab === "login" ? "Welcome back 👋" : "Create your account"}
        </Typography>
        <Typography sx={{ color: "text.secondary", fontWeight: 500, mb: 3 }}>
          {tab === "login" ? "Pick up right where you left off." : "Start tracking in under a minute. Free forever."}
        </Typography>

        <AnimatePresence mode="wait">
          <motion.form
            key={tab}
            onSubmit={submit}
            initial={{ opacity: 0, x: tab === "login" ? -14 : 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: tab === "login" ? 14 : -14 }}
            transition={{ duration: 0.25 }}
          >
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: "12px", fontWeight: 600 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 2, borderRadius: "12px", fontWeight: 600 }}>{success}</Alert>}

            {tab === "register" && (
              <>
                <TextField fullWidth variant="outlined" label="Full name" name="name" value={form.name} onChange={onChange} sx={inputSx}
                  InputProps={{ startAdornment: <InputAdornment position="start"><User size={17} color="#9ca3af" /></InputAdornment> }} />
                <TextField fullWidth variant="outlined" label="Email" name="email" type="email" value={form.email} onChange={onChange} sx={inputSx}
                  InputProps={{ startAdornment: <InputAdornment position="start"><Mail size={17} color="#9ca3af" /></InputAdornment> }} />
              </>
            )}
            <TextField fullWidth variant="outlined" label="Username" name="username" value={form.username} onChange={onChange} sx={inputSx}
              InputProps={{ startAdornment: <InputAdornment position="start"><AtSign size={17} color="#9ca3af" /></InputAdornment> }} />
            <PasswordField label="Password" name="password" value={form.password} onChange={onChange} />

            {tab === "register" && (
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, mb: 2, cursor: "pointer" }}
                onClick={() => setConsent(!consent)}>
                <Box component="input" type="checkbox" checked={consent} readOnly
                  sx={{ mt: 0.4, accentColor: "#22d3ee", width: 16, height: 16 }} />
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", lineHeight: 1.5 }}>
                  I agree to the processing of my data under the Privacy Policy (GDPR).
                  I can export or delete all my data anytime from Settings.
                </Typography>
              </Box>
            )}

            <Button
              type="submit" fullWidth variant="contained" disabled={loading}
              endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ArrowRight size={18} />}
              sx={{ mt: 1, py: 1.4, fontSize: 15, fontWeight: 700, background: GRADIENTS.primary }}
            >
              {loading ? "Please wait…" : tab === "login" ? "Log in" : "Create account"}
            </Button>
          </motion.form>
        </AnimatePresence>
      </motion.div>
    </Box>
  );
}

export default function Auth() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      <VisualPanel />
      <AuthForm />
    </Box>
  );
}