const mongoose = require("mongoose");

const pomodoroSettingsSchema = new mongoose.Schema(
  {
    focusDuration: { type: Number, default: 25 },
    shortBreak: { type: Number, default: 5 },
    longBreak: { type: Number, default: 15 },
    cyclesBeforeLongBreak: { type: Number, default: 4 },
    autoStartBreaks: { type: Boolean, default: false },
    autoStartFocus: { type: Boolean, default: false },
  },
  { _id: false },
);

const sessionSchema = new mongoose.Schema(
  {
    description: { type: String, trim: true },
    startTime: { type: Date, required: true, default: Date.now },
    endTime: { type: Date },
    duration: { type: Number },
    completed: { type: Boolean, default: false },
    xpEarned: { type: Number, default: 0 },
    pomodoroSettings: pomodoroSettingsSchema,
  },
  { timestamps: true },
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    color: { type: String, default: "#7c6fff" },
    archived: { type: Boolean, default: false },
    totalXp: { type: Number, default: 0 },
    sessions: { type: [sessionSchema], default: [] },
  },
  { timestamps: true },
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: { type: String, required: true, trim: true },
    auth0Id: { type: String, required: true, unique: true },

    totalXp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    unlockedArts: { type: [String], default: [] },

    pomodoroSettings: { type: pomodoroSettingsSchema, default: () => ({}) },

    courses: { type: [courseSchema], default: [] },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
module.exports = User;
