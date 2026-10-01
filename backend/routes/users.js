const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// ---- profile picture upload setup ----
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${req.user._id}-${Date.now()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

// GET /api/users/search?q=ali — find other users (public info only)
router.get("/search", auth, async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);
    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [
        { username: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
      ],
    }).select("name username profilePicture bio").limit(5);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/me — fetch my profile (protected)
router.get("/me", auth, async (req, res) => {
  res.json(req.user);
});

// PUT /api/users/me — update profile info + settings (protected)
router.put("/me", auth, async (req, res) => {
  try {
    const { name, username, email, bio } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (bio !== undefined) updates.bio = bio;
    if (req.body.goal) updates.goal = req.body.goal;
    if (username) {
      const taken = await User.findOne({ username: username.toLowerCase(), _id: { $ne: req.user._id } });
      if (taken) return res.status(409).json({ message: "Username is already taken" });
      updates.username = username;
    }
    if (email) {
      const taken = await User.findOne({ email: email.toLowerCase(), _id: { $ne: req.user._id } });
      if (taken) return res.status(409).json({ message: "Email is already registered" });
      updates.email = email;
    }
    // merge nested settings (theme/units/notifications/reminder times)
    if (req.body.settings) {
      const cur = (req.user.settings || {});
      const inc = req.body.settings;
      updates.settings = {
        ...cur, ...inc,
        notifications: { ...(cur.notifications || {}), ...(inc.notifications || {}) },
        reminderTimes: {
          ...(cur.reminderTimes || {}), ...(inc.reminderTimes || {}),
          meals: { ...(cur.reminderTimes?.meals || {}), ...(inc.reminderTimes?.meals || {}) },
        },
      };
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users/me/picture — upload profile picture (protected)
router.post("/me/picture", auth, upload.single("picture"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePicture: `/uploads/${req.file.filename}` },
      { new: true }
    );
    res.json({ message: "Profile picture updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/me/export — GDPR data portability: full JSON dump of everything
router.get("/me/export", auth, async (req, res) => {
  try {
    const [workouts, meals, progressEntries, feedbacks] = await Promise.all([
      require("../models/Workout").find({ user: req.user._id }).lean(),
      require("../models/Meal").find({ user: req.user._id }).lean(),
      require("../models/Progress").find({ user: req.user._id }).lean(),
      require("../models/Feedback").find({ user: req.user._id }).lean(),
    ]);
    res.json({
      exportedAt: new Date().toISOString(),
      profile: {
        name: req.user.name, username: req.user.username, email: req.user.email,
        bio: req.user.bio, profilePicture: req.user.profilePicture,
        settings: req.user.settings, createdAt: req.user.createdAt,
      },
      workouts, meals, progress: progressEntries, feedback: feedbacks,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/users/me — GDPR right to be forgotten: removes account + ALL user data
router.delete("/me", auth, async (req, res) => {
  try {
    const uid = req.user._id;
    await Promise.all([
      require("../models/Workout").deleteMany({ user: uid }),
      require("../models/Meal").deleteMany({ user: uid }),
      require("../models/Progress").deleteMany({ user: uid }),
      require("../models/Feedback").deleteMany({ user: uid }),
    ]);
    try {
      fs.readdirSync("uploads")
        .filter((f) => f.startsWith(String(uid)))
        .forEach((f) => fs.unlinkSync(`uploads/${f}`));
    } catch (_) {}
    await User.findByIdAndDelete(uid);
    res.json({ message: "Account and all associated data deleted. Sorry to see you go 👋" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;