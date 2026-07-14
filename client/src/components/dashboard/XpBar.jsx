import { getCompletedSessions } from "./dashboardUtils";

const WEEKLY_XP_GOAL = 500;

function startOfWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const offset = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - offset);
  return d;
}

function dateKey(date) {
  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0")
  );
}

export default function XpBar({ courses = [] }) {
  const sessions = getCompletedSessions(courses);
  const totalXp = sessions.reduce((total, session) => total + (session.xpEarned || 0), 0);
  const weekStart = startOfWeek(new Date());
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return date;
  });
  const dailyXp = days.map((day) => {
    const key = dateKey(day);
    return sessions
      .filter((session) => dateKey(new Date(session.completedAt ?? session.date ?? session.startTime)) === key)
      .reduce((total, session) => total + (session.xpEarned || 0), 0);
  });
  const weeklyXp = dailyXp.reduce((total, xp) => total + xp, 0);
  const progress = Math.min(100, Math.round((weeklyXp / WEEKLY_XP_GOAL) * 100));
  const maxDayXp = Math.max(...dailyXp, 1);

  return (
    <section className="rounded-lg border border-white/[0.08] bg-[#080b14]/90 px-4 py-3">
      <div className="mb-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber-200/80">XP Orbit</h2>
            <p className="mt-0.5 font-mono text-[10px] text-slate-600">{totalXp} total xp</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-[11px] font-semibold text-slate-200">{weeklyXp} / {WEEKLY_XP_GOAL} xp</p>
          <p className="font-mono text-[9px] text-slate-600">this week</p>
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-emerald-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {days.map((day, index) => {
          const height = 8 + (dailyXp[index] / maxDayXp) * 24;

          return (
            <div key={dateKey(day)} className="flex min-w-0 flex-col items-center gap-1">
              <div className="flex h-8 w-full items-end justify-center rounded bg-white/[0.025] px-1">
                <span
                  className="w-full max-w-5 rounded-sm bg-amber-300/70"
                  style={{
                    height,
                    opacity: dailyXp[index] > 0 ? 0.95 : 0.18,
                  }}
                  title={`${dailyXp[index]} xp`}
                />
              </div>
              <span className="font-mono text-[8px] uppercase text-slate-600">
                {day.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1)}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
