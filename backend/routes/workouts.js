const express = require("express");
const auth = require("../middleware/auth");
const Workout = require("../models/Workout");

const router = express.Router();
router.use(auth); // every route below requires login

// GET /api/workouts?category=strength&tag=push&search=day
router.get("/", async (req, res) => {
  try {
    const { category, tag, search } = req.query;
    const filter = { user: req.user._id };
    if (category) filter.category = category;
    if (tag) filter.tags = tag.toLowerCase();
    if (search) filter.name = { $regex: search, $options: "i" };

    const workouts = await Workout.find(filter).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/workouts
router.post("/", async (req, res) => {
  try {
    const workout = new Workout({ ...req.body, user: req.user._id });
    await workout.save();
    res.status(201).json(workout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/workouts/:id (only if it belongs to the logged-in user)
router.put("/:id", async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!workout) return res.status(404).json({ message: "Workout not found" });
    res.json(workout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/workouts/:id
router.delete("/:id", async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!workout) return res.status(404).json({ message: "Workout not found" });
    res.json({ message: "Workout deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;