import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Box, Typography, Button } from "@mui/material";
import {
  ArrowRight, Dumbbell, UtensilsCrossed, TrendingUp, Bot, BellRing, Gamepad2,
  ShieldCheck, Smartphone, Sparkles, CheckCircle2,
} from "lucide-react";
import { GRADIENTS } from "../theme";

const FEATURES = [
  { icon: <Dumbbell size={22} />, title: "Workout Tracking", desc: "Build routines with exercises, sets, reps & weights. Categories, tags and volume analytics.", color: "#22d3ee" },
  { icon: <UtensilsCrossed size={22} />, title: "Nutrition Logging", desc: "Log meals with full macros, quick-add foods, and 7-day calorie trend charts.", color: "#a855f7" },
  { icon: <TrendingUp size={22} />, title: "Progress Analytics", desc: "Weight, measurements and lift progress rendered as beautiful live charts.", color: "#34d399" },
  { icon: <Bot size={22} />, title: "AI Coach", desc: "Ask anything — cutting, bulking, protein, plateaus. 80+ topics built in.", color: "#f97316" },
  { icon: <BellRing size={22} />, title: "Smart Reminders", desc: "Workout, meal and goal notifications at the times you choose.", color: "#38bdf8" },
  { icon: <Gamepad2 size={22} />, title: "Gamified", desc: "Streaks, consistency heatmap, fitness score and a calorie-guessing arcade.", color: "#f59e0b" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.55, ease: "easeOut" } }),
};

export default function Landing() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("flexion_token");
  const cta = () => navigate(isLoggedIn ? "/dashboard" : "/auth");

  return (
    <Box className="app-bg" sx={{ minHeight: "100vh", bgcolor: "background.default", color: "text.primary" }}>
      {/* Nav */}
      <Box sx={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        px: { xs: 2.5, md: 6 }, py: 2.2, position: "sticky", top: 0, zIndex: 50,
        background: "rgba(10,10,20,0.75)", backdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--t8)",
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Box component="img" src="/icon-64.png" alt="Flexion logo" sx={{ width: 36, height: 36, borderRadius: "10px", display: "block" }} />
          <Box>
            <Typography sx={{ fontWeight: 800, letterSpacing: "0.05em", lineHeight: 1 }}>FLEXION</Typography>
            <Typography sx={{ fontSize: 8.5, color: "#22d3ee", letterSpacing: "0.24em", fontWeight: 700 }}>FITNESS OS</Typography>
          </Box>
        </Box>
        <Button onClick={cta} variant="contained" endIcon={<ArrowRight size={16} />}
          sx={{ background: GRADIENTS.primary, color: "#fff", fontWeight: 700, borderRadius: "12px" }}>
          {isLoggedIn ? "Open App" : "Get Started"}
        </Button>
      </Box>

      {/* Hero */}
      <Box sx={{
        display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4,
        alignItems: "center", px: { xs: 3, md: 8 }, py: { xs: 6, md: 10 }, maxWidth: 1300, mx: "auto",
      }}>
        <Box>
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <Box sx={{
              display: "inline-flex", alignItems: "center", gap: 0.8, px: 1.6, py: 0.6, mb: 2.5,
              borderRadius: "999px", background: "rgba(34,211,238,0.1)", border: "1px solid rgba(34,211,238,0.3)",
            }}>
              <Sparkles size={13} color="#22d3ee" />
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#22d3ee" }}>Your all-in-one fitness companion</Typography>
            </Box>
            <Typography sx={{ fontSize: { xs: 38, md: 56 }, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.08, mb: 2 }}>
              Track. Analyze.
              <Box component="span" sx={{ display: "block", background: GRADIENTS.primary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Transform.
              </Box>
            </Typography>
            <Typography sx={{ color: "text.secondary", fontWeight: 500, fontSize: 16.5, lineHeight: 1.75, mb: 3.5, maxWidth: 480 }}>
              Workouts, nutrition and progress — unified in one stunning dashboard with live analytics, an AI coach, reminders and gamification that keeps you consistent.
            </Typography>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              <Button onClick={cta} variant="contained" size="large" endIcon={<ArrowRight size={18} />}
                sx={{ background: GRADIENTS.primary, color: "#fff", fontWeight: 800, borderRadius: "14px", px: 4, py: 1.4, fontSize: 16 }}>
                {isLoggedIn ? "Open Dashboard" : "Start Free"}
              </Button>
              <Button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
                variant="outlined" size="large"
                sx={{ color: "text.secondary", borderColor: "var(--t12)", borderRadius: "14px", px: 3, fontWeight: 700 }}>
                Explore features
              </Button>
            </Box>
            <Box sx={{ display: "flex", gap: 3, mt: 4, flexWrap: "wrap" }}>
              {["Free forever", "No credit card", "Export anytime"].map((t) => (
                <Box key={t} sx={{ display: "flex", alignItems: "center", gap: 0.6, color: "text.secondary", fontSize: 13, fontWeight: 600 }}>
                  <CheckCircle2 size={15} color="#34d399" /> {t}
                </Box>
              ))}
            </Box>
          </motion.div>
        </Box>
        <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}>
          <Box component="img" src="/hero.png" alt="Flexion dashboard preview"
            sx={{ width: "100%", borderRadius: "24px", border: "1px solid var(--t12)", boxShadow: "0 30px 80px rgba(0,0,0,0.5)" }} />
        </motion.div>
      </Box>

      {/* Features */}
      <Box id="features" sx={{ px: { xs: 3, md: 8 }, py: { xs: 6, md: 9 }, maxWidth: 1300, mx: "auto" }}>
        <Typography sx={{ textAlign: "center", fontSize: { xs: 26, md: 34 }, fontWeight: 800, letterSpacing: "-0.02em", mb: 1 }}>
          Everything you need to
          <Box component="span" sx={{ background: GRADIENTS.primary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> level up</Box>
        </Typography>
        <Typography sx={{ textAlign: "center", color: "text.secondary", fontWeight: 500, mb: 5, maxWidth: 560, mx: "auto" }}>
          Six pillars, one app. Built to be as beautiful as it is useful.
        </Typography>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "repeat(3, 1fr)" }, gap: 2.5 }}>
          {FEATURES.map((ft, i) => (
            <motion.div key={ft.title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} custom={i}
              whileHover={{ y: -6 }}>
              <Box sx={{
                borderRadius: "20px", p: 3, height: "100%",
                background: "var(--card-bg)", border: "1px solid var(--card-border)",
                boxShadow: "var(--card-shadow)", transition: "border-color 0.2s",
                "&:hover": { borderColor: ft.color },
              }}>
                <Box sx={{
                  width: 46, height: 46, borderRadius: "13px", mb: 2,
                  background: `${ft.color}1e`, color: ft.color,
                  display: "grid", placeItems: "center", border: `1px solid ${ft.color}40`,
                }}>
                  {ft.icon}
                </Box>
                <Typography sx={{ fontSize: 16.5, fontWeight: 800, mb: 0.8 }}>{ft.title}</Typography>
                <Typography sx={{ fontSize: 13.5, color: "text.secondary", fontWeight: 500, lineHeight: 1.65 }}>{ft.desc}</Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Trust band */}
      <Box sx={{ borderTop: "1px solid var(--t8)", borderBottom: "1px solid var(--t8)", background: "rgba(255,255,255,0.02)" }}>
        <Box sx={{
          display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "repeat(4, 1fr)" }, gap: 3,
          px: { xs: 3, md: 8 }, py: 5, maxWidth: 1300, mx: "auto", textAlign: "center",
        }}>
          {[
            { icon: <ShieldCheck size={22} />, t: "JWT + bcrypt security", c: "#34d399" },
            { icon: <Smartphone size={22} />, t: "Fully mobile responsive", c: "#22d3ee" },
            { icon: <Sparkles size={22} />, t: "Installable PWA", c: "#a855f7" },
            { icon: <Bot size={22} />, t: "Built-in AI coach", c: "#f97316" },
          ].map((x, i) => (
            <motion.div key={x.t} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}>
              <Box sx={{ color: x.c, display: "flex", justifyContent: "center", mb: 1 }}>{x.icon}</Box>
              <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: "text.secondary" }}>{x.t}</Typography>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* CTA */}
      <Box sx={{ textAlign: "center", px: 3, py: { xs: 8, md: 11 } }}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <Typography sx={{ fontSize: { xs: 28, md: 40 }, fontWeight: 800, letterSpacing: "-0.02em", mb: 1.5 }}>
            Your streak starts
            <Box component="span" sx={{ background: GRADIENTS.fire, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}> today</Box>
          </Typography>
          <Typography sx={{ color: "text.secondary", fontWeight: 500, mb: 3.5 }}>Free forever. Your data stays yours — export or delete anytime.</Typography>
          <Button onClick={cta} variant="contained" size="large" endIcon={<ArrowRight size={18} />}
            sx={{ background: GRADIENTS.primary, color: "#fff", fontWeight: 800, borderRadius: "14px", px: 5, py: 1.5, fontSize: 16 }}>
            {isLoggedIn ? "Open the App" : "Create your account"}
          </Button>
        </motion.div>
      </Box>

      {/* Footer */}
      <Box sx={{ borderTop: "1px solid var(--t8)", py: 3.5, textAlign: "center" }}>
        <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: "text.secondary" }}>
          FLEXION · Fitness OS — built with the MERN stack · {new Date().getFullYear()}
        </Typography>
      </Box>
    </Box>
  );
}