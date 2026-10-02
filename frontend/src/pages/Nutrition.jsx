import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box, Typography, Button, Chip, TextField, Dialog, DialogTitle, DialogContent,
  IconButton, MenuItem, Snackbar, Alert, LinearProgress,
} from "@mui/material";
import {
  Plus, Pencil, Trash2, X, UtensilsCrossed, Coffee, Sun, Moon, Cookie, Flame,
  ChevronLeft, ChevronRight, Zap, Search,
} from "lucide-react";
import { FOOD_DB } from "../utils/foodDatabase";
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip as RTooltip, ReferenceLine, CartesianGrid,
} from "recharts";
import { glassCard, GRADIENTS } from "../theme";

const API = "https://sublime-grad-interventions-malpractice.trycloudflare.com/api";
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("flexion_token")}`,
});

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];
const MT = {
  breakfast: { color: "#f59e0b", icon: <Coffee size={14} /> },
  lunch: { color: "#22d3ee", icon: <Sun size={14} /> },
  dinner: { color: "#a855f7", icon: <Moon size={14} /> },
  snack: { color: "#34d399", icon: <Cookie size={14} /> },
};
const CALORIE_GOAL = 2500;

// quick-add foods: click to auto-fill an item row
const COMMON_FOODS = [
  { name: "Chicken breast", quantity: "150g", calories: 248, protein: 46, carbs: 0, fat: 5 },
  { name: "White rice", quantity: "1 cup", calories: 205, protein: 4, carbs: 45, fat: 0 },
  { name: "Eggs (2)", quantity: "2 large", calories: 155, protein: 13, carbs: 1, fat: 11 },
  { name: "Oats", quantity: "40g", calories: 150, protein: 5, carbs: 27, fat: 3 },
  { name: "Banana", quantity: "1 medium", calories: 105, protein: 1, carbs: 27, fat: 0 },
  { name: "Salmon", quantity: "100g", calories: 208, protein: 22, carbs: 0, fat: 13 },
  { name: "Protein shake", quantity: "1 scoop", calories: 120, protein: 24, carbs: 3, fat: 1 },
  { name: "Broccoli", quantity: "100g", calories: 34, protein: 3, carbs: 7, fat: 0 },
];

const emptyForm = {
  mealType: "breakfast", date: new Date().toISOString().slice(0, 10),
  items: [{ name: "", quantity: "1 serving", calories: 0, protein: 0, carbs: 0, fat: 0 }],
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px", background: "var(----t5)",
    "& fieldset": { borderColor: "var(----t12)" },
    "&:hover fieldset": { borderColor: "rgba(34,211,238,0.55)" },
    "&.Mui-focused fieldset": { borderColor: "#22d3ee" },
    "& input": { color: "text.primary", fontWeight: 600 },
  },
  "& .MuiInputLabel-root": { color: "text.secondary", fontWeight: 600 },
  mb: 2,
};

const mealTotals = (m) => m.items.reduce(
  (t, i) => ({ cal: t.cal + i.calories, p: t.p + i.protein, c: t.c + i.carbs, f: t.f + i.fat }),
  { cal: 0, p: 0, c: 0, f: 0 }
);

function Field({ label, children }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 11, fontWeight: 700, color: "text.secondary", letterSpacing: "0.08em", mb: 0.5 }}>
        {label}
      </Typography>
      {children}
    </Box>
  );
}

const shiftDay = (dateStr, delta) => {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
};

export default function Nutrition() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [meals, setMeals] = useState([]);
  const [summary, setSummary] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [weekly, setWeekly] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [foodQuery, setFoodQuery] = useState("");
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams({ date });
    if (filter) params.set("mealType", filter);
    const [mealsRes, sumRes, weekRes] = await Promise.all([
      fetch(`${API}/nutrition?${params}`, { headers: authHeaders() }),
      fetch(`${API}/nutrition/summary?date=${date}`, { headers: authHeaders() }),
      fetch(`${API}/nutrition/weekly?date=${date}`, { headers: authHeaders() }),
    ]);
    if (mealsRes.ok) setMeals(await mealsRes.json());
    if (sumRes.ok) setSummary((await sumRes.json()).totals);
    if (weekRes.ok) setWeekly(await weekRes.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, [date, filter]); // eslint-disable-line

  const openCreate = () => { setEditing(null); setForm({ ...emptyForm, date }); setError(""); setOpen(true); };
  const openEdit = (m) => {
    setEditing(m);
    setForm({ mealType: m.mealType, date: m.date?.slice(0, 10), items: m.items.map((i) => ({ ...i })) });
    setError(""); setOpen(true);
  };

  const setItem = (i, field, val) => {
    const items = [...form.items];
    items[i] = { ...items[i], [field]: val };
    setForm({ ...form, items });
  };

  const quickAdd = (food) => {
    const last = form.items[form.items.length - 1];
    if (last && !last.name.trim()) {
      setItem(form.items.length - 1, undefined, undefined); // no-op keep shape
      const items = [...form.items];
      items[items.length - 1] = { ...food };
      setForm({ ...form, items });
    } else {
      setForm({ ...form, items: [...form.items, { ...food }] });
    }
    setToast(`${food.name} added`);
  };

  const save = async () => {
    if (form.items.some((i) => !i.name.trim())) return setError("Every food item needs a name.");
    const res = await fetch(`${API}/nutrition${editing ? `/${editing._id}` : ""}`, {
      method: editing ? "PUT" : "POST",
      headers: authHeaders(),
      body: JSON.stringify({ ...form, items: form.items.filter((i) => i.name.trim()) }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.message);
    setOpen(false); setToast(editing ? "Meal updated ✅" : "Meal logged 🍽️"); load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this meal?")) return;
    const res = await fetch(`${API}/nutrition/${id}`, { method: "DELETE", headers: authHeaders() });
    if (res.ok) { setToast("Meal deleted"); load(); }
  };

  const pct = Math.min((summary.calories / CALORIE_GOAL) * 100, 100);

  // macro distribution (% of calories: P=4, C=4, F=9 per gram)
  const macroKcal = summary.protein * 4 + summary.carbs * 4 + summary.fat * 9 || 1;
  const dist = [
    { label: "Protein", grams: summary.protein, pct: Math.round((summary.protein * 4 / macroKcal) * 100), color: "#22d3ee" },
    { label: "Carbs", grams: summary.carbs, pct: Math.round((summary.carbs * 4 / macroKcal) * 100), color: "#a855f7" },
    { label: "Fat", grams: summary.fat, pct: Math.round((summary.fat * 9 / macroKcal) * 100), color: "#f97316" },
  ];

  const donut = [
    { name: "Protein", value: summary.protein, color: "#22d3ee" },
    { name: "Carbs", value: summary.carbs, color: "#a855f7" },
    { name: "Fat", value: summary.fat, color: "#f97316" },
  ].filter((d) => d.value > 0);

  const isToday = date === new Date().toISOString().slice(0, 10);

  return (
    <Box className="app-bg" sx={{ minHeight: "100vh", p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Snackbar open={!!toast} autoHideDuration={2000} onClose={() => setToast("")} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert variant="filled" sx={{ borderRadius: "12px", fontWeight: 600, background: "#1e1e2e", border: "1px solid rgba(34,211,238,0.4)" }}>{toast}</Alert>
      </Snackbar>

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>Nutrition</Typography>
          <Typography sx={{ color: "text.secondary", fontWeight: 500 }}>Log meals, hit your macros.</Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
          <IconButton onClick={() => setDate(shiftDay(date, -1))} sx={{ color: "text.secondary", bgcolor: "var(----t5)", "&:hover": { color: "#22d3ee" } }}>
            <ChevronLeft size={18} />
          </IconButton>
          <TextField type="date" size="small" value={date} onChange={(e) => setDate(e.target.value)}
            sx={{ ...inputSx, mb: 0, width: 150, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }} />
          <IconButton onClick={() => setDate(shiftDay(date, 1))} disabled={isToday}
            sx={{ color: "text.secondary", bgcolor: "var(----t5)", "&:hover": { color: "#22d3ee" } }}>
            <ChevronRight size={18} />
          </IconButton>
          <Button variant="contained" startIcon={<Plus size={17} />} onClick={openCreate}
            sx={{ background: GRADIENTS.primary, color: "#fff", fontWeight: 700, borderRadius: "12px" }}>
            Log meal
          </Button>
        </Box>
      </Box>

      {/* 7-day calorie trend */}
      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <Box sx={{ ...glassCard, mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700 }}>7-Day Calorie Trend</Typography>
            <Chip size="small" icon={<Zap size={13} />} label={`avg ${Math.round(weekly.reduce((s, d) => s + d.calories, 0) / 7)} kcal`}
              sx={{ bgcolor: "rgba(34,211,238,0.12)", color: "#22d3ee", fontWeight: 700 }} />
          </Box>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={weekly}>
              <CartesianGrid vertical={false} stroke="var(----t5)" />
              <XAxis dataKey="day" tick={{ fill: "#9ca3af", fontSize: 11.5, fontWeight: 600 }} axisLine={false} tickLine={false} dy={6} />
              <YAxis hide />
              <RTooltip cursor={{ fill: "var(----t5)" }}
                contentStyle={{ background: "var(--chat-bg)", border: "1px solid var(----t12)", borderRadius: 12, fontWeight: 600 }}
                formatter={(v) => [`${v} kcal`, "Calories"]} labelFormatter={(_, payload) => payload?.[0]?.payload?.date || ""} />
              <ReferenceLine y={CALORIE_GOAL} stroke="#f97316" strokeDasharray="5 5" strokeOpacity={0.6} />
              <Bar dataKey="calories" radius={[7, 7, 0, 0]} animationDuration={900}>
                {weekly.map((d, i) => (
                  <Cell key={i} fill={d.date === date ? "#a855f7" : d.calories > CALORIE_GOAL ? "#f97316" : "#22d3ee"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </motion.div>

      {/* Daily summary */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "5fr 7fr" }, gap: 2.5, mb: 3 }}>
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Box sx={{ ...glassCard, display: "flex", alignItems: "center", gap: 2.5, height: "100%" }}>
            <ResponsiveContainer width={110} height={110}>
              <PieChart>
                <Pie data={donut.length ? donut : [{ name: "None", value: 1, color: "#2a2a3a" }]}
                  innerRadius={36} outerRadius={52} paddingAngle={3} dataKey="value" strokeWidth={0} animationDuration={1000}>
                  {(donut.length ? donut : [{ color: "#2a2a3a" }]).map((m, i) => <Cell key={i} fill={m.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", letterSpacing: "0.08em" }}>
                CALORIES {isToday ? "TODAY" : "THAT DAY"}
              </Typography>
              <Typography sx={{ fontSize: 32, fontWeight: 800, lineHeight: 1.1 }}>
                {summary.calories.toLocaleString()} <Box component="span" sx={{ fontSize: 14, color: "text.secondary" }}>/ {CALORIE_GOAL.toLocaleString()}</Box>
              </Typography>
              <LinearProgress variant="determinate" value={pct} sx={{
                height: 8, borderRadius: 4, mt: 1, bgcolor: "var(----t8)",
                "& .MuiLinearProgress-bar": { background: GRADIENTS.fire, borderRadius: 4 },
              }} />
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: "text.secondary", mt: 0.8 }}>
                {summary.calories > CALORIE_GOAL
                  ? `${summary.calories - CALORIE_GOAL} over goal`
                  : `${CALORIE_GOAL - summary.calories} left to eat`}
              </Typography>
            </Box>
          </Box>
        </motion.div>

        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }}>
          {dist.map((m, i) => (
            <motion.div key={m.label} variants={fadeUp} initial="hidden" animate="show" custom={i + 1}>
              <Box sx={{ ...glassCard, height: "100%" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Typography sx={{ fontSize: 11.5, fontWeight: 700, color: "text.secondary" }}>{m.label.toUpperCase()}</Typography>
                  <Typography sx={{ fontSize: 11, fontWeight: 800, color: m.color }}>{m.pct}%</Typography>
                </Box>
                <Typography sx={{ fontSize: 24, fontWeight: 800, color: m.color }}>
                  {m.grams}<Box component="span" sx={{ fontSize: 12, color: "text.secondary" }}> g</Box>
                </Typography>
                <LinearProgress variant="determinate" value={m.pct} sx={{
                  height: 6, borderRadius: 3, mt: 1, bgcolor: "var(----t8)",
                  "& .MuiLinearProgress-bar": { bgcolor: m.color, borderRadius: 3 },
                }} />
                <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: "text.secondary", mt: 0.6 }}>of today's calories</Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Meal type filter */}
      <Box sx={{ display: "flex", gap: 1, mb: 2.5, flexWrap: "wrap" }}>
        {["", ...MEAL_TYPES].map((t) => (
          <Chip key={t || "all"} label={t || "All meals"} onClick={() => setFilter(t)} icon={t ? MT[t].icon : undefined}
            sx={{
              fontWeight: 700, textTransform: "capitalize",
              bgcolor: filter === t ? (t ? `${MT[t].color}22` : "rgba(34,211,238,0.18)") : "var(----t5)",
              color: filter === t ? (t ? MT[t].color : "#22d3ee") : "#9ca3af",
              border: "1px solid", borderColor: filter === t ? (t ? `${MT[t].color}55` : "rgba(34,211,238,0.4)") : "var(----t12)",
            }} />
        ))}
      </Box>

      {/* Meals list */}
      {loading ? (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5 }}>
          {[0, 1, 2, 3].map((i) => <Box key={i} className="skeleton" sx={{ height: 180, borderRadius: "20px" }} />)}
        </Box>
      ) : meals.length === 0 ? (
        <Box sx={{ ...glassCard, textAlign: "center", py: 8 }}>
          <UtensilsCrossed size={40} color="#4b5563" style={{ margin: "0 auto 12px" }} />
          <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Nothing logged {filter ? `for ${filter}` : "on this day"}</Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 13.5 }}>Hit "Log meal" to start tracking 🍎</Typography>
        </Box>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5 }}>
          <AnimatePresence>
            {meals.map((m, i) => {
              const t = mealTotals(m);
              return (
                <motion.div key={m._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}>
                  <Box sx={{ ...glassCard, height: "100%" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                      <Chip size="small" label={m.mealType} icon={MT[m.mealType].icon} sx={{
                        textTransform: "capitalize", fontWeight: 700, height: 24,
                        bgcolor: `${MT[m.mealType].color}1c`, color: MT[m.mealType].color,
                      }} />
                      <Box>
                        <IconButton size="small" onClick={() => openEdit(m)} sx={{ color: "text.secondary", "&:hover": { color: "#22d3ee" } }}><Pencil size={15} /></IconButton>
                        <IconButton size="small" onClick={() => remove(m._id)} sx={{ color: "text.secondary", "&:hover": { color: "#ef4444" } }}><Trash2 size={15} /></IconButton>
                      </Box>
                    </Box>

                    {m.items.map((item, j) => (
                      <Box key={j} sx={{ display: "flex", alignItems: "center", gap: 1, py: 0.7, borderBottom: j < m.items.length - 1 ? "1px solid var(----t5)" : "none" }}>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontSize: 13.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</Typography>
                          <Typography sx={{ fontSize: 11, fontWeight: 600, color: "text.secondary" }}>{item.quantity}</Typography>
                        </Box>
                        <Box sx={{ textAlign: "right", flexShrink: 0 }}>
                          <Typography sx={{ fontSize: 13, fontWeight: 800, color: "#f97316", display: "flex", alignItems: "center", gap: 0.3, justifyContent: "flex-end" }}>
                            <Flame size={12} /> {item.calories}
                          </Typography>
                          <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: "text.secondary" }}>
                            P{item.protein} · C{item.carbs} · F{item.fat}
                          </Typography>
                        </Box>
                      </Box>
                    ))}

                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1.2 }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#a855f7" }}>Total: {t.cal} kcal</Typography>
                    </Box>
                  </Box>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </Box>
      )}

      {/* Log / edit meal dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        slotProps={{
          backdrop: { sx: { backgroundColor: "rgba(5,5,12,0.75)", backdropFilter: "blur(4px)" } },
          paper: { sx: { background: "var(--chat-bg)", backgroundImage: "none", borderRadius: "20px", border: "1px solid var(----t12)" } },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {editing ? "Edit meal" : "Log meal"}
          <IconButton onClick={() => setOpen(false)} sx={{ color: "text.secondary" }}><X size={18} /></IconButton>
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: "12px", fontWeight: 600 }}>{error}</Alert>}

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <Field label="MEAL TYPE">
              <TextField select fullWidth size="small" value={form.mealType} onChange={(e) => setForm({ ...form, mealType: e.target.value })} sx={{ ...inputSx, mb: 0 }}>
                {MEAL_TYPES.map((t) => <MenuItem key={t} value={t} sx={{ textTransform: "capitalize" }}>{t}</MenuItem>)}
              </TextField>
            </Field>
            <Field label="DATE">
              <TextField fullWidth size="small" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} sx={{ ...inputSx, mb: 0 }} />
            </Field>
          </Box>

          {/* Built-in food database search */}
          <Field label="FOOD DATABASE — SEARCH & TAP TO ADD">
            <TextField
              fullWidth size="small" value={foodQuery}
              onChange={(e) => setFoodQuery(e.target.value)}
              placeholder="e.g. strawberries, chicken breast, biryani…"
              sx={{ ...inputSx, mb: 0 }}
              InputProps={{
                startAdornment: <Box component={Search} size={15} color="#9ca3af" sx={{ mr: 0.8, display: "flex" }} />,
              }}
            />
          </Field>
          <Box sx={{
            maxHeight: 170, overflowY: "auto", mb: 2, mt: 1,
            border: "1px solid var(--t8)", borderRadius: "12px",
            display: foodQuery.trim() ? "block" : "none",
          }}>
            {FOOD_DB
              .filter((f) => f.name.toLowerCase().includes(foodQuery.toLowerCase()))
              .slice(0, 40)
              .map((food, i) => (
                <Box key={i} onClick={() => quickAdd(food)} sx={{
                  display: "flex", alignItems: "center", gap: 1.2, px: 1.4, py: 0.8,
                  cursor: "pointer", borderBottom: "1px solid var(--t3)",
                  "&:hover": { background: "var(--t3)" },
                }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 12.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{food.name}</Typography>
                    <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: "text.secondary" }}>
                      P{food.protein} · C{food.carbs} · F{food.fat} · per {food.serving}
                    </Typography>
                  </Box>
                  <Chip size="small" icon={<Flame size={11} />} label={food.kcal}
                    sx={{ height: 20, fontSize: 11, fontWeight: 800, bgcolor: "rgba(249,115,22,0.12)", color: "#f97316" }} />
                  <Plus size={14} color="#22d3ee" />
                </Box>
              ))}
            {FOOD_DB.filter((f) => f.name.toLowerCase().includes(foodQuery.toLowerCase())).length === 0 && (
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", textAlign: "center", py: 2 }}>
                No match — add it manually below 👇
              </Typography>
            )}
          </Box>

          <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Food items</Typography>
          {form.items.map((item, i) => (
            <Box key={i} sx={{ p: 1.5, mb: 1.5, borderRadius: "14px", background: "var(----t3)", border: "1px solid var(----t8)" }}>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                <TextField size="small" label="Food" value={item.name} onChange={(e) => setItem(i, "name", e.target.value)}
                  sx={{ ...inputSx, mb: 0, flex: 2, minWidth: 130 }} placeholder="Chicken breast" />
                <TextField size="small" label="Qty" value={item.quantity} onChange={(e) => setItem(i, "quantity", e.target.value)}
                  sx={{ ...inputSx, mb: 0, width: 100 }} placeholder="150g" />
                {form.items.length > 1 && (
                  <IconButton size="small" onClick={() => setForm({ ...form, items: form.items.filter((_, j) => j !== i) })}
                    sx={{ color: "text.secondary", "&:hover": { color: "#ef4444" } }}><X size={15} /></IconButton>
                )}
              </Box>
              <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                <TextField size="small" type="number" label="kcal" value={item.calories} onChange={(e) => setItem(i, "calories", +e.target.value)} sx={{ ...inputSx, mb: 0, width: 86 }} />
                <TextField size="small" type="number" label="Protein g" value={item.protein} onChange={(e) => setItem(i, "protein", +e.target.value)} sx={{ ...inputSx, mb: 0, width: 96 }} />
                <TextField size="small" type="number" label="Carbs g" value={item.carbs} onChange={(e) => setItem(i, "carbs", +e.target.value)} sx={{ ...inputSx, mb: 0, width: 90 }} />
                <TextField size="small" type="number" label="Fat g" value={item.fat} onChange={(e) => setItem(i, "fat", +e.target.value)} sx={{ ...inputSx, mb: 0, width: 80 }} />
              </Box>
            </Box>
          ))}

          <Button size="small" startIcon={<Plus size={15} />} onClick={() => setForm({ ...form, items: [...form.items, { name: "", quantity: "1 serving", calories: 0, protein: 0, carbs: 0, fat: 0 }] })}
            sx={{ color: "#22d3ee", fontWeight: 700, mb: 2 }}>
            Add item
          </Button>

          <Button fullWidth variant="contained" onClick={save}
            sx={{ background: GRADIENTS.primary, color: "#fff", fontWeight: 700, py: 1.3, borderRadius: "12px" }}>
            {editing ? "Save changes" : "Log meal"}
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}