import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Box, Typography, Avatar, Button, TextField, IconButton, Snackbar, Alert, Divider } from "@mui/material";
import { Camera, Pencil, Check, X, Flame, Dumbbell, CalendarDays } from "lucide-react";
import { GRADIENTS } from "../theme";

const API = "https://sublime-grad-interventions-malpractice.trycloudflare.com//api";
const token = () => localStorage.getItem("flexion_token");

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5 } }),
};

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px", background: "rgba(255,255,255,0.05)",
    "& fieldset": { borderColor: "rgba(255,255,255,0.14)" },
    "&:hover fieldset": { borderColor: "rgba(34,211,238,0.55)" },
    "&.Mui-focused fieldset": { borderColor: "#22d3ee" },
    "& input": { color: "#f9fafb", fontWeight: 600 },
  },
  "& .MuiInputLabel-root": { color: "#9ca3af", fontWeight: 600 },
  mb: 2,
};

export default function Profile() {
  const fileInput = useRef(null);
  const [user, setUser] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: "", username: "", email: "", bio: "" });
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

  const headers = { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" };

useEffect(() => {
  fetch(`${API}/users/me`, { headers: { Authorization: `Bearer ${token()}` } })
    .then(async (r) => {
      if (!r.ok) throw new Error(`Server returned ${r.status}`);
      return r.json();
    })
    .then((u) => {
      setUser(u);
      setForm({ name: u.name, username: u.username, email: u.email, bio: u.bio || "" });
    })
    .catch((err) => setError("Couldn't load profile: " + err.message));
}, []);

  const avatarUrl = user?.profilePicture ? `https://sublime-grad-interventions-malpractice.trycloudflare.com/${user.profilePicture}` : null;

  const uploadPicture = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("picture", file);
    const res = await fetch(`${API}/users/me/picture`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token()}` }, // no Content-Type — browser sets the boundary
      body: fd,
    });
    const data = await res.json();
    if (res.ok) {
  setUser(data.user);
  localStorage.setItem("flexion_user", JSON.stringify(data.user));
  setToast("Profile picture updated 📸");
}
    else setError(data.message);
  };

  const save = async () => {
    const res = await fetch(`${API}/users/me`, { method: "PUT", headers, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) return setError(data.message);
    setUser(data.user);
    localStorage.setItem("flexion_user", JSON.stringify(data.user)); window.dispatchEvent(new Event("flexion-user-updated"));
    setEdit(false);
    setError("");
    setToast("Profile saved ✅");
  };

  if (!user) return <Box className="app-bg" sx={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "#9ca3af" }}>Loading…</Box>;

  return (
    <Box className="app-bg" sx={{ minHeight: "100vh", p: { xs: 2, md: 4 }, maxWidth: 900, mx: "auto" }}>
      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast("")} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert variant="filled" sx={{ borderRadius: "12px", fontWeight: 600, background: "#1e1e2e", border: "1px solid rgba(34,211,238,0.4)" }}>{toast}</Alert>
      </Snackbar>

      {/* Profile header card */}
      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <Box sx={{
          borderRadius: "24px", p: { xs: 3, md: 5 }, mb: 3,
          background: "linear-gradient(135deg,rgba(34,211,238,0.10),rgba(168,85,247,0.12)), rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.09)",
          display: "flex", alignItems: "center", gap: { xs: 2.5, md: 4 }, flexWrap: "wrap",
        }}>
          {/* Avatar with upload */}
          <Box sx={{ position: "relative" }}>
            <Box sx={{
              p: "3px", borderRadius: "50%",
              background: GRADIENTS.primary,
            }}>
              <Avatar
                src={avatarUrl}
                sx={{ width: { xs: 96, md: 128 }, height: { xs: 96, md: 128 }, border: "3px solid #0a0a14", fontSize: 40, fontWeight: 800, bgcolor: "#1e1e2e" }}
              >
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
            </Box>
            <IconButton
              onClick={() => fileInput.current.click()}
              sx={{
                position: "absolute", bottom: 4, right: 4,
                bgcolor: "#22d3ee", color: "#0a0a14", width: 36, height: 36,
                "&:hover": { bgcolor: "#67e8f9" },
              }}
            >
              <Camera size={17} />
            </IconButton>
            <input ref={fileInput} type="file" accept="image/*" hidden onChange={uploadPicture} />
          </Box>

          {/* Name + info */}
          <Box sx={{ flex: 1, minWidth: 220 }}>
            <Typography sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 800, letterSpacing: "-0.02em" }}>
              {user.name}
            </Typography>
            <Typography sx={{ color: "#22d3ee", fontWeight: 700, fontSize: 14 }}>@{user.username}</Typography>
            <Typography sx={{ color: "text.secondary", fontWeight: 500, fontSize: 14, mt: 1, maxWidth: 480 }}>
              {user.bio || "No bio yet — click edit to tell everyone what you're training for 💪"}
            </Typography>
          </Box>

          <Button
            variant="contained" startIcon={edit ? <X size={16} /> : <Pencil size={16} />}
            onClick={() => setEdit(!edit)}
            sx={{ background: edit ? "rgba(255,255,255,0.08)" : GRADIENTS.primary, color: "#fff", fontWeight: 700, borderRadius: "12px" }}
          >
            {edit ? "Cancel" : "Edit profile"}
          </Button>
        </Box>
      </motion.div>

      {/* Stats strip */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, mb: 3 }}>
        {[
          { icon: <Dumbbell size={20} />, label: "Total workouts", value: 87, grad: GRADIENTS.primary },
          { icon: <Flame size={20} />, label: "Longest streak", value: 21, grad: GRADIENTS.fire },
          { icon: <CalendarDays size={20} />, label: "Days as member", value: 148, grad: GRADIENTS.success },
        ].map((s, i) => (
          <motion.div key={s.label} variants={fadeUp} initial="hidden" animate="show" custom={i + 1}
            whileHover={{ y: -4 }}>
            <Box sx={{ borderRadius: "18px", p: 2.5, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", textAlign: "center" }}>
              <Box sx={{ width: 40, height: 40, borderRadius: "12px", background: s.grad, display: "grid", placeItems: "center", color: "#fff", mx: "auto", mb: 1 }}>
                {s.icon}
              </Box>
              <Typography sx={{ fontSize: 22, fontWeight: 800 }}>{s.value}</Typography>
              <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: "text.secondary" }}>{s.label}</Typography>
            </Box>
          </motion.div>
        ))}
      </Box>

      {/* Edit form / Info display */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}>
        <Box sx={{ borderRadius: "20px", p: 3, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <Typography sx={{ fontSize: 17, fontWeight: 700, mb: 2.5 }}>Account Information</Typography>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: "12px", fontWeight: 600 }}>{error}</Alert>}

          {edit ? (
            <>
              <TextField fullWidth label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} sx={inputSx} />
              <TextField fullWidth label="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} sx={inputSx} />
              <TextField fullWidth label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} sx={inputSx} />
              <TextField fullWidth label="Bio" multiline rows={3} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} sx={inputSx} inputProps={{ maxLength: 200 }} helperText={`${form.bio.length}/200`} />
              <Button variant="contained" startIcon={<Check size={16} />} onClick={save}
                sx={{ background: GRADIENTS.success, color: "#fff", fontWeight: 700, borderRadius: "12px", mt: 1 }}>
                Save changes
              </Button>
            </>
          ) : (
            [
              { label: "Full name", value: user.name },
              { label: "Username", value: `@${user.username}` },
              { label: "Email", value: user.email },
              { label: "Member since", value: new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) },
            ].map((row) => (
              <Box key={row.label}>
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 1.6, flexWrap: "wrap", gap: 1 }}>
                  <Typography sx={{ color: "text.secondary", fontWeight: 600, fontSize: 13.5 }}>{row.label}</Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{row.value}</Typography>
                </Box>
                <Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
              </Box>
            ))
          )}
        </Box>
      </motion.div>
    </Box>
  );
}