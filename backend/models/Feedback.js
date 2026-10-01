const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["support", "bug", "feedback"], default: "feedback" },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    status: { type: String, enum: ["open", "in-review", "resolved"], default: "open" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Feedback", feedbackSchema);