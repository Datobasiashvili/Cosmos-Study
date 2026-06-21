import { useState, useMemo } from "react";
import { CalendarDays } from "lucide-react";
import { getCompletedSessions } from "./dashboardUtils";

function dateKey(d) {
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

function getLevel(count) {
  if (!count || count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count <= 4) return 3;
  return 4;
}

const LEVEL_CLASSES = [
  "bg-white/[0.04]",
  "bg-violet-900/60",
  "bg-violet-700/70",
  "bg-violet-500/80",
  "bg-emerald-400/80",
];

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_LABELS = ["Mon","","Wed","","Fri","","Sun"];

export default function ActivityCalendar({ courses = [] }) {
  const [tooltip, setTooltip] = useState(null);

  const sessions = getCompletedSessions(courses);

  const sessionData = useMemo(() => {
    const map = {};
    sessions.forEach((s) => {
      const key = dateKey(new Date(s.completedAt ?? s.date ?? s.startTime));
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [sessions]);

  const { weeks, monthMarkers, totalSessions } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const startDate = new Date(oneYearAgo);
    const dow = startDate.getDay();
    const offset = dow === 0 ? 6 : dow - 1;
    startDate.setDate(startDate.getDate() - offset);

    const weeksArr = [];
    const markers = {};
    let cur = new Date(startDate);
    let lastMonth = -1;
    let total = 0;

    while (cur <= today) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        const day = new Date(cur);
        const key = dateKey(day);
        const count = sessionData[key] || 0;
        const inRange = day >= oneYearAgo && day <= today;
        if (inRange) total += count;

        if (d === 0) {
          const m = day.getMonth();
          if (m !== lastMonth && inRange) {
            markers[weeksArr.length] = MONTH_NAMES[m];
            lastMonth = m;
          }
        }
        week.push({ date: day, key, count, inRange });
        cur.setDate(cur.getDate() + 1);
      }
      weeksArr.push(week);
    }

    return { weeks: weeksArr, monthMarkers: markers, totalSessions: total };
  }, [sessionData]);

  const formatDate = (d) =>
    MONTH_NAMES[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();

  return (
    <section className="rounded-lg border border-white/[0.08] bg-[#080b14]/90 p-3">
      {/* Header */}
      <div className="mb-2 flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-emerald-200/70">
            <CalendarDays size={14} strokeWidth={1.7} />
            <h2 className="font-mono text-[10px] uppercase tracking-[0.18em]">
              Activity
            </h2>
          </div>
          <p className="font-mono text-[11px] text-slate-600">
            {totalSessions} session{totalSessions !== 1 ? "s" : ""} in the last year
          </p>
        </div>
      </div>

      {/* Calendar grid — horizontally scrollable on mobile */}
      <div className="w-full overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
        <div className="inline-flex gap-0 min-w-max">
          {/* Day-of-week labels */}
          <div className="flex flex-col gap-[3px] pr-[6px] pt-[14px]">
            {DAY_LABELS.map((label, i) => (
              <div
                key={i}
                className="h-[15px] w-[24px] text-right font-mono text-[8px] leading-[15px] text-slate-600"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Weeks */}
          <div className="flex flex-col gap-0">
            {/* Month labels row */}
            <div className="relative mb-[0px] h-[14px]">
              {weeks.map((_, wi) =>
                monthMarkers[wi] ? (
                  <span
                    key={wi}
                    className="absolute font-mono text-[9px] text-slate-600"
                    style={{ left: wi * 18 }}
                  >
                    {monthMarkers[wi]}
                  </span>
                ) : null
              )}
            </div>

            {/* Grid */}
            <div className="flex gap-[3px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day, di) => {
                    const level = day.inRange ? getLevel(day.count) : -1;
                    return (
                      <div
                        key={di}
                        className={[
                          "h-[15px] w-[15px] rounded-[2px] cursor-pointer transition-opacity duration-150",
                          level === -1
                            ? "bg-transparent cursor-default"
                            : LEVEL_CLASSES[level],
                        ].join(" ")}
                        onMouseEnter={() =>
                          day.inRange &&
                          setTooltip({
                            date: formatDate(day.date),
                            count: day.count,
                          })
                        }
                        onMouseLeave={() => setTooltip(null)}
                        onTouchStart={() =>
                          day.inRange &&
                          setTooltip({
                            date: formatDate(day.date),
                            count: day.count,
                          })
                        }
                        onTouchEnd={() =>
                          setTimeout(() => setTooltip(null), 1200)
                        }
                        aria-label={
                          day.inRange
                            ? `${formatDate(day.date)}: ${day.count} session${day.count !== 1 ? "s" : ""}`
                            : undefined
                        }
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip — always in DOM, fixed height, opacity-only transition to avoid layout shift */}
      <div className="mt-2 h-7 flex items-center justify-center">
        <div
          className="rounded-md border border-white/[0.08] bg-[#1a1630] px-3 py-1.5 font-mono text-[10px] text-slate-300 transition-opacity duration-100"
          style={{ opacity: tooltip ? 1 : 0, pointerEvents: "none" }}
        >
          {tooltip ? (
            <>
              {tooltip.date} ·{" "}
              <span className="text-emerald-400/90">
                {tooltip.count === 0
                  ? "No sessions"
                  : `${tooltip.count} session${tooltip.count !== 1 ? "s" : ""}`}
              </span>
            </>
          ) : (
            <span className="invisible">placeholder</span>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-end gap-[6px]">
        <span className="font-mono text-[9px] text-slate-600">Less</span>
        <div className="flex items-center gap-[3px]">
          {LEVEL_CLASSES.map((cls, i) => (
            <div key={i} className={`h-[15px] w-[15px] rounded-[2px] ${cls}`} />
          ))}
        </div>
        <span className="font-mono text-[9px] text-slate-600">More</span>
      </div>
    </section>
  );
}
