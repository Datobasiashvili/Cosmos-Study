import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { COURSE_COLOR_OPTIONS } from "../utils/courseColorOptions";

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
 
const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
 
const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z" opacity="0.9"/>
    <path d="M19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75L19 14z" opacity="0.6"/>
    <path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5L5 17z" opacity="0.5"/>
  </svg>
);
 

const Dot = ({ style }) => (
  <span
    className="absolute rounded-full bg-purple-400 opacity-30 pointer-events-none"
    style={{ width: 2, height: 2, ...style }}
  />
);

export default function AddCourseModal({ isOpen, onClose, onAdd }) {
  const [title, setTitle]           = useState("");
  const [selectedColor, setColor]   = useState(COURSE_COLOR_OPTIONS[0].id);
  const [visible, setVisible]       = useState(false); 
 
  useEffect(() => {
    if (isOpen) {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
    }
  }, [isOpen]);
 
  useEffect(() => {
    if (!isOpen) return;
    const handle = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [isOpen]);
 
  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setTitle("");
      setColor(COURSE_COLOR_OPTIONS[0].id);
      onClose();
    }, 220);
  }, [onClose]);
 
  const handleSubmit = useCallback(() => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const colorObj = COURSE_COLOR_OPTIONS.find((c) => c.id === selectedColor);
    onAdd({ title: trimmed, color: colorObj?.preview ?? COURSE_COLOR_OPTIONS[0].preview });
    handleClose();
  }, [title, selectedColor, onAdd, handleClose]);
 
  if (!isOpen) return null;
 
  return createPortal(
    <>
      <div
        onClick={handleClose}
        className="fixed inset-0 z-40"
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          background: "rgba(4, 4, 14, 0.65)",
          transition: "opacity 220ms ease",
          opacity: visible ? 1 : 0,
        }}
      />
 
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add new course"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
      >
        <div
          className="
            pointer-events-auto
            relative w-full max-w-[360px]
            rounded-2xl overflow-hidden
            bg-[#0d0d1c]
            ring-1 ring-white/[0.10]
            shadow-[0_24px_64px_rgba(0,0,0,0.7),0_0_0_1px_rgba(139,92,246,0.08)]
          "
          style={{
            transition: "opacity 220ms ease, transform 220ms cubic-bezier(0.34,1.56,0.64,1)",
            opacity:    visible ? 1 : 0,
            transform:  visible ? "scale(1) translateY(0)" : "scale(0.95) translateY(8px)",
          }}
        >
          <Dot style={{ top: 10, right: 16 }} />
          <Dot style={{ top: 34, right: 9 }} />
          <Dot style={{ bottom: 18, left: 12 }} />
 
          <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />
 
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="text-purple-400/80">
                <SparkleIcon />
              </span>
              <div>
                <h2 className="text-[13px] font-semibold text-slate-100 tracking-wide">
                  New Course
                </h2>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Add to your constellation
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="
                flex items-center justify-center w-6 h-6 rounded-md
                text-slate-500 hover:text-slate-200
                bg-white/[0.04] hover:bg-white/[0.08]
                ring-1 ring-white/[0.06] hover:ring-white/[0.12]
                transition-all duration-150
              "
            >
              <XIcon />
            </button>
          </div>
 
          <div className="px-5 py-4 space-y-5">
 
            <div className="space-y-1.5">
              <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-slate-500">
                Course Title
              </label>
              <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="e.g. Quantum Mechanics"
                maxLength={64}
                className="
                  w-full px-3 py-2.5 rounded-lg
                  bg-white/[0.04] hover:bg-white/[0.06] focus:bg-white/[0.06]
                  ring-1 ring-white/[0.08] focus:ring-purple-500/40
                  text-[13px] text-slate-100 placeholder:text-slate-600
                  outline-none
                  transition-all duration-150
                  font-mono caret-purple-400
                "
              />
              <p className="text-right text-[10px] text-slate-700 font-mono pr-0.5">
                {title.length}/64
              </p>
            </div>
 
            <div className="space-y-2">
              <label className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-slate-500">
                Color Scheme
              </label>
 
              <div className="grid grid-cols-8 gap-1.5">
                {COURSE_COLOR_OPTIONS.map((color) => {
                  const active = selectedColor === color.id;
                  return (
                    <button
                      key={color.id}
                      title={color.label}
                      onClick={() => setColor(color.id)}
                      className={`
                        relative flex items-center justify-center
                        w-8 h-8 rounded-lg
                        ring-1 transition-all duration-150
                        ${active
                          ? "ring-white/40 scale-110 shadow-lg"
                          : "ring-white/[0.06] hover:ring-white/20 hover:scale-105"
                        }
                      `}
                      style={{ backgroundColor: color.preview + "33" }}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: color.preview }}
                      />
                      {active && (
                        <span className="absolute inset-0 flex items-center justify-center text-white/90">
                          <CheckIcon />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
 
              <p className="text-[10px] text-slate-600 font-mono">
                Selected:{" "}
                <span className="text-slate-400">
                  {COURSE_COLOR_OPTIONS.find((c) => c.id === selectedColor)?.label}
                </span>
              </p>
            </div>
 
            {title.trim() && (() => {
              const color = COURSE_COLOR_OPTIONS.find((c) => c.id === selectedColor);
              return (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] ring-1 ring-white/[0.05]">
                  <span
                    className="flex-shrink-0 w-2 h-2 rounded-full"
                    style={{ backgroundColor: color.preview }}
                  />
                  <p className="text-[12px] text-slate-300 font-mono truncate">
                    {title.trim()}
                  </p>
                  <span className="ml-auto text-[10px] text-slate-600 flex-shrink-0">preview</span>
                </div>
              );
            })()}
          </div>
 
          <div className="flex items-center justify-end gap-2 px-5 pb-5">
            <button
              onClick={handleClose}
              className="
                px-3 py-1.5 rounded-lg
                text-[12px] text-slate-400 font-medium
                bg-white/[0.04] hover:bg-white/[0.07]
                ring-1 ring-white/[0.06] hover:ring-white/[0.10]
                transition-all duration-150
              "
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="
                px-4 py-1.5 rounded-lg
                text-[12px] text-white font-semibold
                bg-purple-600 hover:bg-purple-500
                disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-purple-600
                ring-1 ring-purple-400/20
                shadow-[0_0_12px_rgba(139,92,246,0.3)]
                hover:shadow-[0_0_20px_rgba(139,92,246,0.45)]
                transition-all duration-150
              "
            >
              Add Course
            </button>
          </div>
 
          <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        </div>
      </div>
    </>,
    document.body
  );
}