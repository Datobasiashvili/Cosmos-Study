const User = require("../models/User");
const getAuth0Id = require("../helper/getAuth0Id");

const addCourse = async (req, res) => {
  const { title, color } = req.body;
  const auth0Id = getAuth0Id(req);
  const user = await User.findOne({ auth0Id });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  user.courses.push({ title, color });
  const courseId = user.courses[user.courses.length - 1]._id;
  await user.save();

  const created = user.courses.id(courseId);
  return res.status(201).json({ success: true, course: created });
};

const getCourses = async (req, res) => {
  const auth0Id = getAuth0Id(req);
  const user = await User.findOne({ auth0Id })
    .select("-courses.sessions")
    .lean();

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const activeCourses = user.courses.filter((c) => !c.archived);
  return res.status(200).json({ success: true, courses: activeCourses });
};

const getArchivedCourses = async (req, res) => {
  const auth0Id = getAuth0Id(req);
  const user = await User.findOne({ auth0Id })
    .select("-courses.sessions")
    .lean();

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const archivedCourses = user.courses.filter((c) => c.archived == true);
  return res.status(200).json({ success: true, archivedCourses });
};

const getCosmosCourses = async (req, res) => {
  const auth0Id = getAuth0Id(req);
  const [result] = await User.aggregate([
    { $match: { auth0Id } },
    {
      $project: {
        _id: 0,
        courses: {
          $map: {
            input: {
              $filter: {
                input: "$courses",
                as: "course",
                cond: { $ne: ["$$course.archived", true] },
              },
            },
            as: "course",
            in: {
              _id: "$$course._id",
              title: "$$course.title",
              color: "$$course.color",
              archived: "$$course.archived",
              totalXp: "$$course.totalXp",
              sessions: {
                $map: {
                  input: {
                    $filter: {
                      input: "$$course.sessions",
                      as: "session",
                      cond: { $eq: ["$$session.completed", true] },
                    },
                  },
                  as: "session",
                  in: {
                    _id: "$$session._id",
                    description: "$$session.description",
                    startTime: "$$session.startTime",
                    endTime: "$$session.endTime",
                    duration: "$$session.duration",
                    completed: "$$session.completed",
                    xpEarned: "$$session.xpEarned",
                  },
                },
              },
            },
          },
        },
      },
    },
  ]);

  if (!result) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  return res.status(200).json({ success: true, courses: result.courses });
};

const updateCourse = async (req, res) => {
  const auth0Id = getAuth0Id(req);
  const user = await User.findOne({ auth0Id });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const course = user.courses.id(req.params.courseId);
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
};

const deleteCourse = async (req, res) => {
  const auth0Id = getAuth0Id(req);
  const user = await User.findOne({ auth0Id });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const course = user.courses.id(req.params.courseId);
  if (!course) {
    return res
      .status(404)
      .json({ success: false, message: "Course not found" });
  }

  course.remove();
  await user.save();
  return res.status(200).json({ success: true, message: "Course deleted" });
};

const archiveCourse = async (req, res) => {
  const auth0Id = getAuth0Id(req);

  const user = await User.findOne({ auth0Id });
  if (!user) return res.status(404).json({ message: "User not found" });

  const course = user.courses.id(req.params.courseId);
  if (!course) {
    return res
      .status(404)
      .json({ success: false, message: "Course not found" });
  }
  course.archived = true;
  await user.save();
  res.status(200).json({ success: true, message: "Course archived", course });
};

module.exports = {
  addCourse,
  getCourses,
  getCosmosCourses,
  updateCourse,
  deleteCourse,
  archiveCourse,
  getArchivedCourses,
};
