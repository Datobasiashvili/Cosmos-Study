const express = require("express");
const router = express.Router();
const { syncUser } = require("../controllers/authControllers");
const { requireAuth } = require("../middlewares/auth");
const { authSensitiveLimiter } = require("../middlewares/rateLimiters");

router.use(requireAuth, authSensitiveLimiter);
router.post('/sync', syncUser);


module.exports = router;