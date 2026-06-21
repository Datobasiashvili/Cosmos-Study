export function getCompletedSessions(courses = []) {
  return courses
    .flatMap((course) =>
      (course.sessions || []).map((session) => ({
        ...session,
        courseId: course._id,
        courseTitle: course.title,
        courseColor: course.color || "#7c6fff",
      })),
    )
    .filter((session) => session.completed)
    .sort((a, b) => new Date(b.startTime || 0) - new Date(a.startTime || 0));
}

export function getDashboardStats(courses = []) {
  const sessions = getCompletedSessions(courses);
  const totalMinutes = sessions.reduce((total, session) => total + (session.duration || 0), 0);
  const totalXp = sessions.reduce((total, session) => total + (session.xpEarned || 0), 0);
  const activeCourseCount = courses.filter((course) => !course.archived).length;
  const bestSession = sessions.reduce(
    (best, session) => ((session.duration || 0) > (best?.duration || 0) ? session : best),
    null,
  );

  return {
    activeCourseCount,
    completedCount: sessions.length,
    totalHours: totalMinutes / 60,
    totalXp,
    bestSession,
  };
}

export function formatCompactDate(value) {
  if (!value) return "No date";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function getWeekActivity(sessions = []) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    const key = date.toISOString().slice(0, 10);
    const daySessions = sessions.filter((session) => {
      if (!session.startTime) return false;
      return new Date(session.startTime).toISOString().slice(0, 10) === key;
    });

    return {
      key,
      label: date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1),
      count: daySessions.length,
      minutes: daySessions.reduce((total, session) => total + (session.duration || 0), 0),
      xp: daySessions.reduce((total, session) => total + (session.xpEarned || 0), 0),
    };
  });
}
