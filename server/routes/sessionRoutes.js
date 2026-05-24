const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  startSession,
  completeSession,
  deleteSession,
  getSessions,
} = require("../controllers/sessionController");
const { requireAuth } = require("../middlewares/auth");
const validateRequest = require("../middlewares/validateRequest");
const {
  startSessionSchema,
  completeSessionSchema,
} = require("../middlewares/schemas/sessionSchemas");

router.get("/", requireAuth, getSessions);

router.post(
  "/",
  requireAuth,
  validateRequest(startSessionSchema),
  startSession,
);

router.patch(
  "/:sessionId",
  requireAuth,
  validateRequest(completeSessionSchema),
  completeSession,
);

router.delete("/:sessionId", requireAuth, deleteSession);

module.exports = router;
