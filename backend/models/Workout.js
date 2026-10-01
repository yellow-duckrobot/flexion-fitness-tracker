const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sets: { type: Number, default: 3 },
  reps: { type: Number, default: 10 },
  weight: { type: Number, default: 0 },
  notes: { type: String, default: "" },
});

const workoutSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: ["strength", "cardio", "flexibility", "sports"], default: "strength" },
    tags: [{ type: String, trim: true, lowercase: true }],
    notes: { type: String, default: "" },
    date: { type: Date, default: Date.now },
    exercises: [exerciseSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);