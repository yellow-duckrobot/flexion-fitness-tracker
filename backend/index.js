require("dotenv").config();
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const { monitor, metricsHandler } = require("./middleware/monitor");

const app = express();

/* ---------- security headers ---------- */
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } })); // profile pics load from frontend origin
app.use(cors());
app.use(compression()); // gzip all responses (faster page loads)
app.use(express.json({ limit: "2mb" })); // body size cap

/* ---------- rate limiting ---------- */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300, // 300 requests per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests — slow down a little 🐢" },
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30, // stricter for auth endpoints (brute-force protection)
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts — try again in 15 minutes" },
});
app.use("/api", apiLimiter);
app.use(monitor); // request logging + metrics
app.use("/api/login", authLimiter);
app.use("/api/register", authLimiter);

/* ---------- static uploads with cache headers ---------- */
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
app.use("/uploads", express.static("uploads", { maxAge: "7d", immutable: true }));

/* ---------- health check ---------- */
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime(), message: "Flexion backend is running 💪" });
});

/* ---------- routes ---------- */
app.use("/api", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/workouts", require("./routes/workouts"));
app.use("/api/nutrition", require("./routes/nutrition"));
app.use("/api/progress", require("./routes/progress"));
app.use("/api/feedback", require("./routes/feedback"));

/* ---------- 404 + error handler ---------- */
app.use((req, res) => res.status(404).json({ message: "Route not found" }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("💥", err.message);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

/* ---------- MongoDB connection ---------- */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/flexion";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });