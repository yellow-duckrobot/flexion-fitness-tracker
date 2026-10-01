export function downloadCSV(filename, rows) {
  if (!rows || !rows.length) {
    alert("Nothing to export yet — add some data first!");
    return;
  }
  const headers = Object.keys(rows[0]);
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => esc(r[h])).join(",")),
  ];
  const blob = new Blob(["\uFEFF" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("flexion_token")}`,
});

const d = (x) => (x ? new Date(x).toISOString().slice(0, 10) : "");

export async function exportWorkoutsCSV() {
  const res = await fetch("https://wiring-archive-lenses-furnished.trycloudflare.com/api/workouts", { headers: authHeaders() });
  if (!res.ok) return alert("Export failed — are you logged in?");
  const data = await res.json();
  const items = Array.isArray(data) ? data : data.items;
  const rows = [];
  for (const w of items)
    for (const e of w.exercises)
      rows.push({
        date: d(w.date), workout: w.name, category: w.category,
        tags: (w.tags || []).join("|"), exercise: e.name,
        sets: e.sets, reps: e.reps, weight_kg: e.weight, notes: e.notes || "",
      });
  downloadCSV(`flexion-workouts-${new Date().toISOString().slice(0, 10)}.csv`, rows);
}

export async function exportMealsCSV() {
  const res = await fetch("https://wiring-archive-lenses-furnished.trycloudflare.com/api/nutrition", { headers: authHeaders() });
  if (!res.ok) return alert("Export failed — are you logged in?");
  const data = await res.json();
  const items = Array.isArray(data) ? data : data.items;
  const rows = [];
  for (const m of items)
    for (const i of m.items)
      rows.push({
        date: d(m.date), meal: m.mealType, food: i.name, quantity: i.quantity,
        calories: i.calories, protein_g: i.protein, carbs_g: i.carbs, fat_g: i.fat,
      });
  downloadCSV(`flexion-meals-${new Date().toISOString().slice(0, 10)}.csv`, rows);
}

export async function exportProgressCSV() {
  const res = await fetch("https://wiring-archive-lenses-furnished.trycloudflare.com/api/progress", { headers: authHeaders() });
  if (!res.ok) return alert("Export failed — are you logged in?");
  const items = await res.json();
  downloadCSV(`flexion-progress-${new Date().toISOString().slice(0, 10)}.csv`,
    items.map((p) => ({
      date: d(p.date), weight_kg: p.weight ?? "", chest_cm: p.chest ?? "", waist_cm: p.waist ?? "",
      hips_cm: p.hips ?? "", arm_cm: p.arm ?? "", max_lift_kg: p.liftWeight ?? "",
      run_time_min: p.runTime ?? "", notes: p.notes || "",
    })));
}