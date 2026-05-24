const User = require("../models/User");

// POST /api/courses/:courseId/sessions
const startSession = async (req, res) => {
  try {
    const { courseId } = req.params;
    // const { description, pomodoroSettings } = req.body;
    const { description } = req.body;

    const user = await User.findOne({ auth0Id: req.auth.payload.sub });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const course = user.courses.id(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    if (course.archived)
      return res
        .status(400)
        .json({
          success: false,
          message: "Cannot start a session for an archived course",
        });

    const newSession = {
      description,
      startTime: new Date(),
      completed: false,
      // pomodoroSettings: pomodoroSettings || user.pomodoroSettings,
    };

    course.sessions.push(newSession);
    await user.save();

    const created = course.sessions[course.sessions.length - 1];
    return res.status(201).json({ success: true, session: created });
  } catch (err) {
    console.error("startSession error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH /api/courses/:courseId/sessions/:sessionId
const completeSession = async (req, res) => {
  try {
    const { courseId, sessionId } = req.params;
    const { duration } = req.body

    const user = await User.findOne({ auth0Id: req.auth.payload.sub });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const course = user.courses.id(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    const session = course.sessions.id(sessionId);
    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    if (session.completed)
      return res
        .status(400)
        .json({ success: false, message: "Session already completed" });

    const xpEarned = Math.max(5, Math.round(duration * 2));

    session.endTime = new Date();
    session.duration = duration;
    session.completed = true;
    session.xpEarned = xpEarned;

    course.totalXp += xpEarned;
    user.totalXp += xpEarned;

    const thresholds = [0, 500, 1500, 4000, 10000, 25000];
    const newLevel = thresholds.filter((t) => user.totalXp >= t).length;
    if (newLevel > user.level) {
      user.level = newLevel;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      session,
      xpEarned,
      totalXp: user.totalXp,
      level: user.level,
      levelUp: newLevel > user.level,
    });
  } catch (err) {
    console.error("completeSession error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/courses/:courseId/sessions/:sessionId
const deleteSession = async (req, res) => {
  try {
    const { courseId, sessionId } = req.params;

    const user = await User.findOne({ auth0Id: req.auth.payload.sub });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const course = user.courses.id(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    const session = course.sessions.id(sessionId);
    if (!session)
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });

    if (session.completed) {
      course.totalXp = Math.max(0, course.totalXp - session.xpEarned);
      user.totalXp = Math.max(0, user.totalXp - session.xpEarned);
    }

    session.deleteOne();
    await user.save();

    return res.status(200).json({ success: true, message: "Session deleted" });
  } catch (err) {
    console.error("deleteSession error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/courses/:courseId/sessions
const getSessions = async (req, res) => {
  try {
    const { courseId } = req.params;

    const user = await User.findOne({ auth0Id: req.auth.payload.sub }).select(
      "courses",
    );
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const course = user.courses.id(courseId);
    if (!course)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    return res.status(200).json({ success: true, sessions: course.sessions });
  } catch (err) {
    console.error("getSessions error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { startSession, completeSession, deleteSession, getSessions };
