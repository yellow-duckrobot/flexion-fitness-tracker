import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box, Typography, Button, Chip, TextField, Dialog, DialogTitle, DialogContent,
  IconButton, Snackbar, Alert,
} from "@mui/material";
import { Plus, Trash2, X, TrendingUp, TrendingDown, Scale, Ruler, Timer, Weight } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip as RTooltip, BarChart, Bar, Cell,
} from "recharts";
import { glassCard, GRADIENTS } from "../theme";
import { kgToUnit, weightLabel } from "../utils/units";

const API = "https://sublime-grad-interventions-malpractice.trycloudflare.com//api";
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("flexion_token")}`,
});

const emptyForm = {
  date: new Date().toISOString().slice(0, 10), weight: "", chest: "", waist: "",
  hips: "", arm: "", runTime: "", liftWeight: "", notes: "",
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }),
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px", background: "var(--t5)",
    "& fieldset": { borderColor: "var(--t12)" },
    "&:hover fieldset": { borderColor: "rgba(34,211,238,0.55)" },
    "&.Mui-focused fieldset": { borderColor: "#22d3ee" },
    "& input, & textarea": { color: "text.primary", fontWeight: 600 },
  },
  "& .MuiInputLabel-root": { color: "text.secondary", fontWeight: 600 },
  mb: 2,
};

const num = (v) => (v === "" || v === null || v === undefined ? undefined : Number(v));

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

export default function Progress() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await fetch(`${API}/progress`, { headers: authHeaders() });
    if (res.ok) setEntries(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.weight && !form.chest && !form.waist && !form.liftWeight && !form.runTime)
      return setError("Log at least one measurement.");
    const body = Object.fromEntries(
      Object.entries({ ...form, weight: num(form.weight), chest: num(form.chest), waist: num(form.waist),
        hips: num(form.hips), arm: num(form.arm), runTime: num(form.runTime), liftWeight: num(form.liftWeight) })
    );
    const res = await fetch(`${API}/progress`, { method: "POST", headers: authHeaders(), body: JSON.stringify(body) });
    const data = await res.json();
    if (!res.ok) return setError(data.message);
    setOpen(false); setForm(emptyForm); setToast("Progress logged 📈"); load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    const res = await fetch(`${API}/progress/${id}`, { method: "DELETE", headers: authHeaders() });
    if (res.ok) { setToast("Entry deleted"); load(); }
  };

  const units = weightLabel();
  const weights = entries.filter((e) => e.weight).map((e) => ({
    date: new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }), kg: kgToUnit(e.weight),
  }));
  const lifts = entries.filter((e) => e.liftWeight).map((e) => ({
    date: new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }), kg: kgToUnit(e.liftWeight),
  }));

  const first = weights[0]?.kg, last = weights[weights.length - 1]?.kg;
  const change = first && last ? (last - first).toFixed(1) : null;
  const latest = entries[entries.length - 1];

  return (
    <Box className="app-bg" sx={{ minHeight: "100vh", p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast("")} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert variant="filled" sx={{ borderRadius: "12px", fontWeight: 600, background: "#1e1e2e", border: "1px solid rgba(34,211,238,0.4)" }}>{toast}</Alert>
      </Snackbar>

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>Progress</Typography>
          <Typography sx={{ color: "text.secondary", fontWeight: 500 }}>Watch the numbers move.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={17} />} onClick={() => { setForm(emptyForm); setError(""); setOpen(true); }}
          sx={{ background: GRADIENTS.primary, color: "#fff", fontWeight: 700, borderRadius: "12px" }}>
          Log entry
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ color: "text.secondary", textAlign: "center", py: 8, fontWeight: 600 }}>Loading progress…</Box>
      ) : entries.length === 0 ? (
        <Box sx={{ ...glassCard, textAlign: "center", py: 10 }}>
          <Scale size={44} color="#4b5563" style={{ margin: "0 auto 12px" }} />
          <Typography sx={{ fontWeight: 700, mb: 0.5 }}>No entries yet</Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 13.5, mb: 2 }}>Log your weight or measurements to start the charts 📊</Typography>
          <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => setOpen(true)}
            sx={{ background: GRADIENTS.primary, color: "#fff", fontWeight: 700, borderRadius: "12px" }}>
            Log first entry
          </Button>
        </Box>
      ) : (
        <>
          {/* Stats strip */}
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, mb: 3 }}>
            {[
              { icon: <Scale size={20} />, label: "Current weight", value: last ? `${last} ${units}` : "—", sub: change !== null ? `${change > 0 ? "+" : ""}${change} ${units} total` : "log weight", grad: GRADIENTS.primary },
              { icon: change !== null && Number(change) <= 0 ? <TrendingDown size={20} /> : <TrendingUp size={20} />, label: "Direction", value: change === null ? "—" : Number(change) < 0 ? "Losing" : "Gaining", sub: "since first entry", grad: Number(change) <= 0 ? GRADIENTS.success : GRADIENTS.fire },
              { icon: <Ruler size={20} />, label: "Entries logged", value: entries.length, sub: "measurements", grad: GRADIENTS.primary },
            ].map((s, i) => (
              <motion.div key={s.label} variants={fadeUp} initial="hidden" animate="show" custom={i}>
                <Box sx={{ ...glassCard, py: 2 }}>
                  <Box sx={{ width: 38, height: 38, borderRadius: "12px", background: s.grad, display: "grid", placeItems: "center", color: "#fff", mb: 1 }}>
                    {s.icon}
                  </Box>
                  <Typography sx={{ fontSize: 20, fontWeight: 800 }}>{s.value}</Typography>
                  <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: "text.secondary" }}>{s.label}</Typography>
                  <Typography sx={{ fontSize: 10.5, fontWeight: 600, color: "text.disabled" }}>{s.sub}</Typography>
                </Box>
              </motion.div>
            ))}
          </Box>

          {/* Weight chart */}
          {weights.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Card i={3}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography sx={{ fontSize: 17, fontWeight: 700 }}>Body Weight</Typography>
                  {change !== null && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, color: Number(change) <= 0 ? "#34d399" : "#f97316", fontSize: 12, fontWeight: 700 }}>
                      {Number(change) <= 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                      {change} kg since start
                    </Box>
                  )}
                </Box>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={weights}>
                    <defs>
                      <linearGradient id="progGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 11.5, fontWeight: 600 }} axisLine={false} tickLine={false} dy={6} />
                    <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
                    <RTooltip contentStyle={{ background: "var(--chat-bg)", border: "1px solid var(--t12)", borderRadius: "14px", fontWeight: 700, fontSize: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.45)" }}
                      formatter={(v) => [`${v} ${units}`, "Weight"]} />
                    <Area type="monotone" dataKey="kg" stroke="#22d3ee" strokeWidth={3} fill="url(#progGrad)"
                      dot={{ r: 4, fill: "#22d3ee", strokeWidth: 0 }} activeDot={{ r: 6, fill: "#a855f7" }} animationDuration={1200} />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>
            </Box>
          )}

          {/* Lift progress + latest measurements */}
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "7fr 5fr" }, gap: 2.5, mb: 3 }}>
            {lifts.length > 0 && (
              <Card i={4}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Weight size={17} color="#a855f7" />
                  <Typography sx={{ fontSize: 17, fontWeight: 700 }}>Max Lift Progress</Typography>
                </Box>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={lifts}>
                    <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 11.5, fontWeight: 600 }} axisLine={false} tickLine={false} dy={6} />
                    <YAxis hide />
                    <RTooltip cursor={{ fill: "var(--t5)" }}
                      contentStyle={{ background: "var(--chat-bg)", border: "1px solid var(--t12)", borderRadius: "14px", fontWeight: 700, fontSize: 12, boxShadow: "0 12px 32px rgba(0,0,0,0.45)" }}
                      formatter={(v) => [`${v} ${units}`, "Max lift"]} />
                    <Bar dataKey="kg" radius={[8, 8, 0, 0]} animationDuration={1200}>
                      {lifts.map((_, i) => <Cell key={i} fill={i === lifts.length - 1 ? "#a855f7" : "#22d3ee"} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {latest && (latest.chest || latest.waist || latest.hips || latest.arm) && (
              <Card i={5}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <Ruler size={17} color="#22d3ee" />
                  <Typography sx={{ fontSize: 17, fontWeight: 700 }}>Latest Measurements</Typography>
                </Box>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1.2 }}>
                  {[
                    { label: "Chest", value: latest.chest },
                    { label: "Waist", value: latest.waist },
                    { label: "Hips", value: latest.hips },
                    { label: "Arm", value: latest.arm },
                  ].filter((m) => m.value).map((m) => (
                    <Box key={m.label} sx={{ p: 1.4, borderRadius: "12px", background: "var(--t3)", border: "1px solid var(--t8)" }}>
                      <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: "text.secondary", letterSpacing: "0.06em" }}>{m.label.toUpperCase()}</Typography>
                      <Typography sx={{ fontSize: 18, fontWeight: 800, color: "#22d3ee" }}>{m.value} cm</Typography>
                    </Box>
                  ))}
                </Box>
                {latest.runTime && (
                  <Box sx={{ mt: 1.2, display: "flex", alignItems: "center", gap: 1, p: 1.4, borderRadius: "12px", background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)" }}>
                    <Timer size={16} color="#f97316" />
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>5K run: {latest.runTime} mins</Typography>
                  </Box>
                )}
              </Card>
            )}
          </Box>

          {/* History */}
          <Card i={6}>
            <Typography sx={{ fontSize: 17, fontWeight: 700, mb: 1.5 }}>History</Typography>
            <AnimatePresence>
              {[...entries].reverse().map((e, i) => (
                <motion.div key={e._id} layout initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.04 }}>
                  <Box sx={{
                    display: "flex", alignItems: "center", gap: 1.5, py: 1.3, flexWrap: "wrap",
                    borderBottom: i < entries.length - 1 ? "1px solid var(--t5)" : "none",
                  }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 13, width: 110, flexShrink: 0 }}>
                      {new Date(e.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flex: 1, flexWrap: "wrap" }}>
                      {e.weight && <Chip size="small" sx={{ bgcolor: "rgba(34,211,238,0.12)", color: "#22d3ee", fontWeight: 700, height: 22 }} label={`${kgToUnit(e.weight)} ${units}`} />}
                      {e.liftWeight && <Chip size="small" sx={{ bgcolor: "rgba(168,85,247,0.12)", color: "#a855f7", fontWeight: 700, height: 22 }} label={`lift ${kgToUnit(e.liftWeight)} ${units}`} />}
                      {e.waist && <Chip size="small" sx={{ bgcolor: "rgba(249,115,22,0.12)", color: "#f97316", fontWeight: 700, height: 22 }} label={`waist ${e.waist} cm`} />}
                      {e.runTime && <Chip size="small" sx={{ bgcolor: "rgba(52,211,153,0.12)", color: "#34d399", fontWeight: 700, height: 22 }} label={`5K ${e.runTime}m`} />}
                    </Box>
                    <IconButton size="small" onClick={() => remove(e._id)} sx={{ color: "text.secondary", "&:hover": { color: "#ef4444" } }}>
                      <Trash2 size={15} />
                    </IconButton>
                  </Box>
                </motion.div>
              ))}
            </AnimatePresence>
          </Card>
        </>
      )}

      {/* Log entry dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          backdrop: { sx: { backgroundColor: "rgba(5,5,12,0.75)", backdropFilter: "blur(4px)" } },
          paper: { sx: { background: "var(--chat-bg)", backgroundImage: "none", borderRadius: "20px", border: "1px solid var(--t12)" } },
        }}>
        <DialogTitle sx={{ fontWeight: 800, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Log progress entry
          <IconButton onClick={() => setOpen(false)} sx={{ color: "text.secondary" }}><X size={18} /></IconButton>
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: "12px", fontWeight: 600 }}>{error}</Alert>}

          <Field label="DATE">
            <TextField fullWidth size="small" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
              sx={{ ...inputSx, mb: 0 }} />
          </Field>

          <Typography sx={{ fontWeight: 700, mb: 1.5, mt: 1 }}>Body</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField type="number" label="Weight (kg)" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} sx={inputSx} />
            <TextField type="number" label="Chest (cm)" value={form.chest} onChange={(e) => setForm({ ...form, chest: e.target.value })} sx={inputSx} />
            <TextField type="number" label="Waist (cm)" value={form.waist} onChange={(e) => setForm({ ...form, waist: e.target.value })} sx={inputSx} />
            <TextField type="number" label="Arm (cm)" value={form.arm} onChange={(e) => setForm({ ...form, arm: e.target.value })} sx={inputSx} />
          </Box>

          <Typography sx={{ fontWeight: 700, mb: 1.5, mt: 1 }}>Performance</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField type="number" label="Max lift (kg)" value={form.liftWeight} onChange={(e) => setForm({ ...form, liftWeight: e.target.value })} sx={inputSx} />
            <TextField type="number" label="5K time (mins)" value={form.runTime} onChange={(e) => setForm({ ...form, runTime: e.target.value })} sx={inputSx} />
          </Box>

          <TextField fullWidth multiline rows={2} label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
            sx={inputSx} placeholder="Feeling strong, slept 8h…" />

          <Button fullWidth variant="contained" onClick={save}
            sx={{ background: GRADIENTS.primary, color: "#fff", fontWeight: 700, py: 1.3, borderRadius: "12px", mt: 1 }}>
            Save entry
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

// local Card helper (kept inside file to avoid extra imports)
function Card({ children, i = 0, sx = {} }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="show" custom={i}
      whileHover={{ y: -3, transition: { duration: 0.2 } }} style={{ display: "flex" }}>
      <Box sx={{ ...glassCard, width: "100%", ...sx }}>{children}</Box>
    </motion.div>
  );
}