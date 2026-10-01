const express = require("express");
const auth = require("../middleware/auth");
const Feedback = require("../models/Feedback");

const router = express.Router();
router.use(auth);

// POST /api/feedback — submit support request / bug report / feedback
router.post("/", async (req, res) => {
  try {
    const { type, subject, message } = req.body;
    if (!subject || !message)
      return res.status(400).json({ message: "Subject and message are required" });
    const entry = new Feedback({
      user: req.user._id,
      type: type || "feedback",
      subject,
      message,
    });
    await entry.save();
    res.status(201).json({ message: "Thanks! We\u2019ve received your message.", entry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/feedback/mine — my previous submissions
router.get("/mine", async (req, res) => {
  try {
    const entries = await Feedback.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(20);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;