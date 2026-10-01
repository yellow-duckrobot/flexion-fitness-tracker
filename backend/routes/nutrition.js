const express = require("express");
const auth = require("../middleware/auth");
const Meal = require("../models/Meal");

const router = express.Router();
router.use(auth);

// GET /api/nutrition?date=2026-09-30&mealType=lunch
router.get("/", async (req, res) => {
  try {
    const { date, mealType } = req.query;
    const filter = { user: req.user._id };
    if (mealType) filter.mealType = mealType;
    if (date) {
      const d = new Date(date);
      filter.date = { $gte: d, $lt: new Date(d.getTime() + 24 * 60 * 60 * 1000) };
    }
    const meals = await Meal.find(filter).sort({ date: -1 });
    res.json(meals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/nutrition/summary?date=...  -> daily macro totals
router.get("/summary", async (req, res) => {
  try {
    const date = req.query.date ? new Date(req.query.date) : new Date();
    const start = new Date(date.setHours(0, 0, 0, 0));
    const end = new Date(date.setHours(23, 59, 59, 999));
    const meals = await Meal.find({ user: req.user._id, date: { $gte: start, $lte: end } });

    const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    for (const m of meals)
      for (const item of m.items) {
        totals.calories += item.calories;
        totals.protein += item.protein;
        totals.carbs += item.carbs;
        totals.fat += item.fat;
      }
    res.json({ totals, mealCount: meals.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/nutrition
router.post("/", async (req, res) => {
  try {
       const meal = new Meal({ ...req.body, user: req.user._id });
    await meal.save();
    res.status(201).json(meal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/nutrition/:id
router.put("/:id", async (req, res) => {
  try {
    const meal = await Meal.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!meal) return res.status(404).json({ message: "Meal not found" });
    res.json(meal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/nutrition/:id
router.delete("/:id", async (req, res) => {
  try {
    const meal = await Meal.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!meal) return res.status(404).json({ message: "Meal not found" });
    res.json({ message: "Meal deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/nutrition/weekly?date=2026-09-30 -> last 7 days of calorie totals
router.get("/weekly", async (req, res) => {
  try {
    const end = req.query.date ? new Date(req.query.date) : new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const meals = await Meal.find({ user: req.user._id, date: { $gte: start, $lte: end } });

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const cal = meals
        .filter((m) => new Date(m.date).toDateString() === d.toDateString())
        .reduce((s, m) => s + m.items.reduce((a, i) => a + i.calories, 0), 0);
      days.push({
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: d.toISOString().slice(0, 10),
        calories: cal,
      });
    }
    res.json(days);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;