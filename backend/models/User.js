const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, select: false },
    profilePicture: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 200 },
    settings: {
      theme: { type: String, enum: ["dark", "light"], default: "dark" },
      units: { type: String, enum: ["metric", "imperial"], default: "metric" },
      notifications: {
        workoutReminders: { type: Boolean, default: false },
        mealReminders: { type: Boolean, default: false },
        goalAlerts: { type: Boolean, default: false },
      },
      reminderTimes: {
        workout: { type: String, default: "18:00" },
        meals: {
          breakfast: { type: String, default: "08:00" },
          lunch: { type: String, default: "13:00" },
          dinner: { type: String, default: "19:00" },
        },
      },
    },
  },
  { timestamps: true }
);

// hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// compare password method
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);