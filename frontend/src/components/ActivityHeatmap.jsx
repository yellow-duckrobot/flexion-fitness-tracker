import { useMemo } from "react";
import { Box, Tooltip } from "@mui/material";

const DAY = 86400000;

function level(count) {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 4) return 2;
  if (count <= 7) return 3;
  return 4;
}

export default function ActivityHeatmap({ workouts = [], meals = [] }) {
  const { days, counts } = useMemo(() => {
    const counts = {};
    const bump = (d, n) => {
      const k = new Date(d).toDateString();
      counts[k] = (counts[k] || 0) + n;
    };
    workouts.forEach((w) => bump(w.date, 3)); // a workout = 3 intensity
    meals.forEach((m) => m.items.forEach(() => bump(m.date, 1)));

    const days = [];
    const today = new Date();
    for (let i = 83; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    return { days, counts };
  }, [workouts, meals]);

  const COLORS = ["var(--heat-0)", "#0e7490", "#22d3ee", "#a855f7", "#f97316"];

  return (
    <Box sx={{ display: "grid", gridTemplateRows: "repeat(7, 1fr)", gridAutoFlow: "column", gap: "4px", width: "fit-content", maxWidth: "100%", overflowX: "auto", py: 0.5 }}>
      {days.map((d, i) => {
        const c = counts[d.toDateString()] || 0;
        const lv = level(c);
        return (
          <Tooltip
            key={i}
            title={`${d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} — ${c === 0 ? "no activity" : `${c} activity points`}`}
            arrow
          >
            <Box sx={{
              width: 13, height: 13, borderRadius: "4px",
              background: COLORS[lv],
              transition: "transform 0.15s",
              "&:hover": { transform: "scale(1.25)" },
            }} />
          </Tooltip>
        );
      })}
    </Box>
  );
}