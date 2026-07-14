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
const asyncHandler = require("../middlewares/asyncHandlerMiddleware");

router.get("/", requireAuth, asyncHandler(getSessions));

router.post(
  "/",
  requireAuth,
  validateRequest(startSessionSchema),
  asyncHandler(startSession),
);

router.patch(
  "/:sessionId",
  requireAuth,
  validateRequest(completeSessionSchema),
  asyncHandler(completeSession),
);

router.delete("/:sessionId", requireAuth, asyncHandler(deleteSession));

module.exports = router;
