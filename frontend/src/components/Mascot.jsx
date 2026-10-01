import { useEffect, useState } from "react";
import { motion, useAnimationControls, AnimatePresence } from "framer-motion";
import { Box } from "@mui/material";

const QUOTES = [
  "Sweat is just fat crying. Keep going! 💪",
  "You don't have to be extreme, just consistent.",
  "The only bad workout is the one that didn't happen.",
  "Discipline: choosing what you want MOST over what you want NOW.",
  "Small steps every day = massive results.",
  "Your future self is watching. Make them proud.",
  "Streaks are built one day at a time. Today counts.",
  "No one ever regretted a workout. Go. 🏃",
  "Progress, not perfection.",
  "Water first. Procrastinate later. 💧",
  "Muscle is built in the gym, revealed in the kitchen.",
  "One more rep than last time. That's the whole secret.",
  "Rest days count too — recovery is training.",
  "You've survived 100% of your hardest days so far.",
  "Motivation starts you. Habit keeps you. Results reward you. 🔥",
];

export default function Mascot() {
  const controls = useAnimationControls();
  const [running, setRunning] = useState(true);
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const run = () =>
      controls.start({
        x: [0, typeof window !== "undefined" ? window.innerWidth + 120 : 1500],
        transition: { duration: 13, repeat: Infinity, ease: "linear" },
      });
    if (running) run();
    else controls.stop();
  }, [running, controls]);

  const poke = () => {
    if (!running) return;
    controls.stop();
    setRunning(false);
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  };

  const resume = () => {
    setQuote(null);
    setRunning(true);
  };

  return (
    <>
      <Box
        component={motion.div}
        animate={controls}
        initial={{ x: -80 }}
        onClick={poke}
        title="Click me!"
        sx={{
          position: "fixed", bottom: 16, left: 0, zIndex: 260,
          fontSize: 34, cursor: "pointer", userSelect: "none",
          filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.4))",
        }}
      >
        <span style={{ display: "inline-block", transform: "scaleX(-1)" }}>
          <motion.span
            animate={running ? { rotate: [-8, 8, -8], y: [0, -5, 0] } : { rotate: 0, y: 0 }}
            transition={{ repeat: Infinity, duration: 0.35 }}
            style={{ display: "inline-block" }}
          >
            🏃‍♂️
          </motion.span>
        </span>
      </Box>

      <AnimatePresence>
        {quote && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            style={{ position: "fixed", bottom: 66, right: 18, zIndex: 261, width: 280 }}
          >
            <Box onClick={resume} sx={{
              background: "var(--chat-bg)", border: "1px solid rgba(34,211,238,0.4)",
              borderRadius: "16px 16px 4px 16px", p: 2, cursor: "pointer",
              boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
            }}>
              <Box sx={{ fontSize: 12.5, fontWeight: 700, color: "text.primary", lineHeight: 1.55 }}>
                {quote}
              </Box>
              <Box sx={{ fontSize: 10, fontWeight: 700, color: "#22d3ee", mt: 0.8 }}>tap to keep running →</Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}