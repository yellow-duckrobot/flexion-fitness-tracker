import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Box, Typography, Avatar, IconButton, Dialog } from "@mui/material";
import {
  LayoutGrid, Dumbbell, UtensilsCrossed, TrendingUp, User, LogOut, Settings as SettingsIcon, LifeBuoy, Gamepad2, MoreHorizontal,
} from "lucide-react";
import { startReminderEngine } from "../utils/reminders";
import Coach from "./Coach";
import Mascot from "./Mascot";
import { GRADIENTS } from "../theme";

const API = "http://localhost:5000/api";

const NAV = [
  { to: "/dashboard", icon: <LayoutGrid size={20} />, label: "Dashboard" },
  { to: "/workouts", icon: <Dumbbell size={20} />, label: "Workouts" },
  { to: "/nutrition", icon: <UtensilsCrossed size={20} />, label: "Nutrition" },
  { to: "/progress", icon: <TrendingUp size={20} />, label: "Progress" },
  { to: "/profile", icon: <User size={20} />, label: "Profile" },
  { to: "/settings", icon: <SettingsIcon size={20} />, label: "Settings" },
  { to: "/support", icon: <LifeBuoy size={20} />, label: "Support" },
  { to: "/game", icon: <Gamepad2 size={20} />, label: "Mini Game" },
];

function NavItem({ to, icon, label, mobile }) {
  return (
    <Box
      component={NavLink}
      to={to}
      sx={{
        display: "flex", alignItems: "center",
        px: mobile ? 0 : 1.8, py: mobile ? 0.6 : 1.2, borderRadius: "12px",
        color: "text.secondary", textDecoration: "none", fontWeight: 600, fontSize: 14,
        flexDirection: mobile ? "column" : "row", gap: mobile ? 0.3 : 1.4,
        transition: "all 0.2s",
        "&:hover": { color: "#fff", background: mobile ? "transparent" : "var(----t5)" },
        "&.active": {
          color: "#fff",
          background: mobile ? "transparent" : "linear-gradient(90deg, rgba(34,211,238,0.15), rgba(168,85,247,0.15))",
          ...(mobile ? {} : { boxShadow: "inset 3px 0 0 #22d3ee" }),
        },
        "&.active svg": { color: "#22d3ee" },
      }}
    >
      {icon}
      <Box component="span" sx={{ fontSize: mobile ? 10 : 14 }}>{label}</Box>
    </Box>
  );
}

export default function AppLayout() {
  const navigate = useNavigate();
  // start with cached user, then refresh from API so new profile pics appear immediately
  const [me, setMe] = useState(() => JSON.parse(localStorage.getItem("flexion_user") || "{}"));
  const [moreOpen, setMoreOpen] = useState(false);

  const refreshMe = () =>
    fetch(`${API}/users/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("flexion_token")}` },
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((u) => {
        if (u && u._id) {
          setMe(u);
          localStorage.setItem("flexion_user", JSON.stringify(u));
          localStorage.setItem("flexion_settings", JSON.stringify(u.settings || {}));
          const t = u.settings?.theme || "dark";
          localStorage.setItem("flexion_theme", t);
          window.dispatchEvent(new Event("flexion-theme"));
        }
      })
      .catch(() => {});

  useEffect(() => {
    refreshMe();
    startReminderEngine(); // fire scheduled reminders (workout / meals / goals)
    window.addEventListener("flexion-user-updated", refreshMe); // live sidebar sync
    return () => window.removeEventListener("flexion-user-updated", refreshMe);
  }, []);

  const avatarUrl = me.profilePicture ? `http://localhost:5000${me.profilePicture}` : null;

  const logout = () => {
    localStorage.removeItem("flexion_token");
    localStorage.removeItem("flexion_user");
    navigate("/auth");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", overflowX: "hidden", width: "100%", position: "relative" }}>
      {/* Sidebar — fixed, always full height, solid background */}
      <Box sx={{
        display: { xs: "none", md: "flex" },
        position: "fixed", left: 0, top: 0, bottom: 0,
        width: 230, flexDirection: "column",
        background: "#0c0c16",
        borderRight: "1px solid var(----t8)",
        p: 2.5, zIndex: 50,
      }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 4, px: 1 }}>
          <Box component="img" src="/icon-64.png" alt="Flexion logo" sx={{ width: 38, height: 38, borderRadius: "10px", display: "block" }} />
          <Box>
            <Typography sx={{ fontWeight: 800, letterSpacing: "0.05em", lineHeight: 1, color: "#fff" }}>FLEXION</Typography>
            <Typography sx={{ fontSize: 9, color: "#22d3ee", letterSpacing: "0.24em", fontWeight: 700 }}>FITNESS OS</Typography>
          </Box>
        </Box>

        {NAV.map((n) => <NavItem key={n.to} {...n} />)}

        <Box sx={{ flex: 1 }} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, p: 1.2, borderRadius: "14px", background: "var(----t5)", border: "1px solid var(----t8)" }}>
          <Avatar src={avatarUrl} sx={{ width: 36, height: 36, background: GRADIENTS.fire, fontSize: 14, fontWeight: 800 }}>
            {(me.name || "C").charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{me.name}</Typography>
            <Typography sx={{ fontSize: 11, color: "text.secondary", fontWeight: 600 }}>@{me.username}</Typography>
          </Box>
          <IconButton size="small" onClick={logout} sx={{ color: "text.secondary", "&:hover": { color: "#ef4444" } }}>
            <LogOut size={16} />
          </IconButton>
        </Box>
      </Box>

      {/* Main content — offset by sidebar width on desktop */}
      <Box sx={{ ml: { xs: 0, md: "230px" }, pb: { xs: 9, md: 0 }, minHeight: "100vh", maxWidth: "100vw", overflowX: "hidden" }}>
        <Outlet />
      </Box>

      <Coach />
      <Mascot />

      {/* Bottom nav — mobile only */}
      <Box sx={{
        display: { xs: "flex", md: "none" },
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(12,12,22,0.92)", backdropFilter: "blur(14px)",
        borderTop: "1px solid var(----t8)",
        justifyContent: "space-around", px: 1, py: 0.8,
      }}>
        {NAV.slice(0, 4).map((n) => <NavItem key={n.to} {...n} mobile />)}
        <Box component="button" onClick={() => setMoreOpen(true)} sx={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 0.3,
          background: "none", border: 0, cursor: "pointer", color: "#9ca3af", px: 1.2, py: 0.6,
          fontFamily: "inherit",
        }}>
          <MoreHorizontal size={20} />
          <Box component="span" sx={{ fontSize: 10, fontWeight: 600 }}>More</Box>
        </Box>
      </Box>

      {/* More sheet — mobile overflow nav */}
      <Dialog open={moreOpen} onClose={() => setMoreOpen(false)} fullWidth
        slotProps={{ paper: { sx: { bgcolor: "#12121e", backgroundImage: "none", borderRadius: "20px 20px 0 0", m: 0, position: "fixed", bottom: 0, maxWidth: "100vw !important" } } }}>
        <Box sx={{ p: 2.2, pb: 4 }}>
          <Typography sx={{ fontWeight: 800, mb: 1.5, fontSize: 16 }}>More</Typography>
          {NAV.slice(4).map((n) => (
            <Box key={n.to} component={NavLink} to={n.to} onClick={() => setMoreOpen(false)} sx={{
              display: "flex", alignItems: "center", gap: 1.5, px: 1.6, py: 1.4, borderRadius: "12px",
              color: "#9ca3af", textDecoration: "none", fontWeight: 700, fontSize: 14,
              "&:hover, &.active": { color: "#fff", bgcolor: "rgba(255,255,255,0.06)" },
              "&.active svg": { color: "#22d3ee" },
            }}>
              {n.icon} {n.label}
            </Box>
          ))}
        </Box>
      </Dialog>
    </Box>
  );
}
