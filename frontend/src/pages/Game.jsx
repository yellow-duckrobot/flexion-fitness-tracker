import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography, Button, Chip, LinearProgress } from "@mui/material";
import { Flame, Snowflake, Dumbbell, Timer, Trophy, RotateCcw, Heart, Zap, Home } from "lucide-react";
import { glassCard, GRADIENTS } from "../theme";
import confetti from "canvas-confetti";

const FOODS = [
  { name: "Big Mac", kcal: 563, protein: 25, emoji: "🍔" },
  { name: "Slice of pizza", kcal: 285, protein: 12, emoji: "🍕" },
  { name: "Banana", kcal: 105, protein: 1, emoji: "🍌" },
  { name: "Granola bar", kcal: 190, protein: 4, emoji: "🍫" },
  { name: "Caesar salad", kcal: 470, protein: 10, emoji: "🥗" },
  { name: "Chicken breast 150g", kcal: 248, protein: 46, emoji: "🍗" },
  { name: "Frappuccino", kcal: 420, protein: 5, emoji: "🥤" },
  { name: "Avocado", kcal: 240, protein: 3, emoji: "🥑" },
  { name: "Croissant", kcal: 231, protein: 5, emoji: "🥐" },
  { name: "Cup of white rice", kcal: 205, protein: 4, emoji: "🍚" },
  { name: "Protein shake", kcal: 120, protein: 24, emoji: "🥛" },
  { name: "Bagel + cream cheese", kcal: 360, protein: 11, emoji: "🥯" },
  { name: "Almonds 28g", kcal: 164, protein: 6, emoji: "🌰" },
  { name: "Eggs (2)", kcal: 155, protein: 13, emoji: "🍳" },
  { name: "Blueberry muffin", kcal: 340, protein: 5, emoji: "🧁" },
  { name: "Sushi roll (6 pc)", kcal: 250, protein: 9, emoji: "🍣" },
  { name: "Caramel latte", kcal: 180, protein: 6, emoji: "☕" },
  { name: "Cinnamon roll", kcal: 420, protein: 6, emoji: "🥮" },
  { name: "Greek yogurt cup", kcal: 130, protein: 15, emoji: "🍦" },
  { name: "Beef steak 200g", kcal: 420, protein: 52, emoji: "🥩" },
  { name: "French fries (med)", kcal: 365, protein: 4, emoji: "🍟" },
  { name: "Tofu 150g", kcal: 120, protein: 14, emoji: "🧊" },
  { name: "Peanut butter 2 tbsp", kcal: 190, protein: 8, emoji: "🥜" },
  { name: "Apple", kcal: 95, protein: 0, emoji: "🍎" },
  // --- FAST FOOD ---
  { name: "McChicken", kcal: 400, protein: 14, emoji: "🍔" },
  { name: "Medium fries", kcal: 320, protein: 4, emoji: "🍟" },
  { name: "Chicken nuggets (6)", kcal: 250, protein: 13, emoji: "🍗" },
  { name: "Crunchwrap Supreme", kcal: 530, protein: 16, emoji: "🌮" },
  { name: "Fried chicken bucket piece", kcal: 390, protein: 23, emoji: "🍗" },
  { name: "Hot dog", kcal: 290, protein: 10, emoji: "🌭" },
  { name: "Onion rings (8)", kcal: 280, protein: 4, emoji: "🧅" },
  { name: "Fish & chips", kcal: 850, protein: 32, emoji: "🐟" },
  { name: "Biryani (plate)", kcal: 600, protein: 25, emoji: "🍛" },
  { name: "Shawarma wrap", kcal: 450, protein: 22, emoji: "🌯" },
  { name: "Butter chicken + naan", kcal: 750, protein: 35, emoji: "🍛" },
  { name: "Cheeseburger", kcal: 303, protein: 15, emoji: "🍔" },
  { name: "Falafel wrap", kcal: 420, protein: 14, emoji: "🧆" },
  // --- HEALTHY / PROTEIN ---
  { name: "Salmon fillet 150g", kcal: 310, protein: 34, emoji: "🐟" },
  { name: "Tuna can (in water)", kcal: 120, protein: 26, emoji: "🥫" },
  { name: "Cottage cheese cup", kcal: 180, protein: 24, emoji: "🧀" },
  { name: "Whey scoop (30g)", kcal: 110, protein: 24, emoji: "🥤" },
  { name: "Lentils (1 cup cooked)", kcal: 230, protein: 18, emoji: "🍲" },
  { name: "Chickpea salad", kcal: 280, protein: 12, emoji: "🥗" },
  { name: "Boiled eggs (3)", kcal: 210, protein: 18, emoji: "🥚" },
  { name: "Shrimp 100g", kcal: 99, protein: 24, emoji: "🦐" },
  { name: "Turkey breast 100g", kcal: 135, protein: 29, emoji: "🦃" },
  { name: "Quinoa (1 cup cooked)", kcal: 222, protein: 8, emoji: "🌾" },
  { name: "Sweet potato", kcal: 112, protein: 2, emoji: "🍠" },
  { name: "Edamame (1 cup)", kcal: 190, protein: 17, emoji: "🫛" },
  // --- DRINKS ---
  { name: "Coca-Cola can", kcal: 140, protein: 0, emoji: "🥤" },
  { name: "Orange juice (glass)", kcal: 110, protein: 2, emoji: "🧃" },
  { name: "Milkshake (med)", kcal: 500, protein: 12, emoji: "🥛" },
  { name: "Bubble tea", kcal: 350, protein: 2, emoji: "🧋" },
  { name: "Energy drink (can)", kcal: 110, protein: 0, emoji: "⚡" },
  { name: "Smoothie (banana+pb)", kcal: 380, protein: 12, emoji: "🍹" },
  // --- DESSERTS & SWEETS ---
  { name: "Chocolate donut", kcal: 350, protein: 4, emoji: "🍩" },
  { name: "Ice cream (2 scoops)", kcal: 250, protein: 4, emoji: "🍨" },
  { name: "Cheesecake slice", kcal: 320, protein: 6, emoji: "🍰" },
  { name: "Chocolate bar", kcal: 235, protein: 3, emoji: "🍫" },
  { name: "Cookies (2)", kcal: 160, protein: 2, emoji: "🍪" },
  { name: "Gulab jamun (2)", kcal: 300, protein: 5, emoji: "🍮" },
  { name: "Brownie", kcal: 280, protein: 3, emoji: "🟫" },
  // --- SNACKS ---
  { name: "Popcorn (buttered, med)", kcal: 210, protein: 3, emoji: "🍿" },
  { name: "Potato chips (small bag)", kcal: 160, protein: 2, emoji: "🥔" },
  { name: "Trail mix (small handful)", kcal: 175, protein: 5, emoji: "🥜" },
  { name: "Rice cakes (2)", kcal: 70, protein: 1, emoji: "🍘" },
  { name: "Hummus + pita", kcal: 260, protein: 8, emoji: "🫓" },
  { name: "Nachos w/ cheese", kcal: 450, protein: 9, emoji: "🌽" },
  // --- FRUITS & VEG ---
  { name: "Mango", kcal: 200, protein: 3, emoji: "🥭" },
  { name: "Grapes (cup)", kcal: 104, protein: 1, emoji: "🍇" },
  { name: "Watermelon (2 cups)", kcal: 90, protein: 2, emoji: "🍉" },
  { name: "Dates (3)", kcal: 200, protein: 1, emoji: "🌴" },
  { name: "Peanut butter toast", kcal: 210, protein: 8, emoji: "🍞" },
  { name: "Cheese slice", kcal: 113, protein: 7, emoji: "🧀" },
];

const MODES = {
  more: { label: "More Calories", icon: <Flame size={18} />, color: "#f97316", metric: "kcal", want: "higher", hint: "Which packs MORE calories?" },
  less: { label: "Fewer Calories", icon: <Snowflake size={18} />, color: "#38bdf8", metric: "kcal", want: "lower", hint: "Which is LIGHTER on calories?" },
  protein: { label: "More Protein", icon: <Dumbbell size={18} />, color: "#34d399", metric: "protein", want: "higher", hint: "Which has MORE protein?" },
  timed: { label: "Time Attack", icon: <Timer size={18} />, color: "#a855f7", metric: "kcal", want: "higher", hint: "45 seconds — answer as many as you can!" },
};

const ROUNDS = 10;
const LIVES = 3;
const TIMED_SECONDS = 45;

const pickTwo = () => {
  const a = Math.floor(Math.random() * FOODS.length);
  let b = Math.floor(Math.random() * FOODS.length);
  while (b === a) b = Math.floor(Math.random() * FOODS.length);
  return [FOODS[a], FOODS[b]];
};

const grade = (correct, total) =>
  correct === total ? { g: "S", msg: "FLAWLESS. You're a nutrition ninja! 🏆", color: "#f59e0b" }
  : correct >= total * 0.8 ? { g: "A", msg: "Sharp eye! Almost perfect.", color: "#22d3ee" }
  : correct >= total * 0.6 ? { g: "B", msg: "Solid knowledge — keep playing!", color: "#a855f7" }
  : correct >= total * 0.4 ? { g: "C", msg: "Getting there. Your instincts are warming up.", color: "#f97316" }
  : { g: "D", msg: "The kitchen surprises us all 😄 Run it back!", color: "#ef4444" };

export default function Game() {
  const [screen, setScreen] = useState("menu"); // menu | play | over
  const [mode, setMode] = useState("more");
  const [round, setRound] = useState(pickTwo);
  const [picked, setPicked] = useState(null);
  const [roundNum, setRoundNum] = useState(1);
  const [correct, setCorrect] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [timeLeft, setTimeLeft] = useState(TIMED_SECONDS);
  const [bests, setBests] = useState(() => JSON.parse(localStorage.getItem("flexion_game_bests") || "{}"));
  const timerRef = useRef(null);

  const M = MODES[mode];
  const [a, b] = round;
  const metric = M.metric;
  const correctIdx = M.want === "higher" ? (a[metric] > b[metric] ? 0 : 1) : (a[metric] < b[metric] ? 0 : 1);
  const answered = picked !== null;
  const wasRight = answered && picked === correctIdx;

  /* timed mode countdown */
  useEffect(() => {
    if (screen !== "play" || mode !== "timed") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current); setScreen("over"); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [screen, mode]);

  const start = (m) => {
    setMode(m);
    setScreen("play");
    setRound(pickTwo());
    setPicked(null);
    setRoundNum(1);
    setCorrect(0);
    setScore(0);
    setCombo(0);
    setBestCombo(0);
    setLives(LIVES);
    setTimeLeft(TIMED_SECONDS);
  };

  const guess = (i) => {
    if (answered) return;
    setPicked(i);
    if (i === correctIdx) {
      const pts = 10 + combo * 2;
      setScore((s) => s + pts);
      setCorrect((c) => c + 1);
      setCombo((c) => {
        const n = c + 1;
        setBestCombo((bb) => Math.max(bb, n));
        return n;
      });
    } else {
      setCombo(0);
      if (mode !== "timed") setLives((l) => l - 1);
    }
  };

  const next = () => {
    const last = mode === "timed" || roundNum >= ROUNDS;
    if (mode !== "timed" && lives <= 0 && !wasRight) { endGame(); return; }
    if (last && mode !== "timed") { endGame(); return; }
    setRound(pickTwo());
    setPicked(null);
    setRoundNum((n) => n + 1);
  };

  const endGame = () => {
    setScreen("over");
    const bestKey = mode === "timed" ? "timed" : mode;
    const val = mode === "timed" ? correct : score;
    if (!bests[bestKey] || val > bests[bestKey]) {
      setBests((old) => {
        const n = { ...old, [bestKey]: val };
        localStorage.setItem("flexion_game_bests", JSON.stringify(n));
        return n;
      });
    }
    const gr = grade(correct, mode === "timed" ? Math.max(correct, 1) : ROUNDS);
    if (gr.g === "S" || (mode === "timed" && correct >= 15)) {
      confetti({ particleCount: 160, spread: 100, origin: { y: 0.4 }, colors: ["#f59e0b", "#22d3ee", "#a855f7", "#f97316", "#ffffff"] });
    }
  };

  const gr = grade(correct, mode === "timed" ? Math.max(correct, 1) : ROUNDS);

  const foodCard = (food, i) => {
    const isPicked = picked === i;
    const isCorrectPick = answered && i === correctIdx;
    const isWrongPick = answered && isPicked && i !== correctIdx;
    const val = food[metric];
    const unit = metric === "kcal" ? "kcal" : "g protein";
    return (
      <motion.div
        key={food.name + i}
        whileHover={!answered ? { y: -8, scale: 1.02 } : {}}
        whileTap={!answered ? { scale: 0.96 } : {}}
        animate={isWrongPick ? { x: [0, -12, 12, -8, 8, 0] } : isCorrectPick ? { scale: [1, 1.04, 1] } : {}}
        style={{ flex: 1, minWidth: 230, cursor: answered ? "default" : "pointer" }}
      >
        <Box onClick={() => guess(i)} sx={{
          ...glassCard, textAlign: "center", py: { xs: 3, md: 4.5 }, position: "relative", overflow: "hidden",
          borderColor: isCorrectPick ? "#34d399" : isWrongPick ? "#ef4444" : "var(--card-border)",
          boxShadow: isCorrectPick ? "0 0 0 2px rgba(52,211,153,0.55), 0 12px 36px rgba(52,211,153,0.3)" : isWrongPick ? "0 0 0 2px rgba(239,68,68,0.5)" : "var(--card-shadow)",
          transition: "all 0.25s",
        }}>
          {isCorrectPick && answered && (
            <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}
              style={{ position: "absolute", top: 12, right: 12 }}>
              <Zap size={28} color="#34d399" />
            </motion.div>
          )}
          <motion.div animate={isCorrectPick ? { rotate: [0, -10, 10, 0] } : {}}>
            <Typography sx={{ fontSize: 64, mb: 1, filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.25))" }}>{food.emoji}</Typography>
          </motion.div>
          <Typography sx={{ fontSize: 16, fontWeight: 800, mb: 0.5, px: 1 }}>{food.name}</Typography>
          <AnimatePresence>
            {answered && (
              <motion.div initial={{ opacity: 0, y: 10, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", stiffness: 300 }}>
                <Chip
                  icon={metric === "kcal" ? <Flame size={13} /> : <Dumbbell size={13} />}
                  label={`${val} ${unit}`}
                  sx={{
                    mt: 1, fontWeight: 800, fontSize: 13,
                    bgcolor: i === correctIdx ? "rgba(52,211,153,0.15)" : "rgba(239,68,68,0.12)",
                    color: i === correctIdx ? "#34d399" : "#ef4444",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </motion.div>
    );
  };

  /* ---------------- MENU ---------------- */
  if (screen === "menu") {
    return (
      <Box className="app-bg" sx={{ minHeight: "100vh", p: { xs: 2, md: 4 }, maxWidth: 900, mx: "auto", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }}>
            <Typography sx={{ fontSize: 46, mb: 1 }}>🎮</Typography>
          </motion.div>
          <Typography sx={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em" }}>Snack or Stack</Typography>
          <Typography sx={{ color: "text.secondary", fontWeight: 500 }}>The calorie-guessing arcade. Pick a mode:</Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
          {Object.entries(MODES).map(([key, m], i) => (
            <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -5 }}>
              <Box onClick={() => start(key)} sx={{
                ...glassCard, cursor: "pointer", display: "flex", alignItems: "center", gap: 1.8,
                borderColor: `rgba(0,0,0,0)`, position: "relative", overflow: "hidden",
                "&:hover": { borderColor: m.color, boxShadow: `0 10px 34px ${m.color}33` },
                transition: "all 0.2s",
              }}>
                <Box sx={{
                  width: 50, height: 50, borderRadius: "14px", flexShrink: 0,
                  background: `linear-gradient(135deg, ${m.color}, ${m.color}88)`,
                  display: "grid", placeItems: "center", color: "#fff",
                }}>
                  {m.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontSize: 16, fontWeight: 800 }}>{m.label}</Typography>
                  <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: "text.secondary" }}>{m.hint}</Typography>
                </Box>
                {bests[key] !== undefined && (
                  <Chip size="small" icon={<Trophy size={11} />} label={bests[key]}
                    sx={{ bgcolor: `${m.color}1a`, color: m.color, fontWeight: 800, height: 22 }} />
                )}
              </Box>
            </motion.div>
          ))}
        </Box>

        <Typography sx={{ textAlign: "center", mt: 4, fontSize: 12.5, fontWeight: 600, color: "text.secondary" }}>
          💡 Survive with 3 lives in classic modes · combos multiply your points
        </Typography>
      </Box>
    );
  }

  /* ---------------- GAME OVER ---------------- */
  if (screen === "over") {
    return (
      <Box className="app-bg" sx={{ minHeight: "100vh", p: { xs: 2, md: 4 }, maxWidth: 700, mx: "auto", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 180 }}>
          <Box sx={{ ...glassCard, textAlign: "center", py: 5 }}>
            <motion.div initial={{ rotate: -20, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ delay: 0.15, type: "spring" }}>
              <Typography sx={{ fontSize: 90, fontWeight: 800, lineHeight: 1, color: gr.color, textShadow: `0 0 40px ${gr.color}66` }}>{gr.g}</Typography>
            </motion.div>
            <Typography sx={{ fontSize: 18, fontWeight: 800, mt: 1, mb: 3 }}>{gr.msg}</Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1.5, mb: 3 }}>
              {[
                { label: mode === "timed" ? "Correct" : "Correct", value: `${correct}${mode === "timed" ? "" : `/${ROUNDS}`}` },
                { label: "Score", value: score },
                { label: "Best combo", value: `${bestCombo}x` },
                { label: "Best", value: bests[mode === "timed" ? "timed" : mode] ?? "—" },
              ].map((s) => (
                <Box key={s.label} sx={{ p: 1.5, borderRadius: "14px", background: "var(--t3)", border: "1px solid var(--t8)" }}>
                  <Typography sx={{ fontSize: 20, fontWeight: 800 }}>{s.value}</Typography>
                  <Typography sx={{ fontSize: 10, fontWeight: 700, color: "text.secondary" }}>{s.label.toUpperCase()}</Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", flexWrap: "wrap" }}>
              <Button variant="contained" startIcon={<RotateCcw size={16} />} onClick={() => start(mode)}
                sx={{ background: GRADIENTS.primary, color: "#fff", fontWeight: 700, borderRadius: "12px", px: 3 }}>
                Play again
              </Button>
              <Button variant="outlined" startIcon={<Home size={16} />} onClick={() => setScreen("menu")}
                sx={{ color: "text.secondary", borderColor: "var(--t12)", fontWeight: 700, borderRadius: "12px", px: 3 }}>
                Menu
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Box>
    );
  }

  /* ---------------- PLAYING ---------------- */
  return (
    <Box className="app-bg" sx={{ minHeight: "100vh", p: { xs: 2, md: 4 }, maxWidth: 900, mx: "auto" }}>
      {/* HUD */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5, flexWrap: "wrap", gap: 1.5 }}>
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {mode !== "timed" && Array.from({ length: LIVES }).map((_, i) => (
            <motion.div key={i} animate={i >= lives ? { scale: 0.4, opacity: 0.25 } : { scale: 1, opacity: 1 }}>
              <Heart size={20} color={i < lives ? "#ef4444" : "#6b7280"} fill={i < lives ? "#ef4444" : "none"} />
            </motion.div>
          ))}
          {mode === "timed" && (
            <Chip icon={<Timer size={13} />} label={`${timeLeft}s`}
              sx={{
                fontWeight: 800, fontSize: 15, height: 32, px: 0.5,
                bgcolor: timeLeft <= 10 ? "rgba(239,68,68,0.15)" : "rgba(168,85,247,0.12)",
                color: timeLeft <= 10 ? "#ef4444" : "#a855f7",
              }} />
          )}
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Chip icon={<Zap size={12} />} label={`${score} pts`} sx={{ bgcolor: "rgba(34,211,238,0.12)", color: "#22d3ee", fontWeight: 800 }} />
          <Chip label={`${combo}x combo`} sx={{ bgcolor: "rgba(249,115,22,0.12)", color: "#f97316", fontWeight: 800 }} />
        </Box>
      </Box>

      {/* progress */}
      {mode !== "timed" && (
        <Box sx={{ display: "flex", gap: 0.7, mb: 2.5 }}>
          {Array.from({ length: ROUNDS }).map((_, i) => (
            <Box key={i} sx={{
              flex: 1, height: 5, borderRadius: 3,
              background: i < roundNum - 1 ? GRADIENTS.primary : "var(--t8)",
              transition: "background 0.3s",
            }} />
          ))}
        </Box>
      )}
      {mode === "timed" && (
        <LinearProgress variant="determinate" value={(timeLeft / TIMED_SECONDS) * 100} sx={{
          height: 7, borderRadius: 4, mb: 2.5, bgcolor: "var(--t8)",
          "& .MuiLinearProgress-bar": {
            background: timeLeft <= 10 ? "#ef4444" : GRADIENTS.primary, borderRadius: 4,
            transition: "transform 1s linear",
          },
        }} />
      )}

      <Box sx={{ textAlign: "center", mb: 2.5 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 800 }}>{M.hint}</Typography>
        {mode !== "timed" && (
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary" }}>Round {roundNum} of {ROUNDS}</Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 2.5, flexWrap: "wrap", mb: 3, alignItems: "stretch" }}>
        {foodCard(a, 0)}
        <Box sx={{ alignSelf: "center", fontWeight: 800, fontSize: 22, color: "text.disabled" }}>VS</Box>
        {foodCard(b, 1)}
      </Box>

      <Box sx={{ textAlign: "center" }}>
        <AnimatePresence mode="wait">
          {answered ? (
            <motion.div key="res" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Typography sx={{ fontSize: 17, fontWeight: 800, mb: 2, color: wasRight ? "#34d399" : "#ef4444" }}>
                {wasRight
                  ? combo >= 4 ? `🔥 ${combo}x COMBO — +${10 + (combo - 1) * 2} pts!` : combo >= 2 ? `Correct! +${10 + (combo - 1) * 2} pts` : "Correct! +10 pts"
                  : `Nope — the ${correctIdx === 0 ? a.name : b.name} wins this one (${correctIdx === 0 ? a[metric] : b[metric]} ${metric === "kcal" ? "kcal" : "g protein"}).`}
              </Typography>
              <Button variant="contained" onClick={next}
                sx={{ background: GRADIENTS.primary, color: "#fff", fontWeight: 700, borderRadius: "12px", px: 5 }}>
                {mode !== "timed" && roundNum >= ROUNDS ? "See results" : mode !== "timed" && lives <= 0 ? "See results" : "Next"}
              </Button>
            </motion.div>
          ) : (
            <motion.div key="pr" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Typography sx={{ fontWeight: 700, color: "text.secondary" }}>Tap your answer — wrong picks cost a ❤️</Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}