import { formatDuration } from "../../utils/time";
import { formatCompactDate, getCompletedSessions } from "./dashboardUtils";

export default function RecentSessions({ courses = [] }) {
  const sessions = getCompletedSessions(courses);

  return (
    <section className="hidden lg:flex flex-col relative w-full min-w-[260px] rounded-xl overflow-hidden bg-[#0d0d18]/80 backdrop-blur-md ring-1 ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
      <span className="absolute rounded-full bg-amber-400 opacity-40 pointer-events-none" style={{ width: 2, height: 2, top: 12, right: 18 }} />
      <span className="absolute rounded-full bg-amber-400 opacity-40 pointer-events-none" style={{ width: 2, height: 2, top: 40, right: 8 }} />
      <span className="absolute rounded-full bg-amber-400 opacity-40 pointer-events-none" style={{ width: 2, height: 2, bottom: 20, left: 14 }} />

      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06]">
        <div>
          <h2 className="text-[10px] font-semibold tracking-[0.15em] uppercase text-slate-400">Recent Landings</h2>
          {sessions.length > 0 && (
            <p className="text-[9px] text-slate-600 font-mono mt-0.5">{sessions.length} sessions</p>
          )}
        </div>
      </div>

      <div className="px-2 py-2 space-y-1 max-h-[244px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <p className="text-[12px] text-slate-500 leading-relaxed">
              No sessions yet.<br />
              <span className="text-amber-400/70">Start studying to see landings here.</span>
            </p>
          </div>
        ) : (
          sessions.map((session) => (
            <div key={session._id} className="flex items-start gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-3">
              <span
                className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: session.courseColor,
                  boxShadow: `0 0 10px ${session.courseColor}`,
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs font-medium text-slate-200">{session.courseTitle}</p>
                  <span className="shrink-0 font-mono text-[8px] text-slate-600">{formatCompactDate(session.startTime)}</span>
                </div>
                <p className={`mt-1 line-clamp-1 text-[11px] leading-4 ${session.description ? "text-slate-500" : "italic text-slate-700"}`}>
                  {session.description || "No description"}
                </p>
                <p className="font-mono text-[8px] text-slate-600 mt-1">
                  {formatDuration(session.duration)} / {session.xpEarned || 0} xp
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
    </section>
  );
}
