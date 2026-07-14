const express = require("express");
const router = express.Router();
const {
  addCourse,
  getCourses,
  getCosmosCourses,
  updateCourse,
  deleteCourse,
  archiveCourse,
  getArchivedCourses,
} = require("../controllers/courseControllers");
const validateRequest = require("../middlewares/validateRequest");
const {
  addCourseSchema,
  updateCourseSchema,
} = require("../middlewares/schemas/courseSchemas");
const { requireAuth } = require("../middlewares/auth");
const asyncHandler = require("../middlewares/asyncHandlerMiddleware");
const { generalLimiter } = require("../middlewares/rateLimiters");

router.use(requireAuth, generalLimiter);

router.get("/", asyncHandler(getCourses));
router.get("/archived", asyncHandler(getArchivedCourses));
router.get("/cosmos", asyncHandler(getCosmosCourses));

router.post("/", validateRequest(addCourseSchema), asyncHandler(addCourse));

router.patch(
  "/:courseId",
  validateRequest(updateCourseSchema),
  asyncHandler(updateCourse),
);

router.patch("/:courseId/archive", asyncHandler(archiveCourse));

router.delete("/:courseId", asyncHandler(deleteCourse));

module.exports = router;
