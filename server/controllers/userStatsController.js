const User = require("../models/User");

const getUserStats = async (req, res) => {
  const auth0Id = req.auth?.payload?.sub;
  if (!auth0Id) {
    return res.status(400).json({
      success: false,
      message: "Auth0Id is required to fetch statistics.",
    });
  }

  try {
    const calendar = await User.getStudyCalendar(auth0Id);
    const stats = await User.getGlobalStats(auth0Id);

    if (!calendar || !stats) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: { calendar, stats },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching stats", error: err.message });
  }
};

const getWeeklyProgress = async (req, res) => {
  try {
    const auth0Id = req.auth?.payload?.sub;
    
    const weeklyData = await User.getWeeklyXpProgression(auth0Id);

    const totalWeeklyXp = weeklyData.reduce((sum, day) => sum + day.xpEarned, 0);

    return res.status(200).json({
      success: true,
      totalWeeklyXp,
      progression: weeklyData
    });
  } catch (err) {
    console.error("getWeeklyProgress error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getUserStats, getWeeklyProgress };
