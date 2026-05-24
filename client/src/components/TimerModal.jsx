import { useState, useEffect, useRef } from "react";

// icons
import { BookIcon } from "../icons/BookIcon";
import { PlayIcon } from "../icons/PlayIcon";
import { PauseIcon } from "../icons/PauseIcon";
import { StopIcon } from "../icons/StopIcon";

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function TimerModal({ session, isOpen, onStop }) {
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setElapsed(0);
      setPaused(false);
      clearInterval(intervalRef.current);
      return;
    }

    if (paused) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setElapsed((s) => s + 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isOpen, paused]);

  if (!isOpen || !session) return null;

  const hex = session.course?.color ?? "#7c3aed";
  const progress = Math.min((elapsed % 3600) / 3600, 1);
  const r = 88;
  const circ = 2 * Math.PI * r;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 40% 35%, ${hex}28 0%, transparent 60%), radial-gradient(ellipse at 70% 75%, ${hex}14 0%, transparent 50%), #070711`,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "128px",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 480, height: 480,
          top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          background: `radial-gradient(circle, ${hex}1a 0%, transparent 70%)`,
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 px-6 w-full max-w-xs sm:max-w-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <span
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
            style={{ backgroundColor: hex + "22", boxShadow: `0 0 0 1px ${hex}44`, color: hex }}
          >
            <BookIcon size={18} />
          </span>
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-slate-500">Studying</p>
          <p className="text-[17px] font-semibold text-slate-100 leading-snug">{session.course?.title}</p>
          {session.description && (
            <p className="text-[12px] text-slate-400 mt-0.5 max-w-[220px] leading-relaxed">{session.description}</p>
          )}
        </div>

        <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
          <svg className="absolute" width="220" height="220" viewBox="0 0 220 220">
            <circle cx="110" cy="110" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
            <circle
              cx="110" cy="110" r={r}
              fill="none" stroke={hex} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - progress)}
              transform="rotate(-90 110 110)"
              style={{ filter: `drop-shadow(0 0 8px ${hex}99)`, transition: "stroke-dashoffset 0.9s linear" }}
            />
            <circle
              cx={110 + r * Math.cos(2 * Math.PI * progress - Math.PI / 2)}
              cy={110 + r * Math.sin(2 * Math.PI * progress - Math.PI / 2)}
              r="5" fill={hex}
              style={{ filter: `drop-shadow(0 0 6px ${hex})` }}
            />
          </svg>
          <div className="flex flex-col items-center">
            <span
              className="text-5xl font-mono font-semibold tracking-tight tabular-nums"
              style={{ color: "rgba(255,255,255,0.92)", textShadow: `0 0 24px ${hex}66` }}
            >
              {formatTime(elapsed)}
            </span>
            <span className="text-[11px] text-slate-600 font-mono mt-1 tracking-widest uppercase">
              {paused ? "paused" : "elapsed"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setPaused((p) => !p)}
            className="w-14 h-14 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.10] ring-1 ring-white/[0.10] text-slate-300 hover:text-white transition-all duration-200 active:scale-95"
          >
            {paused ? <PlayIcon /> : <PauseIcon />}
          </button>

          <button
            onClick={() => onStop(elapsed)}
            className="w-16 h-16 rounded-full flex items-center justify-center text-white transition-all duration-200 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${hex}cc, ${hex}77)`,
              boxShadow: `0 0 32px ${hex}55, 0 8px 24px rgba(0,0,0,0.5)`,
            }}
          >
            <StopIcon />
          </button>

          <button
            className="w-14 h-14 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.10] ring-1 ring-white/[0.10] text-slate-600 hover:text-slate-400 transition-all duration-200 active:scale-95"
            title="Notes (coming soon)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        </div>

        <p className="text-[10px] text-slate-700 font-mono tracking-widest uppercase">
          tap stop to save session
        </p>
      </div>
    </div>
  );
}