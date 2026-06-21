import { Target } from "lucide-react";
import { formatDuration } from "../../utils/time";
import { getCompletedSessions, getDashboardStats } from "./dashboardUtils";

export default function FocusBrief({ courses = [] }) {
  const stats = getDashboardStats(courses);
  const sessions = getCompletedSessions(courses);
  const latest = sessions[0];
  const averageMinutes = sessions.length
    ? Math.round(sessions.reduce((total, session) => total + (session.duration || 0), 0) / sessions.length)
    : 0;

  return (
    <section className="rounded-lg border border-white/[0.08] bg-[#080b14]/90 p-4">
      <div className="mb-4 flex items-center gap-2 text-rose-200/70">
        <Target size={14} strokeWidth={1.7} />
        <h2 className="font-mono text-[10px] uppercase tracking-[0.18em]">Focus brief</h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
        <div className="rounded-lg bg-white/[0.025] px-3 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-600">Average session</p>
          <p className="mt-2 text-lg font-semibold text-slate-100">{averageMinutes ? formatDuration(averageMinutes) : "--"}</p>
        </div>
        <div className="rounded-lg bg-white/[0.025] px-3 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-600">Longest run</p>
          <p className="mt-2 text-lg font-semibold text-slate-100">
            {stats.bestSession ? formatDuration(stats.bestSession.duration) : "--"}
          </p>
        </div>
        <div className="rounded-lg bg-white/[0.025] px-3 py-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-600">Latest course</p>
          <p className="mt-2 truncate text-lg font-semibold text-slate-100">{latest?.courseTitle || "--"}</p>
        </div>
      </div>
    </section>
  );
}
