const User = require("../models/User");

const syncUser = async (req, res) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const { email, username } = req.body;

    const normalizedEmail = email.toLowerCase().trim();
    const finalUsername = username || normalizedEmail.split("@")[0];

    const user = await User.findOneAndUpdate(
      { email: normalizedEmail },
      {
        $set: {
          email: normalizedEmail,
          username: finalUsername,
          auth0Id,
        },
      },
      {
        upsert: true,
        returnDocument: 'after',
        runValidators: true,
      },
    );

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
