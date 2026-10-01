import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography, IconButton, Avatar, TextField, InputAdornment } from "@mui/material";
import { Bot, X, Send } from "lucide-react";
import { GRADIENTS } from "../theme";
import { coachReply, QUICK_QUESTIONS } from "../utils/coachKnowledge";

export default function Coach() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [lastMore, setLastMore] = useState(null);
  const [messages, setMessages] = useState([
    { from: "coach", text: "Hey! I'm your Flexion Coach 💪 Ask me about nutrition, training, recovery — or just say hi. Type 'what can you do?' anytime." },
  ]);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  const ask = (text) => {
    const q = (text ?? input).trim();
    if (!q || typing) return;
    setMessages((m) => [...m, { from: "user", text: q }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = coachReply(q, lastMore);
      setMessages((m) => [...m, { from: "coach", text: reply.text }]);
      setLastMore(reply.more || null); // enables "tell me more" follow-ups
      setTyping(false);
    }, 700 + Math.random() * 600);
  };

  return (
    <>
      {/* floating button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        style={{
          position: "fixed", bottom: 88, right: 18, zIndex: 300,
          width: 54, height: 54, borderRadius: "50%", border: "none", cursor: "pointer",
          background: GRADIENTS.primary, color: "#fff",
          display: "grid", placeItems: "center",
          boxShadow: "0 10px 30px rgba(34,211,238,0.45)",
        }}
        aria-label="Open Flexion Coach"
      >
        {open ? <X size={24} /> : <Bot size={26} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed", bottom: 152, right: 18, zIndex: 300,
              width: "min(360px, calc(100vw - 36px))",
              height: 480, borderRadius: "22px", overflow: "hidden",
              display: "flex", flexDirection: "column",
              background: "var(--chat-bg)", border: "1px solid var(--card-border)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
            }}
          >
            {/* header */}
            <Box sx={{
              display: "flex", alignItems: "center", gap: 1.2, px: 2, py: 1.5,
              background: GRADIENTS.primary, color: "#fff", flexShrink: 0,
            }}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: "var(--t8)", color: "#fff" }}>
                <Bot size={19} />
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 800, lineHeight: 1.1 }}>Flexion Coach</Typography>
                <Typography sx={{ fontSize: 10.5, fontWeight: 600, opacity: 0.9 }}>Nutrition & training assistant</Typography>
              </Box>
            </Box>

            {/* messages */}
            <Box ref={scrollRef} sx={{ flex: 1, overflowY: "auto", p: 1.6, display: "flex", flexDirection: "column", gap: 1 }}>
              {messages.map((m, i) => (
                <Box key={i} sx={{
                  alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%", px: 1.4, py: 1, borderRadius: "14px",
                  background: m.from === "user" ? GRADIENTS.primary : "rgba(128,128,150,0.15)",
                  color: m.from === "user" ? "#fff" : "text.primary",
                  fontSize: 13, fontWeight: 600, lineHeight: 1.55,
                  borderBottomRightRadius: m.from === "user" ? "4px" : "14px",
                  borderBottomLeftRadius: m.from === "user" ? "14px" : "4px",
                }}>
                  {m.text}
                </Box>
              ))}
              {typing && (
                <Box sx={{ alignSelf: "flex-start", px: 1.4, py: 1, borderRadius: "14px", background: "rgba(128,128,150,0.15)" }}>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    {[0, 1, 2].map((d) => (
                      <motion.span key={d} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, delay: d * 0.2 }}
                        style={{ width: 6, height: 6, borderRadius: "50%", background: "#9ca3af" }} />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>

            {/* quick questions (first message only) */}
            <Box sx={{ px: 1.6, pb: 1, display: "flex", gap: 0.8, flexWrap: "wrap", flexShrink: 0 }}>
                {lastMore && (
                  <Box component="button" onClick={() => ask("tell me more")} sx={{
                    border: "1px solid rgba(168,85,247,0.45)", background: "rgba(168,85,247,0.1)",
                    color: "#a855f7", borderRadius: "999px", px: 1.2, py: 0.5,
                    fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                  }}>
                    ✨ Tell me more
                  </Box>
                )}
                {messages.length <= 3 && QUICK_QUESTIONS.map((qq) => (
                  <Box key={qq} component="button" onClick={() => ask(qq)} sx={{
                    border: "1px solid rgba(34,211,238,0.35)", background: "rgba(34,211,238,0.08)",
                    color: "#22d3ee", borderRadius: "999px", px: 1.2, py: 0.5,
                    fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                  }}>
                    {qq}
                  </Box>
                ))}
            </Box>

            {/* input */}
            <Box sx={{ display: "flex", gap: 1, p: 1.4, borderTop: "1px solid var(--card-border)", flexShrink: 0 }}>
              <TextField
                fullWidth size="small" value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && ask()}
                placeholder="Ask about meals, training…"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px", background: "var(--input-bg)",
                    "& fieldset": { borderColor: "var(--card-border)" },
                    "&.Mui-focused fieldset": { borderColor: "#22d3ee" },
                    "& input": { color: "text.primary", fontSize: 13, fontWeight: 600 },
                  },
                }}
              />
              <IconButton onClick={() => ask()} sx={{
                background: GRADIENTS.primary, color: "#fff", borderRadius: "12px",
                "&:hover": { filter: "brightness(1.1)" },
              }}>
                <Send size={17} />
              </IconButton>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}