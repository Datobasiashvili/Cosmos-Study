const express = require("express");
const router = express.Router();
const { syncUser } = require("../controllers/authControllers");
const { requireAuth } = require("../middlewares/auth");

router.post('/sync', requireAuth, syncUser);

module.exports = router;