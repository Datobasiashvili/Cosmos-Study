import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useCourse } from "../hooks/useCourses";
import { formatDuration } from "../utils/time";

const MIN_PLANET_R = 4;
const MAX_PLANET_R = 16;
const SUN_RADIUS = 22;
const ORBIT_BASE = 52;
const ORBIT_GAP = 28;
const MAX_DURATION_MINUTES = 600;
const MIN_SCALE = 0.65;
const MAX_SCALE = 2.25;
const MAX_ORBIT_LANES = 14;

function completedSessions(course) {
  return (course.sessions || [])
    .filter((session) => session.completed)
    .sort((a, b) => new Date(a.startTime || 0) - new Date(b.startTime || 0));
}

function planetRadius(duration) {
  const minutes = Math.min(Math.max(duration || 1, 1), MAX_DURATION_MINUTES);
  const t = Math.sqrt(minutes / MAX_DURATION_MINUTES);
  return MIN_PLANET_R + t * (MAX_PLANET_R - MIN_PLANET_R);
}

function orbitLaneCount(sessionCount) {
  if (sessionCount === 0) return 0;
  return Math.min(MAX_ORBIT_LANES, Math.max(1, Math.ceil(Math.sqrt(sessionCount))));
}

function orbitGap(sessionCount) {
  if (sessionCount > 144) return 18;
  if (sessionCount > 49) return 22;
  return ORBIT_GAP;
}

function orbitSpeed(lane, sessionId = "") {
  const direction = hash(sessionId) % 2 === 0 ? 1 : -1;
  return direction * Math.max(0.000035, 0.00016 - lane * 0.000007);
}

function hash(seed = "") {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) & 0xffffffff;
  }
  return h >>> 0;
}

function startAngle(id = "") {
  return (hash(id) / 0xffffffff) * Math.PI * 2;
}

function seededJitter(seed) {
  return (((hash(seed) & 0xff) / 255) - 0.5) * 2;
}

function systemRadius(sessionCount) {
  if (sessionCount === 0) return SUN_RADIUS + 54;
  const lanes = orbitLaneCount(sessionCount);
  return SUN_RADIUS + ORBIT_BASE + (lanes - 1) * orbitGap(sessionCount) + MAX_PLANET_R + 58;
}

function sessionOrbit(sessionCount, index) {
  const lanes = orbitLaneCount(sessionCount);
  if (!lanes) return { lane: 0, radius: SUN_RADIUS + ORBIT_BASE };

  const lane = index % lanes;
  return {
    lane,
    radius: SUN_RADIUS + ORBIT_BASE + lane * orbitGap(sessionCount),
  };
}

function sessionTone(session) {
  if ((session.duration || 0) >= 120) return "#f8fafc";
  if ((session.xpEarned || 0) >= 100) return "#fde68a";
  return "#bfdbfe";
}

function systemStats(courses) {
  const planets = courses.reduce((total, course) => total + completedSessions(course).length, 0);
  const minutes = courses.reduce(
    (total, course) =>
      total + completedSessions(course).reduce((sum, session) => sum + (session.duration || 0), 0),
    0,
  );

  return { planets, hours: minutes / 60 };
}
function formatDate(iso) {
  return iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "-";
}

function StarField({ width, height }) {
  const stars = useMemo(() => {
    if (!width || !height) return [];

    let s = 0xc0ffee42;
    const rand = () => {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      return (s >>> 0) / 0xffffffff;
    };

    return Array.from({ length: Math.floor((width * height) / 3600) }, () => ({
      x: rand() * width,
      y: rand() * height,
      r: rand() < 0.82 ? 0.55 : rand() < 0.7 ? 1.05 : 1.6,
      o: 0.08 + rand() * 0.38,
    }));
  }, [width, height]);

  return (
    <g>
      {stars.map((star, i) => (
        <circle key={i} cx={star.x} cy={star.y} r={star.r} fill="white" opacity={star.o} />
      ))}
    </g>
  );
}

function OrbitingPlanet({
  cx,
  cy,
  orbitR,
  planetR,
  color,
  speed,
  initialAngle,
  session,
  course,
  onSelect,
  isSelected,
  time,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const angle = (initialAngle + speed * time) % (Math.PI * 2);
  const pos = {
    x: cx + Math.cos(angle) * orbitR,
    y: cy + Math.sin(angle) * orbitR,
  };
  const duration = formatDuration(session.duration);
  const accent = sessionTone(session);
  const hasMajorEffort = (session.duration || 0) >= 90 || (session.xpEarned || 0) >= 150;
  const label = `${duration || "session"} / ${formatDate(session.startTime)}`;

  return (
    <g
      onClick={(e) => {
        e.stopPropagation();
        onSelect(session, course);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ cursor: "pointer" }}
    >
      <title>{`${course.title}: ${label}${session.description ? ` - ${session.description}` : ""}`}</title>
      <circle cx={pos.x} cy={pos.y} r={planetR + 8} fill={color} opacity={isSelected || isHovered ? 0.26 : 0.08} />
      {hasMajorEffort && (
        <circle
          cx={pos.x}
          cy={pos.y}
          r={planetR + 3.5}
          fill="none"
          stroke={accent}
          strokeWidth="0.8"
          opacity={isSelected || isHovered ? 0.82 : 0.46}
        />
      )}
      <circle
        cx={pos.x}
        cy={pos.y}
        r={planetR}
        fill={color}
        opacity={isSelected ? 1 : 0.88}
        style={{
          filter: `drop-shadow(0 0 ${isSelected || isHovered ? 10 : 4}px ${color})`,
          transition: "opacity 0.2s, filter 0.2s",
        }}
      />
      <circle cx={pos.x - planetR * 0.32} cy={pos.y - planetR * 0.34} r={planetR * 0.26} fill="white" opacity="0.24" />
      {(session.xpEarned || 0) > 0 && (
        <circle cx={pos.x + planetR * 0.58} cy={pos.y - planetR * 0.58} r={Math.max(1.3, planetR * 0.18)} fill={accent} opacity="0.82" />
      )}
      {(isHovered || isSelected) && (
        <g transform={`translate(${pos.x + planetR + 8},${pos.y - planetR - 8})`} pointerEvents="none">
          <rect x="0" y="-16" width={Math.max(68, label.length * 5.4)} height="22" rx="5" fill="#020617" opacity="0.88" stroke={color} strokeOpacity="0.32" />
          <text x="7" y="-2" fill="white" opacity="0.82" fontSize="8" fontFamily="ui-monospace, monospace">
            {label}
          </text>
        </g>
      )}
    </g>
  );
}

function SolarSystem({ course, cx, cy, onSelect, selectedSessionId, time }) {
  const hex = course.color || "#7c6fff";
  const sessions = completedSessions(course);
  const lanes = orbitLaneCount(sessions.length);
  const outerOrbit = sessions.length > 0 ? SUN_RADIUS + ORBIT_BASE + (lanes - 1) * orbitGap(sessions.length) : 0;
  const labelY = cy + (outerOrbit || SUN_RADIUS) + MAX_PLANET_R + 30;
  const totalMinutes = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
  const title = course.title.length > 20 ? `${course.title.slice(0, 19)}...` : course.title;

  return (
    <g>
      <circle cx={cx} cy={cy} r={systemRadius(sessions.length)} fill={hex} opacity="0.026" />

      {Array.from({ length: lanes }, (_, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={SUN_RADIUS + ORBIT_BASE + i * orbitGap(sessions.length)}
          fill="none"
          stroke={hex}
          strokeWidth="0.8"
          opacity="0.22"
          strokeDasharray="2 9"
        />
      ))}

      <circle cx={cx} cy={cy} r={SUN_RADIUS + 18} fill={hex} opacity="0.06" />
      <circle cx={cx} cy={cy} r={SUN_RADIUS + 9} fill={hex} opacity="0.11" />
      <circle
        cx={cx}
        cy={cy}
        r={SUN_RADIUS}
        fill={hex}
        opacity="0.95"
        style={{ filter: `drop-shadow(0 0 15px ${hex}bb)` }}
      />
      <circle cx={cx - 8} cy={cy - 8} r="8" fill="white" opacity="0.18" />
      <circle cx={cx + 7} cy={cy + 8} r="4" fill="black" opacity="0.08" />

      {sessions.map((session, i) => {
        const orbit = sessionOrbit(sessions.length, i);

        return (
          <OrbitingPlanet
            key={session._id}
            cx={cx}
            cy={cy}
            orbitR={orbit.radius}
            planetR={planetRadius(session.duration)}
            color={hex}
            speed={orbitSpeed(orbit.lane, session._id)}
            initialAngle={startAngle(`${course._id}-${session._id}-${i}`)}
            session={session}
            course={course}
            onSelect={onSelect}
            isSelected={selectedSessionId === session._id}
            time={time}
          />
        );
      })}

      <text
        x={cx}
        y={labelY}
        textAnchor="middle"
        fill="white"
        opacity="0.72"
        fontSize="10"
        fontFamily="ui-monospace, monospace"
        letterSpacing="0.08em"
        style={{ userSelect: "none" }}
      >
        {title}
      </text>

      <text
        x={cx}
        y={labelY + 14}
        textAnchor="middle"
        fill={sessions.length ? hex : "white"}
        opacity={sessions.length ? "0.68" : "0.3"}
        fontSize="8"
        fontFamily="ui-monospace, monospace"
        style={{ userSelect: "none" }}
      >
        {sessions.length
          ? `${sessions.length} planet${sessions.length === 1 ? "" : "s"} / ${Math.round(totalMinutes)}m`
          : "no completed sessions"}
      </text>
    </g>
  );
}

function SessionCard({ session, course, onClose }) {
  const hex = course?.color || "#7c6fff";
  const duration = formatDuration(session.duration);

  return (
    <div
      className="fixed bottom-20 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm md:bottom-6 pointer-events-auto"
      style={{
        transform: "translateX(-50%)",
        animation: "cardUp 0.22s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <div
        className="relative overflow-hidden rounded-lg"
        style={{
          background: "linear-gradient(155deg,#101225 0%,#070811 100%)",
          border: `1px solid ${hex}38`,
          boxShadow: `0 0 52px ${hex}18, 0 20px 60px rgba(0,0,0,0.85)`,
        }}
      >
        <div className="h-[2px]" style={{ background: `linear-gradient(90deg,transparent,${hex}cc,transparent)` }} />
        <div className="px-4 py-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-2">
                <span className="h-2 w-2 flex-shrink-0 rounded-full" style={{ backgroundColor: hex, boxShadow: `0 0 7px ${hex}` }} />
                <span className="truncate font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                  {course?.title}
                </span>
              </div>
              <p className="font-mono text-[11px] text-slate-600">{formatDate(session.startTime)}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-white/[0.05] hover:text-slate-300"
              aria-label="Close session details"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <p className={`mb-3 font-mono text-[13px] leading-relaxed ${session.description ? "text-slate-200" : "text-slate-600 italic"}`}>
            {session.description || "No description"}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {duration && (
              <span className="rounded-md px-2 py-1 font-mono text-[10px]" style={{ backgroundColor: `${hex}18`, color: `${hex}dd` }}>
                {duration}
              </span>
            )}
            {session.xpEarned > 0 && (
              <span
                className="flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[10px] font-semibold"
                style={{ backgroundColor: `${hex}20`, color: hex, border: `1px solid ${hex}40` }}
              >
                <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                {session.xpEarned} xp
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-indigo-400/10 animate-pulse" style={{ animationDuration: "2.4s" }} />
        <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-cyan-200/30">
          <circle cx="12" cy="12" r="10" />
          <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)" />
          <circle cx="12" cy="12" r="2" fill="currentColor" />
        </svg>
      </div>
      <div className="space-y-1.5">
        <p className="font-mono text-[13px] text-slate-500">Your cosmos is empty</p>
        <p className="font-mono text-[11px] leading-relaxed text-slate-700">
          Complete study sessions to see
          <br />
          planets form around your suns
        </p>
      </div>
    </div>
  );
}

function LoadingPulse() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full bg-cyan-400/10 animate-ping" style={{ animationDuration: "1.8s" }} />
        <div className="absolute inset-3 rounded-full bg-indigo-400/20 animate-pulse" />
        <div className="absolute inset-6 rounded-full bg-white/35" />
      </div>
    </div>
  );
}

function computeGrid(courses, w, h) {
  if (!w || !h || !courses.length) return [];

  const safeW = Math.max(320, w - 56);
  const safeH = Math.max(320, h - 96);
  const sizes = courses.map((course) => systemRadius(completedSessions(course).length));
  const maxDiameter = Math.max(...sizes) * 2;
  const minCell = Math.max(210, Math.min(460, maxDiameter));
  const cols = Math.max(1, Math.min(courses.length, Math.floor(safeW / minCell) || 1));
  const rows = Math.ceil(courses.length / cols);
  const cellW = Math.max(minCell, safeW / cols);
  const cellH = Math.max(minCell, safeH / rows);
  const worldW = cellW * cols;
  const worldH = cellH * rows;
  const offsetX = (w - worldW) / 2;
  const offsetY = Math.max(74, (h - worldH) / 2);

  return courses.map((course, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const rowShift = rows > 1 ? (row % 2 === 0 ? -0.08 : 0.08) * cellW : 0;
    const colLift = (col % 2 === 0 ? -0.14 : 0.14) * cellH;
    const wave = Math.sin((i + 1) * 1.7) * cellH * 0.08;
    const jx = seededJitter(`jx${course._id}`) * Math.min(72, cellW * 0.18);
    const jy = seededJitter(`jy${course._id}`) * Math.min(86, cellH * 0.22);

    return {
      cx: offsetX + cellW * (col + 0.5) + rowShift + jx,
      cy: offsetY + cellH * (row + 0.5) + colLift + wave + jy,
    };
  });
}

export default function Cosmos() {
  const { courses, isLoading } = useCourse();
  const [selected, setSelected] = useState({ session: null, course: null });
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const [time, setTime] = useState(0);
  const transform = useRef({ x: 0, y: 0, scale: 1 });
  const [tx, setTx] = useState({ x: 0, y: 0, scale: 1 });
  const drag = useRef({ active: false, startX: 0, startY: 0, originX: 0, originY: 0 });
  const pinch = useRef({ active: false, dist: 0, midX: 0, midY: 0, originScale: 1, originX: 0, originY: 0 });

  const activeCourses = useMemo(() => (courses || []).filter((course) => !course.archived), [courses]);
  const positions = useMemo(() => computeGrid(activeCourses, vp.w, vp.h), [activeCourses, vp.w, vp.h]);
  const stats = useMemo(() => systemStats(activeCourses), [activeCourses]);

  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setVp({ w: rect.width, h: rect.height });
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, []);

  useEffect(() => {
    let rafId;
    let lastUpdate = 0;

    const tick = (ts) => {
      if (ts - lastUpdate > 32) {
        lastUpdate = ts;
        setTime(ts);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const onPointerDown = useCallback((e) => {
    if (e.isPrimary === false) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: transform.current.x,
      originY: transform.current.y,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!drag.current.active) return;
    transform.current.x = drag.current.originX + (e.clientX - drag.current.startX);
    transform.current.y = drag.current.originY + (e.clientY - drag.current.startY);
    setTx({ ...transform.current });
  }, []);

  const onPointerUp = useCallback(() => {
    drag.current.active = false;
  }, []);

  const onWheel = useCallback((e) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const factor = e.deltaY < 0 ? 1.08 : 0.93;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, transform.current.scale * factor));
    const scaleDelta = newScale / transform.current.scale;

    transform.current.x = mouseX - scaleDelta * (mouseX - transform.current.x);
    transform.current.y = mouseY - scaleDelta * (mouseY - transform.current.y);
    transform.current.scale = newScale;
    setTx({ ...transform.current });
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  const getTouchDist = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  };

  const onTouchStart = useCallback((e) => {
    if (e.touches.length !== 2) return;

    drag.current.active = false;
    const dist = getTouchDist(e.touches);
    const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
    const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
    const rect = svgRef.current?.getBoundingClientRect();

    pinch.current = {
      active: true,
      dist,
      midX: midX - (rect?.left || 0),
      midY: midY - (rect?.top || 0),
      originScale: transform.current.scale,
      originX: transform.current.x,
      originY: transform.current.y,
    };
  }, []);

  const onTouchMove = useCallback((e) => {
    if (!pinch.current.active || e.touches.length !== 2) return;
    e.preventDefault();

    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, pinch.current.originScale * (getTouchDist(e.touches) / pinch.current.dist)));
    const scaleDelta = newScale / pinch.current.originScale;
    const { midX, midY } = pinch.current;

    transform.current.x = midX - scaleDelta * (midX - pinch.current.originX);
    transform.current.y = midY - scaleDelta * (midY - pinch.current.originY);
    transform.current.scale = newScale;
    setTx({ ...transform.current });
  }, []);

  const onTouchEnd = useCallback(() => {
    pinch.current.active = false;
  }, []);

  const resetView = () => {
    transform.current = { x: 0, y: 0, scale: 1 };
    setTx({ x: 0, y: 0, scale: 1 });
  };

  const zoomBy = (factor) => {
    const cx = vp.w / 2;
    const cy = vp.h / 2;
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, transform.current.scale * factor));
    const scaleDelta = newScale / transform.current.scale;

    transform.current.x = cx - scaleDelta * (cx - transform.current.x);
    transform.current.y = cy - scaleDelta * (cy - transform.current.y);
    transform.current.scale = newScale;
    setTx({ ...transform.current });
  };

  const handleSelect = useCallback((session, course) => {
    setSelected((prev) =>
      prev.session?._id === session._id ? { session: null, course: null } : { session, course },
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative -mx-4 -mt-6 overflow-hidden overscroll-none bg-[#030511] select-none sm:-mx-6 sm:-mt-8 lg:-mx-8 lg:-mt-8"
      style={{ height: "100dvh" }}
    >
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 flex items-start justify-between gap-4 px-4 pt-4">
        <div>
          <h1 className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Cosmos</h1>
          {!isLoading && (
            <p className="mt-1 font-mono text-[9px] text-slate-700">
              {activeCourses.length} sun{activeCourses.length === 1 ? "" : "s"} / {stats.planets} planet{stats.planets === 1 ? "" : "s"}
            </p>
          )}
        </div>
        {!isLoading && activeCourses.length > 0 && (
          <div className="text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-700">study mass</p>
            <p className="font-mono text-[10px] text-slate-500">{stats.hours.toFixed(1)}h logged</p>
          </div>
        )}
      </div>

      {!isLoading && activeCourses.length > 0 && (
        <div className="pointer-events-auto absolute right-3 top-14 z-20 flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => zoomBy(1.18)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] font-mono text-sm text-slate-500 ring-1 ring-white/[0.08] transition-all duration-150 hover:bg-white/[0.08] hover:text-slate-300"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => zoomBy(0.85)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] font-mono text-sm text-slate-500 ring-1 ring-white/[0.08] transition-all duration-150 hover:bg-white/[0.08] hover:text-slate-300"
            aria-label="Zoom out"
          >
            -
          </button>
          <button
            type="button"
            onClick={resetView}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] text-slate-600 ring-1 ring-white/[0.08] transition-all duration-150 hover:bg-white/[0.08] hover:text-slate-400"
            aria-label="Reset view"
            title="Reset view"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>
      )}

      {isLoading ? (
        <LoadingPulse />
      ) : activeCourses.length === 0 ? (
        <EmptyState />
      ) : (
        <svg
          ref={svgRef}
          className="absolute inset-0 h-full w-full touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={() => setSelected({ session: null, course: null })}
        >
          <rect width="100%" height="100%" fill="#020617" />
          {vp.w > 0 && <StarField width={vp.w} height={vp.h} />}

          <g transform={`translate(${tx.x},${tx.y}) scale(${tx.scale})`}>
            {activeCourses.map((course, i) => (
              <SolarSystem
                key={course._id}
                course={course}
                cx={positions[i]?.cx || vp.w / 2}
                cy={positions[i]?.cy || vp.h / 2}
                onSelect={handleSelect}
                selectedSessionId={selected.session?._id}
                time={time}
              />
            ))}
          </g>
        </svg>
      )}

      {selected.session && (
        <SessionCard
          session={selected.session}
          course={selected.course}
          onClose={() => setSelected({ session: null, course: null })}
        />
      )}

      {!isLoading && activeCourses.length > 0 && !selected.session && (
        <div className="pointer-events-none absolute bottom-20 right-3 z-20 flex flex-col items-end gap-1 lg:bottom-5">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-white/14" />
            <span className="font-mono text-[8px] text-slate-700">short session</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-4 w-4 rounded-full bg-white/14" />
            <span className="font-mono text-[8px] text-slate-700">long session</span>
          </div>
          <span className="mt-0.5 font-mono text-[8px] text-slate-800">pinch / scroll to zoom / drag to pan</span>
        </div>
      )}

      <style>{`
        @keyframes cardUp {
          from { opacity: 0; transform: translateX(-50%) translateY(14px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}
