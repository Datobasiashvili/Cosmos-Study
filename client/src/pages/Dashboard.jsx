import CourseList from "../components/CourseList";
import { useCosmosCourses } from "../hooks/useCosmosCourses";
import ActivityCalendar from "../components/dashboard/ActivityCalendar";
import RecentSessions from "../components/dashboard/RecentSessions";
import XpBar from "../components/dashboard/XpBar";

export default function Dashboard() {
  const { courses, fetchCosmosCourses } = useCosmosCourses();

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="space-y-4">
        <XpBar courses={courses} />
        
        <div className="hidden xl:flex xl:flex-col xl:gap-4">
          <div className="flex gap-4">
            <div className="min-w-0 flex-[2_1_0]">
              <CourseList onCoursesChange={fetchCosmosCourses} />
            </div>
            <div className="min-w-0 flex-[3_1_0]">
              <RecentSessions courses={courses} />
            </div>
          </div>
          <ActivityCalendar courses={courses} />
        </div>

        <div className="xl:hidden space-y-4">
          <CourseList onCoursesChange={fetchCosmosCourses} />
          <RecentSessions courses={courses} />
          <ActivityCalendar courses={courses} />
        </div>
      </div>
    </div>
  );
}
