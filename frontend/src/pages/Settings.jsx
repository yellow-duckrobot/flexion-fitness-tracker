import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Box, Typography, Button, Snackbar, Alert, Switch, Dialog, DialogTitle, DialogContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GOAL_PLANS } from "../utils/goals";
import { Trash2 } from "lucide-react";
import { Moon, Sun, Bell, BellOff, Ruler, Save, Dumbbell, UtensilsCrossed, Target, Download } from "lucide-react";
import { exportWorkoutsCSV, exportMealsCSV, exportProgressCSV } from "../utils/csv";
import { glassCard, GRADIENTS } from "../theme";
import { requestNotificationPermission } from "../utils/reminders";

const API = "https://wiring-archive-lenses-furnished.trycloudflare.com/api";
const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("flexion_token")}`,
});

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4 } }),
};

const DEFAULTS = {
  theme: "dark",
  units: "metric",
  notifications: { workoutReminders: false, mealReminders: false, goalAlerts: false },
  reminderTimes: {
    workout: "18:00",
    meals: { breakfast: "08:00", lunch: "13:00", dinner: "19:00" },
  },
};

function Toggle({ label, desc, icon, checked, onChange }) {
  return (
    <Box sx={{
      display: "flex", alignItems: "center", gap: 2, p: 1.8, mb: 1.2, borderRadius: "14px",
      background: "var(----t3)", border: "1px solid var(----t8)",
    }}>
      <Box sx={{
        width: 40, height: 40, borderRadius: "12px", flexShrink: 0,
        background: checked ? GRADIENTS.primary : "var(----t8)",
        display: "grid", placeItems: "center", color: checked ? "#fff" : "#9ca3af", transition: "all 0.25s",
      }}>
        {icon}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{label}</Typography>
        <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: "text.secondary" }}>{desc}</Typography>
      </Box>
      <Switch
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        sx={{
          "& .MuiSwitch-switchBase.Mui-checked": { color: "#22d3ee" },
          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { background: GRADIENTS.primary },
        }}
      />
    </Box>
  );
}

function TimeRow({ label, value, onChange, disabled }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", py: 1 }}>
      <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: disabled ? "text.disabled" : "text.primary", textTransform: "capitalize" }}>
        {label}
      </Typography>
      <Box
        component="input"
        type="time"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        sx={{
          background: "var(----t5)", border: "1px solid var(----t12)",
          borderRadius: "10px", color: "text.primary", px: 1.2, py: 0.7,
          fontWeight: 700, fontSize: 13,
          "&:disabled": { opacity: 0.4 },
          "&:focus": { outline: "none", borderColor: "#22d3ee" },
        }}
      />
    </Box>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [settings, setSettings] = useState(DEFAULTS);
  const [delOpen, setDelOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [goodbye, setGoodbye] = useState(false);
  const [notifPerm, setNotifPerm] = useState("default");
  const [toast, setToast] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API}/users/me`, { headers: { Authorization: `Bearer ${localStorage.getItem("flexion_token")}` } })
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        if (!u) return;
        setGoal(u.goal || "maintain");
        const s = u.settings || {};
        setSettings({
          theme: s.theme || "dark",
          units: s.units || "metric",
          notifications: { ...DEFAULTS.notifications, ...(s.notifications || {}) },
          reminderTimes: {
            workout: s.reminderTimes?.workout || "18:00",
            meals: { ...DEFAULTS.reminderTimes.meals, ...(s.reminderTimes?.meals || {}) },
          },
        });
      });
    if ("Notification" in window) setNotifPerm(Notification.permission);
  }, []);

  const set = (path, value) => {
    const next = JSON.parse(JSON.stringify(settings));
    const keys = path.split(".");
    let obj = next;
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
    obj[keys[keys.length - 1]] = value;
    setSettings(next);
  };

  const applyTheme = (theme) => {
    set("theme", theme);
    localStorage.setItem("flexion_theme", theme);
    window.dispatchEvent(new Event("flexion-theme"));
  };

  const enableNotifications = async () => {
    const perm = await requestNotificationPermission();
    setNotifPerm(perm);
    setToast(perm === "granted" ? "Notifications enabled 🔔" : perm === "denied" ? "Blocked by browser — enable in site settings" : "Not supported in this browser");
  };

  const save = async () => {
    setSaving(true);
    const res = await fetch(`${API}/users/me`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ settings, goal }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return setToast(data.message);
    localStorage.setItem("flexion_settings", JSON.stringify(settings));
    localStorage.setItem("flexion_theme", settings.theme);
    window.dispatchEvent(new Event("flexion-theme"));
    setToast("Settings saved ✅");
  };

  const anyNotif = settings.notifications.workoutReminders || settings.notifications.mealReminders || settings.notifications.goalAlerts;

  return (
    <Box className="app-bg" sx={{ minHeight: "100vh", p: { xs: 2, md: 4 }, maxWidth: 820, mx: "auto" }}>
      <Snackbar open={!!toast} autoHideDuration={2600} onClose={() => setToast("")} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert variant="filled" sx={{ borderRadius: "12px", fontWeight: 600, background: "#1e1e2e", border: "1px solid rgba(34,211,238,0.4)" }}>{toast}</Alert>
      </Snackbar>

      <Typography sx={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", mb: 0.5 }}>Settings</Typography>
      <Typography sx={{ color: "text.secondary", fontWeight: 500, mb: 3 }}>Make Flexion yours.</Typography>

      {/* Appearance */}
      <motion.div variants={fadeUp} initial="hidden" animate="show">
        <Box sx={{ ...glassCard, mb: 3 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 2 }}>Appearance</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            {[
              { value: "dark", label: "Dark", icon: <Moon size={20} />, desc: "Easy on the eyes" },
              { value: "light", label: "Light", icon: <Sun size={20} />, desc: "Bright & clean" },
            ].map((opt) => (
              <Box
                key={opt.value}
                onClick={() => applyTheme(opt.value)}
                sx={{
                  display: "flex", alignItems: "center", gap: 1.5, p: 2, borderRadius: "14px", cursor: "pointer",
                  border: "2px solid", transition: "all 0.2s",
                  borderColor: settings.theme === opt.value ? "#22d3ee" : "var(----t8)",
                  background: settings.theme === opt.value ? "rgba(34,211,238,0.08)" : "var(----t3)",
                }}
              >
                <Box sx={{
                  width: 40, height: 40, borderRadius: "12px", display: "grid", placeItems: "center",
                  background: settings.theme === opt.value ? GRADIENTS.primary : "var(----t8)",
                  color: settings.theme === opt.value ? "#fff" : "#9ca3af",
                }}>
                  {opt.icon}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 14, fontWeight: 800 }}>{opt.label}</Typography>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: "text.secondary" }}>{opt.desc}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 2 }}>Units</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              {[
                { value: "metric", label: "Metric", desc: "kg · cm" },
                { value: "imperial", label: "Imperial", desc: "lb · in" },
              ].map((opt) => (
                <Box
                  key={opt.value}
                  onClick={() => set("units", opt.value)}
                  sx={{
                    display: "flex", alignItems: "center", gap: 1.5, p: 2, borderRadius: "14px", cursor: "pointer",
                    border: "2px solid", transition: "all 0.2s",
                    borderColor: settings.units === opt.value ? "#a855f7" : "var(----t8)",
                    background: settings.units === opt.value ? "rgba(168,85,247,0.08)" : "var(----t3)",
                  }}
                >
                  <Box sx={{
                    width: 40, height: 40, borderRadius: "12px", display: "grid", placeItems: "center",
                    background: settings.units === opt.value ? GRADIENTS.fire : "var(----t8)",
                    color: settings.units === opt.value ? "#fff" : "#9ca3af",
                  }}>
                    <Ruler size={20} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 800 }}>{opt.label}</Typography>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "text.secondary" }}>{opt.desc}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={1}>
        <Box sx={{ ...glassCard, mb: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1.5 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700 }}>Notifications & Reminders</Typography>
            <Button
              size="small" startIcon={notifPerm === "granted" ? <Bell size={15} /> : <BellOff size={15} />}
              onClick={enableNotifications} disabled={notifPerm === "granted" || notifPerm === "unsupported"}
              sx={{ color: "#22d3ee", fontWeight: 700, border: "1px solid rgba(34,211,238,0.35)", borderRadius: "10px" }}
            >
              {notifPerm === "granted" ? "Enabled" : "Enable notifications"}
            </Button>
          </Box>

          <Toggle
            label="Workout reminders" icon={<Dumbbell size={19} />}
            desc="Ping me at my scheduled training time"
            checked={settings.notifications.workoutReminders}
            onChange={(v) => set("notifications.workoutReminders", v)}
          />
          <Toggle
            label="Meal reminders" icon={<UtensilsCrossed size={19} />}
            desc="Breakfast, lunch & dinner logging nudges"
            checked={settings.notifications.mealReminders}
            onChange={(v) => set("notifications.mealReminders", v)}
          />
          <Toggle
            label="Goal check-ins" icon={<Target size={19} />}
            desc="Evening review of daily fitness goals"
            checked={settings.notifications.goalAlerts}
            onChange={(v) => set("notifications.goalAlerts", v)}
          />

          <Box sx={{ mt: 2.5, pt: 2, borderTop: "1px solid var(----t8)", opacity: anyNotif && notifPerm === "granted" ? 1 : 0.55 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 800, color: "text.secondary", letterSpacing: "0.08em", mb: 1 }}>
              REMINDER TIMES
            </Typography>
            <TimeRow label="Workout" value={settings.reminderTimes.workout}
              disabled={!settings.notifications.workoutReminders}
              onChange={(v) => set("reminderTimes.workout", v)} />
            {["breakfast", "lunch", "dinner"].map((m) => (
              <TimeRow key={m} label={m} value={settings.reminderTimes.meals[m]}
                disabled={!settings.notifications.mealReminders}
                onChange={(v) => set(`reminderTimes.meals.${m}`, v)} />
            ))}
            <TimeRow label="Goal check-in (9 PM)" value="21:00" disabled onChange={() => {}} />
          </Box>
        </Box>
      </motion.div>

      {/* My Goal */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}>
        <Box sx={{ ...glassCard, mb: 3 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 0.5 }}>My Goal</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 2 }}>
            Personalizes your dashboard plan, tips and food recommendations.
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1.5 }}>
            {Object.entries(GOAL_PLANS).map(([key, g]) => (
              <Box key={key} onClick={() => setGoal(key)} sx={{
                textAlign: "center", p: 1.8, borderRadius: "14px", cursor: "pointer",
                border: "2px solid", transition: "all 0.2s",
                borderColor: goal === key ? g.color : "var(--t8)",
                background: goal === key ? `${g.color}14` : "var(--t3)",
              }}>
                <Typography sx={{ fontSize: 26, mb: 0.5 }}>{g.emoji}</Typography>
                <Typography sx={{ fontSize: 13.5, fontWeight: 800 }}>{g.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </motion.div>

      {/* Danger zone */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}>
        <Box sx={{ ...glassCard, mb: 3, borderColor: "rgba(239,68,68,0.35)" }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 0.5, color: "#ef4444" }}>Danger Zone</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 2 }}>
            Permanently delete your account and ALL data (workouts, meals, progress, photos). This cannot be undone.
          </Typography>
          <Button variant="outlined" startIcon={<Trash2 size={15} />} onClick={() => { setGoodbye(false); setDelOpen(true); }}
            sx={{ color: "#ef4444", borderColor: "rgba(239,68,68,0.45)", fontWeight: 700, borderRadius: "10px" }}>
            Delete my account
          </Button>
        </Box>
      </motion.div>

      {/* Data export */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}>
        <Box sx={{ ...glassCard, mb: 3 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 0.5 }}>Export my data</Typography>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary", mb: 2 }}>
            Download your data as CSV files — works in Excel & Google Sheets.
          </Typography>
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {[
              { label: "Workouts CSV", fn: exportWorkoutsCSV },
              { label: "Meals CSV", fn: exportMealsCSV },
              { label: "Progress CSV", fn: exportProgressCSV },
            ].map((b) => (
              <Button key={b.label} variant="outlined" startIcon={<Download size={15} />} onClick={b.fn}
                sx={{ color: "#22d3ee", borderColor: "rgba(34,211,238,0.35)", fontWeight: 700, borderRadius: "10px" }}>
                {b.label}
              </Button>
            ))}
          </Box>
        </Box>
      </motion.div>

      <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}>
        <Button
          variant="contained" startIcon={<Save size={16} />} onClick={save} disabled={saving}
          sx={{ background: GRADIENTS.primary, color: "#fff", fontWeight: 700, py: 1.3, px: 4, borderRadius: "12px" }}
        >
          {saving ? "Saving…" : "Save settings"}
        </Button>
      </motion.div>
      {/* delete confirmation dialog */}
      <Dialog open={delOpen} onClose={() => !deleting && setDelOpen(false)} maxWidth="xs" fullWidth
        slotProps={{ backdrop: { sx: { backgroundColor: "rgba(5,5,12,0.8)" } },
                     paper: { sx: { background: "var(--chat-bg)", backgroundImage: "none", borderRadius: "20px", border: "1px solid rgba(239,68,68,0.4)" } } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>{goodbye ? "Goodbye 👋" : "Delete account?"}</DialogTitle>
        <DialogContent>
          {goodbye ? (
            <>
              <Typography sx={{ fontWeight: 600, color: "text.secondary", mb: 3 }}>
                Your account and all your data have been deleted. Thanks for being part of Flexion — come back anytime, your goals will be waiting. 💪
              </Typography>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary" }}>Redirecting to register…</Typography>
            </>
          ) : (
            <>
              <Typography sx={{ fontWeight: 600, color: "text.secondary", mb: 2.5 }}>
                This permanently erases your profile, workouts, meals, progress entries and uploaded photos (GDPR right to erasure). There is no undo.
              </Typography>
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button fullWidth variant="outlined" disabled={deleting} onClick={() => setDelOpen(false)}
                  sx={{ color: "text.secondary", borderColor: "var(--t12)", fontWeight: 700, borderRadius: "10px" }}>
                  Keep my account
                </Button>
                <Button fullWidth variant="contained" disabled={deleting} onClick={async () => {
                    setDeleting(true);
                    const res = await fetch("https://wiring-archive-lenses-furnished.trycloudflare.com/api/users/me", {
                      method: "DELETE",
                      headers: { Authorization: `Bearer ${localStorage.getItem("flexion_token")}` },
                    });
                    setDeleting(false);
                    if (res.ok) {
                      setGoodbye(true);
                      setTimeout(() => { localStorage.clear(); navigate("/auth"); }, 2200);
                    }
                  }}
                  sx={{ background: "#ef4444", color: "#fff", fontWeight: 800, borderRadius: "10px" }}>
                  {deleting ? "Deleting…" : "Delete forever"}
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>

    </Box>
  );
}