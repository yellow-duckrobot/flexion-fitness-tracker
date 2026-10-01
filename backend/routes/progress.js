const express = require("express");
const auth = require("../middleware/auth");
const Progress = require("../models/Progress");

const router = express.Router();
router.use(auth);

// GET /api/progress -> all entries, oldest first (for charts)
router.get("/", async (req, res) => {
  try {
    const entries = await Progress.find({ user: req.user._id }).sort({ date: 1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/progress
router.post("/", async (req, res) => {
  try {
        const entry = new Progress({ ...req.body, user: req.user._id });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/progress/:id
router.delete("/:id", async (req, res) => {
  try {
    const entry = await Progress.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!entry) return res.status(404).json({ message: "Entry not found" });
    res.json({ message: "Entry deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;