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


userSchema.statics.getStudyCalendar = async function(auth0Id) {
  const user = await this.findOne({ auth0Id });
  if (!user) return [];

  const activityMap = {};

  user.courses.forEach(course => {
    course.sessions.forEach(session => {
      const dateKey = session.startTime.toISOString().split('T')[0];
      
      if (!activityMap[dateKey]) {
        activityMap[dateKey] = { count: 0, totalXp: 0, date: dateKey };
      }
      activityMap[dateKey].count += 1;
      activityMap[dateKey].totalXp += session.xpEarned || 0;
    });
  });

  return Object.values(activityMap); 
};


userSchema.statics.getGlobalStats = async function(auth0Id) {
  const user = await this.findOne({ auth0Id });
  if (!user) return null;

  const totalSessions = user.courses.reduce((acc, course) => acc + course.sessions.length, 0);
  const totalMinutes = user.courses.reduce((acc, course) => {
    return acc + course.sessions.reduce((sAcc, s) => sAcc + (s.duration || 0), 0);
  }, 0);

  return {
    level: user.level,
    totalXp: user.totalXp,
    totalSessions,
    totalHours: (totalMinutes / 60).toFixed(1),
    courseCount: user.courses.length
  };
};

const User = mongoose.model("User", userSchema);
module.exports = User;
