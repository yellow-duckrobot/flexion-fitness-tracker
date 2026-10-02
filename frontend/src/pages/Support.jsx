import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Box, Typography, Button, Chip, TextField, Snackbar, Alert, Avatar,
} from "@mui/material";
import { LifeBuoy, Bug, MessageSquareHeart, Send, CheckCircle2, Clock } from "lucide-react";
import { glassCard, GRADIENTS } from "../theme";

const API = "https://sublime-grad-interventions-malpractice.trycloudflare.com/api";
const token = () => localStorage.getItem("flexion_token");

const TYPES = [
  { value: "support", label: "Get help", icon: <LifeBuoy size={17} />, color: "#22d3ee", desc: "Questions & assistance" },
  { value: "bug", label: "Report a bug", icon: <Bug size={17} />, color: "#ef4444", desc: "Something's broken" },
  { value: "feedback", label: "Feedback", icon: <MessageSquareHeart size={17} />, color: "#a855f7", desc: "Ideas & suggestions" },
];

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px", background: "var(----t5)",
    "& fieldset": { borderColor: "var(----t12)" },
    "&:hover fieldset": { borderColor: "rgba(34,211,238,0.55)" },
    "&.Mui-focused fieldset": { borderColor: "#22d3ee" },
    "& input, & textarea": { color: "text.primary", fontWeight: 600 },
  },
  "& .MuiInputLabel-root": { color: "text.secondary", fontWeight: 600 },
  mb: 2,
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
};

const STATUS_STYLE = {
  open: { color: "#f59e0b", label: "Open" },
  "in-review": { color: "#22d3ee", label: "In review" },
  resolved: { color: "#34d399", label: "Resolved" },
};

export default function Support() {
  const [type, setType] = useState("support");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [mine, setMine] = useState([]);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const loadMine = async () => {
    const res = await fetch(`${API}/feedback/mine`, { headers: { Authorization: `Bearer ${token()}` } });
    if (res.ok) setMine(await res.json());
  };
  useEffect(() => { loadMine(); }, []);

  const submit = async () => {
    setError("");
    if (!subject.trim() || !message.trim()) return setError("Please add a subject and a message.");
    setSending(true);
    const res = await fetch(`${API}/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ type, subject, message }),
    });
    const data = await res.json();
    setSending(false);
    if (!res.ok) return setError(data.message);
    setSubject(""); setMessage(""); setType("support");
    setToast("Message sent — we'll get back to you soon 💙");
    loadMine();
  };

  return (
    <Box className="app-bg" sx={{ minHeight: "100vh", p: { xs: 2, md: 4 }, maxWidth: 860, mx: "auto" }}>
      <Snackbar open={!!toast} autoHideDuration={2600} onClose={() => setToast("")} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert variant="filled" sx={{ borderRadius: "12px", fontWeight: 600, background: "#1e1e2e", border: "1px solid rgba(34,211,238,0.4)" }}>{toast}</Alert>
      </Snackbar>

      <Typography sx={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", mb: 0.5 }}>Support</Typography>
      <Typography sx={{ color: "text.secondary", fontWeight: 500, mb: 3 }}>We're here to help — or to hear your ideas.</Typography>

      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <Box sx={{ ...glassCard, mb: 3 }}>
          {/* type picker */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" }, gap: 1.5, mb: 3 }}>
            {TYPES.map((t) => (
              <Box
                key={t.value}
                onClick={() => setType(t.value)}
                sx={{
                  display: "flex", alignItems: "center", gap: 1.4, p: 1.6, borderRadius: "14px", cursor: "pointer",
                  border: "2px solid", transition: "all 0.2s",
                  borderColor: type === t.value ? t.color : "var(----t8)",
                  background: type === t.value ? `${t.color}14` : "var(----t3)",
                }}
              >
                <Box sx={{
                  width: 38, height: 38, borderRadius: "11px", display: "grid", placeItems: "center", flexShrink: 0,
                  background: type === t.value ? t.color : "var(----t8)",
                  color: type === t.value ? "#fff" : "#9ca3af", transition: "all 0.2s",
                }}>
                  {t.icon}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 13.5, fontWeight: 800 }}>{t.label}</Typography>
                  <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: "text.secondary" }}>{t.desc}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: "12px", fontWeight: 600 }}>{error}</Alert>}

          <TextField fullWidth label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)}
            sx={inputSx} placeholder="e.g. Can't upload profile picture" />
          <TextField fullWidth multiline rows={5} label="Message" value={message} onChange={(e) => setMessage(e.target.value)}
            sx={inputSx} placeholder="Describe what's happening, what you expected, steps to reproduce…" />

          <Button
            variant="contained" startIcon={<Send size={16} />} onClick={submit} disabled={sending}
            sx={{ background: GRADIENTS.primary, color: "#fff", fontWeight: 700, py: 1.2, px: 4, borderRadius: "12px", mt: 1 }}
          >
            {sending ? "Sending…" : "Send message"}
          </Button>
        </Box>
      </motion.div>

      {/* my submissions */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}>
        <Box sx={glassCard}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 2 }}>My requests</Typography>
          {mine.length === 0 ? (
            <Typography sx={{ color: "text.secondary", fontSize: 13.5, fontWeight: 600, py: 2, textAlign: "center" }}>
              Nothing submitted yet — your messages will appear here.
            </Typography>
          ) : (
            mine.map((f, i) => {
              const t = TYPES.find((x) => x.value === f.type);
              const st = STATUS_STYLE[f.status] || STATUS_STYLE.open;
              return (
                <motion.div key={f._id} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  <Box sx={{
                    display: "flex", alignItems: "flex-start", gap: 1.6, p: 1.6, mb: 1.2, borderRadius: "14px",
                    background: "var(----t3)", border: "1px solid var(----t8)",
                  }}>
                    <Avatar sx={{
                      width: 36, height: 36, borderRadius: "11px",
                      background: `${t.color}22`, color: t.color,
                    }}>
                      {t.icon}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                        <Typography sx={{ fontSize: 13.5, fontWeight: 800 }}>{f.subject}</Typography>
                        <Chip size="small" sx={{
                          height: 20, fontSize: 10, fontWeight: 800,
                          bgcolor: `${st.color}1c`, color: st.color,
                        }} label={
                          <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 0.3 }}>
                            {f.status === "resolved" ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                            {st.label}
                          </Box>
                        } />
                      </Box>
                      <Typography sx={{ fontSize: 12.5, fontWeight: 500, color: "text.secondary", mt: 0.3,
                        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {f.message}
                      </Typography>
                      <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: "text.disabled", mt: 0.5 }}>
                        {new Date(f.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              );
            })
          )}
        </Box>
      </motion.div>
    </Box>
  );
}