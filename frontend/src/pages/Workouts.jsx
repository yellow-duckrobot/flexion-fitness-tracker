import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box, Typography, Button, Chip, TextField, Dialog, DialogTitle, DialogContent,
  IconButton, MenuItem, Snackbar, Alert, InputAdornment,
} from "@mui/material";
import {
  Plus, Search, Pencil, Trash2, X, Dumbbell, CalendarDays, Tag as TagIcon,
} from "lucide-react";
import { glassCard, GRADIENTS } from "../theme";

const API = "https://sublime-grad-interventions-malpractice.trycloudflare.com/api";
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("flexion_token")}`,
});

const CATEGORIES = ["strength", "cardio", "flexibility", "sports"];
const CAT_COLOR = { strength: "#22d3ee", cardio: "#f97316", flexibility: "#a855f7", sports: "#34d399" };

const emptyForm = {
  name: "", category: "strength", tags: "", notes: "", date: new Date().toISOString().slice(0, 10),
  exercises: [{ name: "", sets: 3, reps: 10, weight: 0, notes: "" }],
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
    "& input, & textarea": { color: "text.primary", fontWeight: 600 },
  },
  "& .MuiInputLabel-root": { color: "text.secondary", fontWeight: 600 },
  mb: 2,
};

const volume = (w) =>
  w.exercises.reduce((sum, e) => sum + (e.sets || 0) * (e.reps || 0) * (e.weight || 0), 0);

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

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // null = creating
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (catFilter) params.set("category", catFilter);
    const res = await fetch(`${API}/workouts?${params}`, { headers: authHeaders() });
    if (res.ok) setWorkouts(await res.json());
    setLoading(false);
  };

  useEffect(() => { load(); }, [catFilter]); // eslint-disable-line

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(""); setOpen(true); };
  const openEdit = (w) => {
    setEditing(w);
    setForm({
      name: w.name, category: w.category, tags: (w.tags || []).join(", "),
      notes: w.notes || "", date: w.date?.slice(0, 10),
      exercises: w.exercises.map((e) => ({ ...e })),
    });
    setError(""); setOpen(true);
  };

  const setEx = (i, field, val) => {
    const ex = [...form.exercises];
    ex[i] = { ...ex[i], [field]: val };
    setForm({ ...form, exercises: ex });
  };

  const save = async () => {
    if (!form.name.trim()) return setError("Give your workout a name.");
    if (form.exercises.some((e) => !e.name.trim())) return setError("Every exercise needs a name.");

    const body = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
      exercises: form.exercises.filter((e) => e.name.trim()),
    };
    const res = await fetch(`${API}/workouts${editing ? `/${editing._id}` : ""}`, {
      method: editing ? "PUT" : "POST",
      headers: authHeaders(),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.message);
    setOpen(false);
    setToast(editing ? "Workout updated ✅" : "Workout created 🔥");
    load();
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this workout? This can't be undone.")) return;
    const res = await fetch(`${API}/workouts/${id}`, { method: "DELETE", headers: authHeaders() });
    if (res.ok) { setToast("Workout deleted"); load(); }
  };

  const stats = [
    { label: "Total routines", value: workouts.length },
    { label: "Total volume", value: `${workouts.reduce((s, w) => s + volume(w), 0).toLocaleString()} kg` },
    { label: "Exercises logged", value: workouts.reduce((s, w) => s + w.exercises.length, 0) },
  ];

  return (
    <Box className="app-bg" sx={{ minHeight: "100vh", p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast("")} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert variant="filled" sx={{ borderRadius: "12px", fontWeight: 600, background: "#1e1e2e", border: "1px solid rgba(34,211,238,0.4)" }}>{toast}</Alert>
      </Snackbar>

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography sx={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>Workouts</Typography>
          <Typography sx={{ color: "text.secondary", fontWeight: 500 }}>Build routines, track every set.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Plus size={17} />} onClick={openCreate}
          sx={{ background: GRADIENTS.primary, color: "#fff", fontWeight: 700, borderRadius: "12px" }}>
          New workout
        </Button>
      </Box>

      {/* Stats strip */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, mb: 3 }}>
        {stats.map((s, i) => (
          <motion.div key={s.label} variants={fadeUp} initial="hidden" animate="show" custom={i}>
            <Box sx={{ ...glassCard, py: 2 }}>
              <Typography sx={{ fontSize: 20, fontWeight: 800 }}>{s.value}</Typography>
              <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: "text.secondary" }}>{s.label}</Typography>
            </Box>
          </motion.div>
        ))}
      </Box>

      {/* Search + category filter */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 3, flexWrap: "wrap", alignItems: "center" }}>
        <TextField
          size="small" placeholder="Search workouts…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          sx={{ ...inputSx, mb: 0, flex: 1, minWidth: 200, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search size={16} color="#9ca3af" /></InputAdornment>,
          }}
        />
        {["", ...CATEGORIES].map((c) => (
          <Chip
            key={c || "all"}
            label={c || "All"}
            onClick={() => setCatFilter(c)}
            sx={{
              fontWeight: 700, textTransform: "capitalize",
              bgcolor: catFilter === c ? (c ? `${CAT_COLOR[c]}26` : "rgba(34,211,238,0.18)") : "var(----t5)",
              color: catFilter === c ? (c ? CAT_COLOR[c] : "#22d3ee") : "#9ca3af",
              border: "1px solid", borderColor: catFilter === c ? (c ? `${CAT_COLOR[c]}55` : "rgba(34,211,238,0.4)") : "var(----t12)",
            }}
          />
        ))}
      </Box>

      {/* Workout cards */}
      {loading ? (
        <Box sx={{ color: "text.secondary", textAlign: "center", py: 8, fontWeight: 600 }}>Loading workouts…</Box>
      ) : workouts.length === 0 ? (
        <Box sx={{ ...glassCard, textAlign: "center", py: 8 }}>
          <Dumbbell size={40} color="#4b5563" style={{ margin: "0 auto 12px" }} />
          <Typography sx={{ fontWeight: 700, mb: 0.5 }}>No workouts yet</Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 13.5 }}>Create your first routine to get started 💪</Typography>
        </Box>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5 }}>
          <AnimatePresence>
            {workouts.map((w, i) => (
              <motion.div key={w._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.05 }}>
                <Box sx={{ ...glassCard, height: "100%" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                    <Box>
                      <Typography sx={{ fontSize: 17, fontWeight: 800 }}>{w.name}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5, flexWrap: "wrap" }}>
                        <Chip size="small" label={w.category} sx={{
                          textTransform: "capitalize", fontWeight: 700, height: 22,
                          bgcolor: `${CAT_COLOR[w.category]}1c`, color: CAT_COLOR[w.category],
                        }} />
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.4, color: "text.secondary", fontSize: 11.5, fontWeight: 600 }}>
                          <CalendarDays size={12} /> {new Date(w.date).toLocaleDateString()}
                        </Box>
                      </Box>
                    </Box>
                    <Box>
                      <IconButton size="small" onClick={() => openEdit(w)} sx={{ color: "text.secondary", "&:hover": { color: "#22d3ee" } }}>
                        <Pencil size={16} />
                      </IconButton>
                      <IconButton size="small" onClick={() => remove(w._id)} sx={{ color: "text.secondary", "&:hover": { color: "#ef4444" } }}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* exercises preview */}
                  <Box sx={{ mb: 1.5 }}>
                    {w.exercises.slice(0, 4).map((e, j) => (
                      <Box key={j} sx={{ display: "flex", gap: 1.2, fontSize: 12.5, py: 0.5, color: "text.secondary", fontWeight: 600 }}>
                        <Typography sx={{ flex: 1, fontWeight: 700, color: "text.primary", fontSize: 12.5 }}>{e.name}</Typography>
                        <Typography sx={{ fontSize: 12.5 }}>{e.sets}×{e.reps}{e.weight ? ` @ ${e.weight}kg` : ""}</Typography>
                      </Box>
                    ))}
                    {w.exercises.length > 4 && (
                      <Typography sx={{ fontSize: 11.5, color: "#22d3ee", fontWeight: 700, pt: 0.5 }}>
                        +{w.exercises.length - 4} more exercises
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
                    <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap" }}>
                      {(w.tags || []).map((t) => (
                        <Box key={t} sx={{ display: "flex", alignItems: "center", gap: 0.3, fontSize: 10.5, fontWeight: 700, px: 0.8, py: 0.2, borderRadius: "6px", background: "var(----t8)", color: "text.secondary" }}>
                          <TagIcon size={10} /> {t}
                        </Box>
                      ))}
                    </Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 800, color: "#a855f7" }}>
                      {volume(w).toLocaleString()} kg volume
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
        </Box>
      )}

      {/* Create / Edit dialog */}
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
          {editing ? "Edit workout" : "New workout"}
          <IconButton onClick={() => setOpen(false)} sx={{ color: "text.secondary" }}><X size={18} /></IconButton>
        </DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: "12px", fontWeight: 600 }}>{error}</Alert>}

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr" }, gap: 2 }}>
            <Field label="WORKOUT NAME">
              <TextField fullWidth size="small" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} sx={{ ...inputSx, mb: 0 }} placeholder="Push Day" />
            </Field>
            <Field label="CATEGORY">
              <TextField select fullWidth size="small" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} sx={{ ...inputSx, mb: 0 }}>
                {CATEGORIES.map((c) => <MenuItem key={c} value={c} sx={{ textTransform: "capitalize" }}>{c}</MenuItem>)}
              </TextField>
            </Field>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <Field label="TAGS">
              <TextField fullWidth size="small" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} sx={{ ...inputSx, mb: 0 }} placeholder="chest, triceps, gym" />
            </Field>
            <Field label="DATE">
              <TextField fullWidth size="small" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} sx={{ ...inputSx, mb: 0 }} />
            </Field>
          </Box>

          <Typography sx={{ fontWeight: 700, mb: 1.5, mt: 1 }}>Exercises</Typography>
          {form.exercises.map((e, i) => (
            <Box key={i} sx={{ p: 1.5, mb: 1.5, borderRadius: "14px", background: "var(----t3)", border: "1px solid var(----t8)" }}>
              <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", flexWrap: "wrap" }}>
                <TextField size="small" label="Exercise" value={e.name} onChange={(ev) => setEx(i, "name", ev.target.value)}
                  sx={{ ...inputSx, mb: 0, flex: 2, minWidth: 140 }} placeholder="Bench Press" />
                <TextField size="small" type="number" label="Sets" value={e.sets} onChange={(ev) => setEx(i, "sets", +ev.target.value)} sx={{ ...inputSx, mb: 0, width: 76 }} />
                <TextField size="small" type="number" label="Reps" value={e.reps} onChange={(ev) => setEx(i, "reps", +ev.target.value)} sx={{ ...inputSx, mb: 0, width: 76 }} />
                <TextField size="small" type="number" label="Kg" value={e.weight} onChange={(ev) => setEx(i, "weight", +ev.target.value)} sx={{ ...inputSx, mb: 0, width: 76 }} />
                {form.exercises.length > 1 && (
                  <IconButton size="small" onClick={() => setForm({ ...form, exercises: form.exercises.filter((_, j) => j !== i) })}
                    sx={{ color: "text.secondary", "&:hover": { color: "#ef4444" } }}>
                    <X size={15} />
                  </IconButton>
                )}
              </Box>
              <TextField size="small" fullWidth label="Notes (optional)" value={e.notes} onChange={(ev) => setEx(i, "notes", ev.target.value)}
                sx={{ ...inputSx, mb: 0, mt: 1 }} placeholder="Slow negatives, focus on form" />
            </Box>
          ))}

          <Button size="small" startIcon={<Plus size={15} />} onClick={() => setForm({ ...form, exercises: [...form.exercises, { name: "", sets: 3, reps: 10, weight: 0, notes: "" }] })}
            sx={{ color: "#22d3ee", fontWeight: 700, mb: 2 }}>
            Add exercise
          </Button>

          <TextField fullWidth multiline rows={2} label="Workout notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} sx={inputSx} placeholder="Felt strong today…" />

          <Button fullWidth variant="contained" onClick={save}
            sx={{ background: GRADIENTS.primary, color: "#fff", fontWeight: 700, py: 1.3, borderRadius: "12px", mt: 1 }}>
            {editing ? "Save changes" : "Create workout"}
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}