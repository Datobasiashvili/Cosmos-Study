const User = require("../models/User");

const normalizeEmail = (email) =>
  typeof email === "string" ? email.toLowerCase().trim() : "";

const normalizeUsername = (username, email) => {
  const fallback = email.split("@")[0] || "student";
  if (typeof username !== "string") return fallback;

  const trimmed = username.trim();
  return trimmed ? trimmed.slice(0, 80) : fallback;
};

const syncUser = async (req, res) => {
  try {
    const auth0Id = req.auth?.payload?.sub;
    if (!auth0Id) {
      return res.status(401).json({
        success: false,
        message: "Authentication subject is missing.",
      });
    }

    const tokenEmail = normalizeEmail(req.auth?.payload?.email);
    const bodyEmail = normalizeEmail(req.body?.email);
    const normalizedEmail = tokenEmail || bodyEmail;

    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required to sync user.",
      });
    }

    const finalUsername = normalizeUsername(
      req.body?.username,
      normalizedEmail,
    );

    const existingByAuth0Id = await User.findOne({ auth0Id });
    const existingByEmail = await User.findOne({ email: normalizedEmail });

    if (existingByEmail && existingByEmail.auth0Id !== auth0Id) {
      return res.status(409).json({
        success: false,
        message: "Email is already linked to another account.",
      });
    }

    let user;
    if (existingByAuth0Id) {
      existingByAuth0Id.email = normalizedEmail;
      existingByAuth0Id.username = finalUsername;
      user = await existingByAuth0Id.save();
    } else {
      user = await User.create({
        email: normalizedEmail,
        username: finalUsername,
        auth0Id,
      });
    }

    return res.status(200).json({ success: true, user });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email or Username is already taken by another account.",
      });
    }
    console.error("syncUser error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


module.exports = { syncUser };
