const express = require("express");
const router = express.Router();
const {
  addCourse,
  getCourses,
  updateCourse,
  deleteCourse,
  archiveCourse
} = require("../controllers/courseControllers");
const validateRequest = require("../middlewares/validateRequest");
const {
  addCourseSchema,
  updateCourseSchema,
} = require("../middlewares/schemas/courseSchemas");
const { requireAuth } = require("../middlewares/auth");

router.get("/", requireAuth, getCourses);

router.post("/", requireAuth, validateRequest(addCourseSchema), addCourse);

router.patch(
  "/:courseId",
  requireAuth,
  validateRequest(updateCourseSchema),
  updateCourse,
);

router.patch(
  "/:courseId/archive",
  requireAuth,
  archiveCourse,
)

router.delete("/:courseId", requireAuth, deleteCourse);

module.exports = router;
