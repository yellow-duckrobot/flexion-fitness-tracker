import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box, Typography, Avatar, Button, Dialog, DialogTitle, DialogContent, LinearProgress, Chip, IconButton, Snackbar, Alert, TextField, InputAdornment,
} from "@mui/material";
import {
  Flame, Dumbbell, UtensilsCrossed, TrendingUp, Zap, Trophy, ArrowRight,
  Plus, Droplets, Scale, CheckCircle2, Circle, GlassWater, Bell, Search, CheckCheck, Weight, CalendarDays,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip as RTooltip,
  PieChart, Pie, Cell as PieCell, AreaChart, Area, CartesianGrid,
} from "recharts";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { glassCard, GRADIENTS } from "../theme";
import { kgToUnit, weightLabel } from "../utils/units";
import ActivityHeatmap from "../components/ActivityHeatmap";
import { GOAL_PLANS } from "../utils/goals";

const API = "https://wiring-archive-lenses-furnished.trycloudflare.com/api";
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("flexion_token")}`,
});
const CALORIE_GOAL = 2500;

/* ---------------- helpers ---------------- */
function CountUp({ to, duration = 1.4 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf; const start = performance.now();
    const tick = (t) => {
      const p = Math.min((t - start) / (duration * 1000), 1);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{val.toLocaleString()}</>;
}

function ScoreRing({ score }) {
  const R = 62, C = 2 * Math.PI * R;
  const color = score >= 80 ? "#34d399" : score >= 60 ? "#22d3ee" : "#f97316";
  return (
    <Box sx={{ position: "relative", width: 170, height: 170, mx: "auto" }}>
      <svg width="170" height="170" style={{ transform: "rotate(-90deg)" }}>
        <circle cx="85" cy="85" r={R} fill="none" stroke="var(----t8)" strokeWidth="11" />
        <motion.circle
          cx="85" cy="85" r={R} fill="none" stroke={color} strokeWidth="11"
          strokeLinecap="round" strokeDasharray={C}
          initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - score / 100) }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
      </svg>
      <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        <Typography sx={{ fontSize: 46, fontWeight: 800, color, letterSpacing: "-0.03em", lineHeight: 1 }}>
          <CountUp to={score} />
        </Typography>
      </Box>
    </Box>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" } }),
};

function Card({ children, i = 0, sx = {} }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" custom={i}
      whileHover={{ y: -4, transition: { duration: 0.2 } }} style={{ display: "flex" }}>
      <Box sx={{ ...glassCard, width: "100%", ...sx }}>{children}</Box>
    </motion.div>
  );
}

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const dayKey = (d) => new Date(d).toDateString();
const volume = (w) => w.exercises.reduce((s, e) => s + (e.sets || 0) * (e.reps || 0) * (e.weight || 0), 0);
const mealKcal = (m) => m.items.reduce((s, i) => s + i.calories, 0);
const timeAgo = (d) => {
  const mins = Math.floor((Date.now() - new Date(d)) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

/* ============================ DASHBOARD ============================ */
export default function Dashboard() {
  const confettiFired = useRef(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("flexion_user") || "{}");
  const avatarUrl = user.profilePicture ? `https://wiring-archive-lenses-furnished.trycloudflare.com${user.profilePicture}` : null;

  const [workouts, setWorkouts] = useState([]);
  const [meals, setMeals] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [water, setWater] = useState(3);
  const [toast, setToast] = useState("");
  const [bellOpen, setBellOpen] = useState(false);
  const [goal, setGoal] = useState(user.goal || null);
  const [goalOpen, setGoalOpen] = useState(false);

  // onboarding: ask the goal ONCE per account, after data loads
  useEffect(() => {
    const asked = localStorage.getItem("flexion_goal_asked");
    if (loaded && !user.goal && !goal && !asked) setGoalOpen(true);
  }, [loaded]); // eslint-disable-line
  const [lastRead, setLastRead] = useState(localStorage.getItem("flexion_notif_read") || 0);
  // search
  const [q, setQ] = useState("");
  const [results, setResults] = useState(null);

  useEffect(() => {
    (async () => {
      const [wRes, mRes, pRes] = await Promise.all([
        fetch(`${API}/workouts`, { headers: authHeaders() }),
        fetch(`${API}/nutrition`, { headers: authHeaders() }),
        fetch(`${API}/progress`, { headers: authHeaders() }),
      ]);
      if (wRes.ok) setWorkouts(await wRes.json());
      if (mRes.ok) setMeals(await mRes.json());
      if (pRes.ok) setProgress(await pRes.json());
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (confettiFired.current) return;
    confettiFired.current = true;
    confetti({ particleCount: 90, spread: 75, origin: { y: 0.25 }, colors: ["#22d3ee", "#a855f7", "#f97316", "#ffffff"] });
  }, []);

  /* ---------- computed real data ---------- */
  const todayKey = dayKey(new Date());
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 6);

  const todaysMeals = meals.filter((m) => dayKey(m.date) === todayKey);
  const nutri = todaysMeals.reduce(
    (t, m) => m.items.reduce((a, i) => ({
      calories: a.calories + i.calories, protein: a.protein + i.protein, carbs: a.carbs + i.carbs, fat: a.fat + i.fat,
    }), t),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const weekWorkouts = workouts.filter((w) => new Date(w.date) >= weekAgo);

  // real streak: consecutive days (ending today) with any workout or meal
  const activityDates = useMemo(() => {
    const s = new Set();
    workouts.forEach((w) => s.add(dayKey(w.date)));
    meals.forEach((m) => s.add(dayKey(m.date)));
    return s;
  }, [workouts, meals]);
  const streak = useMemo(() => {
    let n = 0; const d = new Date();
    while (activityDates.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }, [activityDates]);

  // fitness score from real activity
  const caloriePart = nutri.calories ? Math.min(20, (nutri.calories / CALORIE_GOAL) * 20) : 0;
  const score = Math.min(100, Math.round(30 + weekWorkouts.length * 12 + caloriePart + Math.min(20, progress.length * 4)));

  // 7-day training volume chart
  const weekChart = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = dayKey(d);
      const vol = workouts.filter((w) => dayKey(w.date) === key).reduce((s, w) => s + volume(w), 0);
      days.push({ day: d.toLocaleDateString("en-US", { weekday: "short" }), vol, isToday: i === 0 });
    }
    return days;
  }, [workouts]);

  // merged real activity feed
  const feed = useMemo(() => {
    const events = [
      ...workouts.map((w) => ({
        icon: <Dumbbell size={17} />, text: `Completed ${w.name}`,
        sub: `${w.exercises.length} exercises · ${volume(w).toLocaleString()} kg volume`,
        time: w.date, color: "#22d3ee", tag: "Workout", link: "/workouts",
      })),
      ...meals.map((m) => ({
        icon: <UtensilsCrossed size={17} />, text: `Logged ${m.mealType}`,
        sub: `${mealKcal(m)} kcal · ${m.items.length} items`,
        time: m.date, color: "#a855f7", tag: "Nutrition", link: "/nutrition",
      })),
      ...progress.filter((p) => p.weight).map((p) => ({
        icon: <Scale size={17} />, text: `Weighed in at ${p.weight} kg`,
        sub: p.notes || "Progress entry",
        time: p.date, color: "#34d399", tag: "Progress", link: "/progress",
      })),
    ];
    return events.sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 6);
  }, [workouts, meals, progress]);

  const unreadCount = feed.filter((f) => new Date(f.time) > new Date(+lastRead || 0)).length;

  // longest streak ever (from activity history)
  const longestStreak = useMemo(() => {
    const times = [...activityDates].map((k) => new Date(k).getTime()).sort((a, b) => a - b);
    let best = 0, cur = 0, prev = null;
    for (const t of times) {
      cur = prev !== null && t - prev === 86400000 ? cur + 1 : 1;
      if (cur > best) best = cur;
      prev = t;
    }
    return best;
  }, [activityDates]);

  // confetti + toast on streak milestones (once per milestone)
  useEffect(() => {
    if (!loaded) return;
    const MILESTONES = [3, 7, 14, 30, 60, 100];
    if (MILESTONES.includes(streak)) {
      const done = JSON.parse(localStorage.getItem("flexion_milestones") || "[]");
      if (!done.includes(streak)) {
        confetti({ particleCount: 150, spread: 95, origin: { y: 0.3 }, colors: ["#f97316", "#22d3ee", "#a855f7", "#ffffff"] });
        setToast(`🔥 ${streak}-day streak milestone reached! Keep going!`);
        localStorage.setItem("flexion_milestones", JSON.stringify([...done, streak]));
      }
    }
  }, [loaded, streak]);

  const markAllRead = () => {
    const now = Date.now().toString();
    localStorage.setItem("flexion_notif_read", now);
    setLastRead(now);
  };

  /* ---------- search (debounced) ---------- */
  useEffect(() => {
    if (!q.trim()) { setResults(null); return; }
    const t = setTimeout(async () => {
      const res = await fetch(`${API}/users/search?q=${encodeURIComponent(q)}`, { headers: authHeaders() });
      const users = res.ok ? await res.json() : [];
      const ql = q.toLowerCase();
      setResults({
        workouts: workouts.filter((w) => w.name.toLowerCase().includes(ql)).slice(0, 3),
        meals: meals.filter((m) => m.items.some((i) => i.name.toLowerCase().includes(ql))).slice(0, 3),
        users,
      });
    }, 300);
    return () => clearTimeout(t);
  }, [q, workouts, meals]);

  const pickGoal = async (g) => {
    const res = await fetch(`${API}/users/me`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ goal: g }),
    });
    // remember locally no matter what, so the dialog never nags again
    localStorage.setItem("flexion_goal_asked", "1");
    localStorage.setItem("flexion_user", JSON.stringify({ ...user, goal: g }));
    setGoal(g);
    setGoalOpen(false);
    setToast(`Goal set: ${GOAL_PLANS[g].label} — plan unlocked! 🎯`);
    if (res.ok) {
      const data = await res.json();
      window.dispatchEvent(new Event("flexion-user-updated"));
    }
  };

  /* ---------- actions ---------- */
    const drink = (n) => {
    setWater(n);
    if (n === 8) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 }, colors: ["#38bdf8", "#22d3ee", "#ffffff"] });
      setToast("Hydration goal smashed! 8/8 glasses 🥤");
    }
  };
  const quickAction = (label) => setToast(`${label} — coming to your Workout & Nutrition pages 🔥`);

  const weights = progress.filter((p) => p.weight).map((p) => ({
    date: new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }), kg: p.weight,
  }));

  const donut = [
    { name: "Protein", value: nutri.protein, color: "#22d3ee" },
    { name: "Carbs", value: nutri.carbs, color: "#a855f7" },
    { name: "Fat", value: nutri.fat, color: "#f97316" },
  ].filter((d) => d.value > 0);

  const stats = [
    { icon: <Flame size={22} />, label: "Day Streak", value: streak, gradient: GRADIENTS.fire },
    { icon: <Dumbbell size={22} />, label: "Workouts (7d)", value: weekWorkouts.length, gradient: GRADIENTS.primary },
    { icon: <UtensilsCrossed size={22} />, label: "Calories today", value: nutri.calories, gradient: GRADIENTS.success },
    { icon: <Weight size={22} />, label: `Current weight (${weightLabel()})`, value: weights.length ? kgToUnit(weights[weights.length - 1].kg) : "—", gradient: GRADIENTS.primary },
  ];

  const searchOpen = q.trim().length > 0 && results;

  return (
    <Box className="app-bg" sx={{ minHeight: "100vh", p: { xs: 2, md: 4 }, maxWidth: 1280, mx: "auto" }}>
      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast("")} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert variant="filled" sx={{ borderRadius: "12px", fontWeight: 600, background: "#1e1e2e", border: "1px solid rgba(34,211,238,0.4)" }}>{toast}</Alert>
      </Snackbar>

      {/* ============ HEADER ============ */}
      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3.5, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 800, letterSpacing: "-0.02em" }}>
              {greeting()}, <Box component="span" sx={{ background: GRADIENTS.primary, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{user.name || "Champ"}</Box> 👋
            </Typography>
            <Typography sx={{ color: "text.secondary", fontWeight: 500, mt: 0.5 }}>
              {streak > 0 ? `You're on a ${streak}-day streak` : "Start logging to build your streak"} · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, flexShrink: 0, ml: { xs: "auto", md: 0 } }}>
            {/* Global search */}
            <Box sx={{ position: "relative", width: { xs: "100%", md: "auto" }, order: { xs: 3, md: 0 }, mt: { xs: 1, md: 0 } }}>
              <TextField
                size="small" value={q} onChange={(e) => setQ(e.target.value)}
                placeholder="Search workouts, meals, users…"
                sx={{
                 width: { xs: "100%", md: 260 },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px", background: "var(----t5)",
                    "& fieldset": { borderColor: "var(----t12)" },
                    "&:hover fieldset": { borderColor: "rgba(34,211,238,0.5)" },
                    "&.Mui-focused fieldset": { borderColor: "#22d3ee" },
                    "& input": { color: "text.primary", fontWeight: 600, fontSize: 13 },
                  },
                }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Search size={15} color="#9ca3af" /></InputAdornment>,
                }}
              />
              <AnimatePresence>
                {searchOpen && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} style={{ position: "absolute", top: "110%", left: 0, right: 0, zIndex: 200 }}>
                    <Box sx={{
                      background: "var(--chat-bg)", border: "1px solid var(----t12)",
                      borderRadius: "16px", p: 1.5, boxShadow: "0 20px 50px rgba(0,0,0,0.5)", maxHeight: 340, overflow: "auto",
                    }}>
                      {["workouts", "meals", "users"].every((k) => results[k].length === 0) && (
                        <Typography sx={{ color: "text.secondary", fontSize: 13, fontWeight: 600, textAlign: "center", py: 2 }}>
                          No results for "{q}"
                        </Typography>
                      )}
                      {results.workouts.length > 0 && (
                        <>
                          <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: "text.disabled", letterSpacing: "0.1em", px: 1, py: 0.6 }}>WORKOUTS</Typography>
                          {results.workouts.map((w) => (
                            <Box key={w._id} onClick={() => navigate("/workouts")} sx={{ display: "flex", alignItems: "center", gap: 1.2, px: 1, py: 0.9, borderRadius: "10px", cursor: "pointer", "&:hover": { background: "var(----t5)" } }}>
                              <Dumbbell size={15} color="#22d3ee" />
                              <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{w.name}</Typography>
                              <Typography sx={{ fontSize: 11, color: "text.secondary", ml: "auto" }}>{w.exercises.length} ex.</Typography>
                            </Box>
                          ))}
                        </>
                      )}
                      {results.meals.length > 0 && (
                        <>
                          <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: "text.disabled", letterSpacing: "0.1em", px: 1, py: 0.6 }}>MEALS</Typography>
                          {results.meals.map((m) => (
                            <Box key={m._id} onClick={() => navigate("/nutrition")} sx={{ display: "flex", alignItems: "center", gap: 1.2, px: 1, py: 0.9, borderRadius: "10px", cursor: "pointer", "&:hover": { background: "var(----t5)" } }}>
                              <UtensilsCrossed size={15} color="#a855f7" />
                              <Typography sx={{ fontSize: 13, fontWeight: 700, textTransform: "capitalize" }}>{m.mealType}</Typography>
                              <Typography sx={{ fontSize: 11, color: "text.secondary", ml: "auto" }}>{mealKcal(m)} kcal</Typography>
                            </Box>
                          ))}
                        </>
                      )}
                      {results.users.length > 0 && (
                        <>
                          <Typography sx={{ fontSize: 10.5, fontWeight: 800, color: "text.disabled", letterSpacing: "0.1em", px: 1, py: 0.6 }}>USERS</Typography>
                          {results.users.map((u) => (
                            <Box key={u._id} sx={{ display: "flex", alignItems: "center", gap: 1.2, px: 1, py: 0.9, borderRadius: "10px" }}>
                              <Avatar src={u.profilePicture ? `https://wiring-archive-lenses-furnished.trycloudflare.com${u.profilePicture}` : null}
                                sx={{ width: 26, height: 26, fontSize: 12, fontWeight: 800, background: GRADIENTS.fire }}>
                                {u.name?.charAt(0).toUpperCase()}
                              </Avatar>
                              <Box>
                                <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{u.name}</Typography>
                                <Typography sx={{ fontSize: 11, color: "text.secondary" }}>@{u.username}</Typography>
                              </Box>
                            </Box>
                          ))}
                        </>
                      )}
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>

            {/* Notifications bell */}
            <Box sx={{ position: "relative" }}>
              <IconButton onClick={() => setBellOpen(!bellOpen)} sx={{
                color: bellOpen ? "#22d3ee" : "text.secondary", bgcolor: "var(----t5)",
                "&:hover": { color: "#22d3ee" },
              }}>
                <Bell size={19} />
              </IconButton>
              {unreadCount > 0 && (
                <Box sx={{
                  position: "absolute", top: 4, right: 4, width: 15, height: 15, borderRadius: "50%",
                  background: "#ef4444", fontSize: 9, fontWeight: 800, display: "grid", placeItems: "center", color: "#fff",
                }}>
                  {unreadCount}
                </Box>
              )}
              <AnimatePresence>
                {bellOpen && (
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }} style={{ position: "absolute", top: "110%", right: 0, zIndex: 200, width: 320 }}>
                    <Box sx={{
                      background: "var(--chat-bg)", border: "1px solid var(----t12)",
                      borderRadius: "16px", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", overflow: "hidden",
                    }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 1.8, py: 1.3, borderBottom: "1px solid var(----t8)" }}>
                        <Typography sx={{ fontWeight: 800, fontSize: 14 }}>Notifications</Typography>
                        <Button size="small" startIcon={<CheckCheck size={13} />} onClick={markAllRead}
                          sx={{ color: "#22d3ee", fontWeight: 700, fontSize: 11, minWidth: 0 }}>
                          Mark all read
                        </Button>
                      </Box>
                      {feed.length === 0 ? (
                        <Typography sx={{ color: "text.secondary", fontSize: 13, fontWeight: 600, textAlign: "center", py: 3 }}>
                          No activity yet — log something! 🚀
                        </Typography>
                      ) : feed.slice(0, 5).map((f, i) => {
                        const unread = new Date(f.time) > new Date(+lastRead || 0);
                        return (
                          <Box key={i} onClick={() => { setBellOpen(false); navigate(f.link); }}
                            sx={{
                              display: "flex", gap: 1.2, px: 1.8, py: 1.2, cursor: "pointer",
                              borderBottom: "1px solid var(----t5)",
                              "&:hover": { background: "var(----t5)" },
                            }}>
                            <Box sx={{ width: 7, height: 7, borderRadius: "50%", mt: 0.8, flexShrink: 0, background: unread ? "#22d3ee" : "transparent", boxShadow: unread ? "0 0 8px #22d3ee" : "none" }} />
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography sx={{ fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.text}</Typography>
                              <Typography sx={{ fontSize: 11, color: "text.secondary", fontWeight: 600 }}>{timeAgo(f.time)}</Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
            <Box onClick={() => navigate("/profile")} sx={{ cursor: "pointer", borderRadius: "50%", transition: "transform 0.2s", "&:hover": { transform: "scale(1.08)" } }}>
              <Avatar src={avatarUrl} sx={{ width: 46, height: 46, background: GRADIENTS.fire, border: "2px solid #22d3ee", fontWeight: 700 }}>
                {(user.name || "C").charAt(0).toUpperCase()}
              </Avatar>
            </Box>
          </Box>
        </Box>
      </motion.div>

      {/* click-away closes panels */}
      {(bellOpen || searchOpen) && (
        <Box onClick={() => { setBellOpen(false); setResults(null); setQ(""); }} sx={{ position: "fixed", inset: 0, zIndex: 150 }} />
      )}

      {/* ============ GRID ============ */}
      <Box sx={{ display: "grid", gap: 2.5, gridTemplateColumns: { xs: "1fr", md: "repeat(12, 1fr)" } }}>
        {/* Fitness score — computed from real activity */}
        <Box sx={{ gridColumn: { md: "span 4" } }}>
          <Card i={1} sx={{
            height: "100%",
            background: "linear-gradient(135deg,rgba(34,211,238,0.10),rgba(168,85,247,0.10)), var(----t3)",
            display: "flex", flexDirection: "column", justifyContent: "center",
          }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2.5 }}>
              <Chip icon={<Zap size={14} />} label={score >= 70 ? "READY TO TRAIN" : "GET MOVING"} size="small"
                sx={{ bgcolor: "rgba(52,211,153,0.12)", color: "#34d399", fontWeight: 700, fontSize: 11 }} />
              <Chip label={`${weekWorkouts.length} workouts this week`} size="small" sx={{ bgcolor: "rgba(34,211,238,0.12)", color: "#22d3ee", fontWeight: 600 }} />
            </Box>
            <ScoreRing score={score} />
            <Typography sx={{ textAlign: "center", fontSize: 11, fontWeight: 800, color: "text.secondary", letterSpacing: "0.25em", mt: 1.5 }}>
              FITNESS SCORE
            </Typography>
            <Typography align="center" sx={{ color: "text.secondary", fontWeight: 500, fontSize: 13, mt: 1.5, lineHeight: 1.6 }}>
              Computed from your {weekWorkouts.length} workouts, {nutri.calories.toLocaleString()} kcal
              eaten{progress.length > 0 ? ` & ${progress.length} progress entries` : ""}.
            </Typography>
          </Card>
        </Box>

        {/* Stat tiles — real data */}
        <Box sx={{ gridColumn: { md: "span 8" } }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2.5, height: "100%" }}>
            {stats.map((s, i) => (
              <Card key={s.label} i={i + 2}>
                <Box sx={{ width: 42, height: 42, borderRadius: "13px", background: s.gradient, display: "grid", placeItems: "center", mb: 1.5, color: "#fff", boxShadow: "0 6px 18px rgba(0,0,0,0.35)" }}>
                  {s.icon}
                </Box>
                <Typography sx={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                  {typeof s.value === "number" ? <CountUp to={s.value} /> : s.value}
                </Typography>
                <Typography sx={{ fontSize: 12.5, fontWeight: 600, color: "text.secondary", mt: 0.5 }}>{s.label}</Typography>
              </Card>
            ))}
          </Box>
        </Box>

        {/* 7-day training volume — workout analytics */}
        <Box sx={{ gridColumn: { md: "span 7" } }}>
          <Card i={5}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography sx={{ fontSize: 17, fontWeight: 700 }}>7-Day Training Volume</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "text.secondary", fontSize: 12, fontWeight: 600 }}>
                {weekChart.reduce((s, d) => s + d.vol, 0).toLocaleString()} kg total
              </Box>
            </Box>
            {weekChart.every((d) => d.vol === 0) ? (
              <Box sx={{ textAlign: "center", py: 5, color: "text.disabled", fontWeight: 600, fontSize: 13 }}>
                No workouts this week — log one to see your volume 💪
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={225}>
                <BarChart data={weekChart}>
                  <CartesianGrid vertical={false} stroke="var(----t5)" />
                  <XAxis dataKey="day" tick={{ fill: "#9ca3af", fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} dy={6} />
                  <YAxis hide />
                  <RTooltip cursor={{ fill: "var(----t5)" }}
                    contentStyle={{ background: "var(--chat-bg)", border: "1px solid var(----t12)", borderRadius: "14px", fontWeight: 700, fontSize: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.45)" }}
                    formatter={(v) => [`${v.toLocaleString()} kg`, "Volume"]} />
                  <Bar dataKey="vol" radius={[8, 8, 0, 0]} animationDuration={1000}>
                    {weekChart.map((d, i) => (
                      <Cell key={i} fill={d.isToday ? "#a855f7" : d.vol > 0 ? "#22d3ee" : "var(----t8)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Box>

        {/* Nutrition today — live */}
        <Box sx={{ gridColumn: { md: "span 5" } }}>
          <Card i={6}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
              <Typography sx={{ fontSize: 17, fontWeight: 700 }}>Nutrition Today</Typography>
              <Box onClick={() => navigate("/nutrition")} sx={{ display: "flex", alignItems: "center", gap: 0.3, color: "#22d3ee", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                Details <ArrowRight size={14} />
              </Box>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <ResponsiveContainer width="42%" height={140}>
                <PieChart>
                  <Pie data={donut.length ? donut : [{ name: "None", value: 1, color: "#2a2a3a" }]}
                    innerRadius={42} outerRadius={60} paddingAngle={4} dataKey="value" strokeWidth={0} animationDuration={1000}>
                    {(donut.length ? donut : [{ color: "#2a2a3a" }]).map((m, i) => <PieCell key={i} fill={m.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ flex: 1 }}>
                {[
                  { name: "Protein", value: nutri.protein, color: "#22d3ee" },
                  { name: "Carbs", value: nutri.carbs, color: "#a855f7" },
                  { name: "Fat", value: nutri.fat, color: "#f97316" },
                ].map((m) => (
                  <Box key={m.name} sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 1 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: m.color, boxShadow: `0 0 8px ${m.color}` }} />
                    <Typography sx={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{m.name}</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 800 }}>{m.value}g</Typography>
                  </Box>
                ))}
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: "text.secondary", mt: 0.5 }}>
                  {nutri.calories.toLocaleString()} / {CALORIE_GOAL.toLocaleString()} kcal · {todaysMeals.length} meals
                </Typography>
              </Box>
            </Box>
          </Card>
        </Box>

        {/* Weight progress — real */}
        <Box sx={{ gridColumn: { md: "span 7" } }}>
          <Card i={7}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography sx={{ fontSize: 17, fontWeight: 700 }}>Weight Progress</Typography>
              {weights.length >= 2 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: weights[weights.length - 1].kg <= weights[0].kg ? "#34d399" : "#f97316", fontSize: 12, fontWeight: 700 }}>
                  {weights[weights.length - 1].kg <= weights[0].kg ? <TrendingUp size={14} style={{ transform: "scaleY(-1)" }} /> : <TrendingUp size={14} />}
                  {(weights[weights.length - 1].kg - weights[0].kg).toFixed(1)} kg total
                </Box>
              )}
            </Box>
            {weights.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 5, color: "text.disabled", fontWeight: 600, fontSize: 13 }}>
                No weight logged yet — add an entry on the Progress page ⚖️
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={205}>
                <AreaChart data={weights}>
                  <defs>
                    <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="var(----t5)" />
                  <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} dy={6} />
                  <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
                  <RTooltip contentStyle={{ background: "var(--chat-bg)", border: "1px solid var(----t12)", borderRadius: "14px", fontWeight: 700, fontSize: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.45)" }}
                    formatter={(v) => [`${v} kg`, "Weight"]} />
                  <Area type="monotone" dataKey="kg" stroke="#22d3ee" strokeWidth={3} fill="url(#wGrad)"
                    dot={{ r: 4, fill: "#22d3ee", strokeWidth: 0 }} activeDot={{ r: 6, fill: "#a855f7" }} animationDuration={1200} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Box>

        {/* Hydration */}
        <Box sx={{ gridColumn: { md: "span 5" } }}>
          <Card i={8} sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Typography sx={{ fontSize: 17, fontWeight: 700 }}>Hydration</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: "#38bdf8", fontSize: 12, fontWeight: 700 }}>
                <Droplets size={15} /> {water}/8 glasses
              </Box>
            </Box>
            <LinearProgress variant="determinate" value={(water / 8) * 100} sx={{
              height: 8, borderRadius: 4, mb: 2, bgcolor: "var(----t8)",
              "& .MuiLinearProgress-bar": { background: "linear-gradient(90deg,#38bdf8,#22d3ee)", borderRadius: 4 },
            }} />
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, flex: 1 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <Box key={i} onClick={() => drink(i < water ? i : i + 1)} sx={{
                  display: "grid", placeItems: "center", py: 1.4, borderRadius: "12px", cursor: "pointer",
                  border: "1px solid", transition: "all 0.2s",
                  borderColor: i < water ? "rgba(56,189,248,0.5)" : "var(----t8)",
                  background: i < water ? "rgba(56,189,248,0.12)" : "var(----t3)",
                  color: i < water ? "#38bdf8" : "#4b5563",
                  "&:hover": { transform: "translateY(-3px)", borderColor: "#38bdf8" },
                }}>
                  <GlassWater size={22} />
                </Box>
              ))}
            </Box>
          </Card>
        </Box>

        {/* Quick actions */}
        <Box sx={{ gridColumn: { md: "span 4" } }}>
          <Card i={9} sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontSize: 17, fontWeight: 700, mb: 2 }}>Quick Actions</Typography>
            {[
              { icon: <Dumbbell size={19} />, label: "Log a workout", grad: GRADIENTS.primary, action: () => navigate("/workouts") },
              { icon: <UtensilsCrossed size={19} />, label: "Log a meal", grad: GRADIENTS.success, action: () => navigate("/nutrition") },
              { icon: <Scale size={19} />, label: "Weigh in", grad: GRADIENTS.fire, action: () => navigate("/progress") },
            ].map((a) => (
              <Box key={a.label} onClick={a.action} sx={{
                display: "flex", alignItems: "center", gap: 1.6, p: 1.5, mb: 1.2, borderRadius: "14px", cursor: "pointer",
                border: "1px solid var(----t8)", transition: "all 0.2s",
                "&:hover": { background: "var(----t5)", borderColor: "var(--t8)", transform: "translateX(4px)" },
              }}>
                <Box sx={{ width: 38, height: 38, borderRadius: "11px", background: a.grad, display: "grid", placeItems: "center", color: "#fff", flexShrink: 0 }}>
                  {a.icon}
                </Box>
                <Typography sx={{ flex: 1, fontSize: 14, fontWeight: 700 }}>{a.label}</Typography>
                <Plus size={16} color="#9ca3af" />
              </Box>
            ))}
          </Card>
        </Box>

        {/* Recent workouts preview */}
        <Box sx={{ gridColumn: { md: "span 4" } }}>
          <Card i={10} sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography sx={{ fontSize: 17, fontWeight: 700 }}>Recent Workouts</Typography>
              <Box onClick={() => navigate("/workouts")} sx={{ display: "flex", alignItems: "center", gap: 0.3, color: "#22d3ee", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                All <ArrowRight size={14} />
              </Box>
            </Box>
            {workouts.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 3, color: "text.disabled", fontWeight: 600, fontSize: 13 }}>
                No workouts yet 💪
              </Box>
            ) : workouts.slice(0, 4).map((w, i) => (
              <motion.div key={w._id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.08 }}>
                <Box sx={{
                  display: "flex", alignItems: "center", gap: 1.4, py: 1.1,
                  borderBottom: i < Math.min(workouts.length, 4) - 1 ? "1px solid var(----t8)" : "none",
                }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: "10px", background: "rgba(34,211,238,0.1)", color: "#22d3ee", display: "grid", placeItems: "center", flexShrink: 0 }}>
                    <Dumbbell size={15} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{w.name}</Typography>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "text.secondary" }}>{w.exercises.length} exercises · {timeAgo(w.date)}</Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Card>
        </Box>

        {/* Mini PR board */}
        <Box sx={{ gridColumn: { md: "span 4" } }}>
          <Card i={11} sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Trophy size={18} color="#f59e0b" />
              <Typography sx={{ fontSize: 17, fontWeight: 700 }}>Best Lifts</Typography>
            </Box>
            {(progress.filter((p) => p.liftWeight).length
              ? [...progress.filter((p) => p.liftWeight)].sort((a, b) => b.liftWeight - a.liftWeight).slice(0, 4)
                  .map((p) => ({ lift: new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }), val: `${p.liftWeight} kg`, date: timeAgo(p.date) }))
              : [
                  { lift: "Bench Press", val: "—", date: "log lifts" },
                  { lift: "Squat", val: "—", date: "on Progress" },
                  { lift: "Deadlift", val: "—", date: "page" },
                ]
            ).map((pr, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + i * 0.08 }}>
                <Box sx={{
                  display: "flex", alignItems: "center", gap: 1.5, p: 1.2, mb: 1, borderRadius: "12px",
                  background: "var(----t3)", border: "1px solid var(----t8)",
                }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: "50%", background: GRADIENTS.fire, flexShrink: 0 }} />
                  <Typography sx={{ flex: 1, fontSize: 13.5, fontWeight: 700 }}>{pr.lift}</Typography>
                  <Typography sx={{ fontSize: 13.5, fontWeight: 800, color: "#f59e0b" }}>{pr.val}</Typography>
                  <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: "text.secondary", width: 74, textAlign: "right" }}>{pr.date}</Typography>
                </Box>
              </motion.div>
            ))}
          </Card>
        </Box>

                {/* Goal plan */}
        {goal && GOAL_PLANS[goal] && (
          <Box sx={{ gridColumn: { md: "span 12" } }}>
            <Card i={4} sx={{ background: `linear-gradient(135deg, ${GOAL_PLANS[goal].color}14, transparent), var(--card-bg)` }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                  <Typography sx={{ fontSize: 22 }}>{GOAL_PLANS[goal].emoji}</Typography>
                  <Box>
                    <Typography sx={{ fontSize: 17, fontWeight: 800 }}>Your Plan: {GOAL_PLANS[goal].label}</Typography>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary" }}>{GOAL_PLANS[goal].headline}</Typography>
                  </Box>
                </Box>
                <Chip size="small" label="change in Settings" sx={{ bgcolor: "var(--t8)", color: "text.secondary", fontWeight: 700 }} />
              </Box>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2 }}>
                <Box>
                  <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#22d3ee", letterSpacing: "0.08em", mb: 1 }}>COACH TIPS</Typography>
                  {GOAL_PLANS[goal].tips.map((t, i) => (
                    <Box key={i} sx={{ display: "flex", gap: 1, mb: 0.9, alignItems: "flex-start" }}>
                      <Box component="span" sx={{ color: "#22d3ee", fontWeight: 800 }}>•</Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.secondary" }}>{t}</Typography>
                    </Box>
                  ))}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#f97316", letterSpacing: "0.08em", mb: 1 }}>RECOMMENDED FOODS</Typography>
                  {GOAL_PLANS[goal].foods.map((t, i) => (
                    <Box key={i} sx={{ display: "flex", gap: 1, mb: 0.9, alignItems: "flex-start" }}>
                      <Box component="span" sx={{ color: "#f97316", fontWeight: 800 }}>🍽</Box>
                      <Box>
                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{t.name}</Typography>
                        <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: "text.secondary" }}>{t.note}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Card>
          </Box>
        )}

        {/* Consistency heatmap — streak v2 */}
        <Box sx={{ gridColumn: { md: "span 12" } }}>
          <Card i={11}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5, flexWrap: "wrap", gap: 1 }}>
              <Box>
                <Typography sx={{ fontSize: 17, fontWeight: 700 }}>Consistency Heatmap</Typography>
                <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: "text.secondary" }}>Last 12 weeks · darker = more active</Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Chip size="small" icon={<Flame size={13} />} label={`current: ${streak}`}
                  sx={{ bgcolor: "rgba(249,115,22,0.12)", color: "#f97316", fontWeight: 700 }} />
                <Chip size="small" label={`longest: ${longestStreak}`}
                  sx={{ bgcolor: "rgba(168,85,247,0.12)", color: "#a855f7", fontWeight: 700 }} />
              </Box>
            </Box>
            <Box sx={{ overflowX: "auto" }}>
              <ActivityHeatmap workouts={workouts} meals={meals} />
            </Box>
            <Box sx={{ display: "flex", gap: 1.2, mt: 1.5, alignItems: "center" }}>
              <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: "text.secondary" }}>Less</Typography>
              {["var(--heat-0)", "#0e7490", "#22d3ee", "#a855f7", "#f97316"].map((c, i) => (
                <Box key={i} sx={{ width: 11, height: 11, borderRadius: "3px", background: c }} />
              ))}
              <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: "text.secondary" }}>More</Typography>
            </Box>
          </Card>
        </Box>

        {/* Recent Activity — merged real feed */}
        <Box sx={{ gridColumn: { md: "span 12" } }}>
          <Card i={12}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography sx={{ fontSize: 17, fontWeight: 700 }}>Recent Activity</Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary" }}>
                {loaded ? `${feed.length} recent events across workouts, nutrition & progress` : "Loading…"}
              </Typography>
            </Box>
            {!loaded ? (
              <Box className="skeleton" sx={{ height: 120, borderRadius: "14px" }} />
            ) : feed.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 5, color: "text.disabled", fontWeight: 600, fontSize: 13 }}>
                Nothing yet — log a workout, meal or weight to see your journey here 🚀
              </Box>
            ) : (
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 1 }}>
                {feed.map((f, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.08 }}>
                    <Box onClick={() => navigate(f.link)} sx={{
                      display: "flex", alignItems: "center", gap: 2, p: 1.5, borderRadius: "14px", cursor: "pointer",
                      border: "1px solid var(----t5)", transition: "background 0.2s, border-color 0.2s",
                      "&:hover": { background: "var(----t5)", borderColor: "var(----t12)" },
                    }}>
                      <Box sx={{
                        width: 40, height: 40, borderRadius: "12px", flexShrink: 0,
                        background: `${f.color}1e`, color: f.color, display: "grid", placeItems: "center",
                        border: `1px solid ${f.color}40`,
                      }}>
                        {f.icon}
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography sx={{ fontSize: 14, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.text}</Typography>
                          <Box component="span" sx={{
                            fontSize: 10, fontWeight: 700, px: 0.9, py: 0.2, borderRadius: "6px",
                            background: `${f.color}1a`, color: f.color, whiteSpace: "nowrap",
                          }}>
                            {f.tag}
                          </Box>
                        </Box>
                        <Typography sx={{ fontSize: 12, fontWeight: 500, color: "text.secondary", mt: 0.2 }}>{f.sub}</Typography>
                      </Box>
                      <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: "text.secondary", flexShrink: 0 }}>{timeAgo(f.time)}</Typography>
                    </Box>
                  </motion.div>
                ))}
              </Box>
            )}
          </Card>
        </Box>
</Box>

      {/* Goal onboarding dialog */}
      <Dialog open={goalOpen} maxWidth="sm" fullWidth
        slotProps={{ backdrop: { sx: { backgroundColor: "rgba(5,5,12,0.8)", backdropFilter: "blur(6px)" } },
                     paper: { sx: { background: "var(--chat-bg)", backgroundImage: "none", borderRadius: "22px", border: "1px solid var(--t12)" } } }}>
        <DialogTitle sx={{ fontWeight: 800, textAlign: "center", pt: 4 }}>
          What's your mission? 🎯
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ textAlign: "center", color: "text.secondary", fontWeight: 600, mb: 2.5, fontSize: 13.5 }}>
            Flexion personalizes your tips and food recommendations. Pick one — change it anytime in Settings.
          </Typography>
          <Box sx={{ display: "grid", gap: 1.5 }}>
            {Object.entries(GOAL_PLANS).map(([key, g]) => (
              <Box key={key} onClick={() => pickGoal(key)} sx={{
                display: "flex", alignItems: "center", gap: 1.6, p: 2, borderRadius: "16px", cursor: "pointer",
                border: "2px solid var(--t8)", background: "var(--t3)", transition: "all 0.2s",
                "&:hover": { borderColor: g.color, transform: "translateX(4px)" },
              }}>
                <Typography sx={{ fontSize: 28 }}>{g.emoji}</Typography>
                <Box>
                  <Typography sx={{ fontSize: 15, fontWeight: 800 }}>{g.label}</Typography>
                  <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: "text.secondary" }}>{g.headline}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}