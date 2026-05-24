const User = require("../models/User");

const addCourse = async (req, res) => {
  try {
    const { title, color } = req.body;
    const auth0Id = req.auth?.payload?.sub ?? req.auth?.sub ?? req.user?.sub;
    const user = await User.findOne({ auth0Id });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const newCourse = { title, color };
    user.courses.push(newCourse);
    await user.save();

    const created = user.courses[user.courses.length - 1];
    return res.status(201).json({ success: true, course: created });
  } catch (err) {
    console.error("addCourse error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getCourses = async (req, res) => {
  try {
    const auth0Id = req.auth?.payload?.sub ?? req.auth?.sub ?? req.user?.sub;
    const user = await User.findOne({ auth0Id }).select("courses");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const activeCourses = user.courses.filter((c) => !c.archived);
    return res.status(200).json({ success: true, courses: activeCourses });
  } catch (err) {
    console.error("getCourses error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const auth0Id = req.auth?.payload?.sub ?? req.auth?.sub ?? req.user?.sub;
    const user = await User.findOne({ auth0Id });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const course = user.courses.id(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const fields = ["title", "description", "color", "icon", "archived"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) course[f] = req.body[f];
    });

    await user.save();
    return res.status(200).json({ success: true, course });
  } catch (err) {
    console.error("updateCourse error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const auth0Id = req.auth?.payload?.sub ?? req.auth?.sub ?? req.user?.sub;
    const user = await User.findOne({ auth0Id });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const course = user.courses.id(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    course.remove();
    await user.save();
    return res.status(200).json({ success: true, message: "Course deleted" });
  } catch (err) {
    console.error("deleteCourse error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const archiveCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const auth0Id = req.auth?.payload?.sub ?? req.auth?.sub ?? req.user?.sub;

    const user = await User.findOne({ auth0Id });
    if (!user) return res.status(404).json({ message: "User not found" });

    const course = user.courses.id(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }
    course.archived = true;
    await user.save();
    res.status(200).json({ success: true, message: "Course archived", course });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  addCourse,
  getCourses,
  updateCourse,
  deleteCourse,
  archiveCourse,
};
