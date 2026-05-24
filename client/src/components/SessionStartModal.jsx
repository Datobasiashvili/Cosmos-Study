import { useState, useEffect, useRef } from "react";
import { BookIcon } from "../icons/BookIcon";
import { XIcon } from "../icons/XIcon";
import { PlayIcon } from "../icons/PlayIcon";
import { useSessions } from "../hooks/useSessions";

export default function SessionStartModal({ course, isOpen, onClose, onStart }) {
  const [description, setDescription] = useState("");
  const inputRef = useRef(null);
  const { createSession } = useSessions();

  useEffect(() => {
    if (isOpen) {
      setDescription("");
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [isOpen]);
 
  if (!isOpen || !course) return null;
 
  const hex = course.color ?? "#7c3aed";
 
  const handleStart = async () => {
  const trimmed = description.trim();

  const session = await createSession(course._id, trimmed);

  if (!session) return;

  onStart({ course, description: trimmed, sessionId: session._id });
  onClose();
};
 
  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
 
      <div
        className="relative z-10 w-full sm:max-w-sm mx-0 sm:mx-4 rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(160deg, #0f0f1e 0%, #0a0a16 100%)",
          border: `1px solid ${hex}33`,
          boxShadow: `0 0 40px ${hex}18, 0 24px 64px rgba(0,0,0,0.7)`,
        }}
      >
        <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${hex}, transparent)` }} />
 
        <div className="px-5 pt-5 pb-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <span
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: hex + "22", boxShadow: `0 0 0 1px ${hex}44`, color: hex }}
              >
                <BookIcon size={15} />
              </span>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-slate-500">New Session</p>
                <p className="text-[13px] font-medium text-slate-200 leading-tight truncate max-w-[180px]">{course.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-150"
            >
              <XIcon />
            </button>
          </div>
 
          <label className="block mb-4">
            <span className="text-[10px] font-semibold tracking-[0.12em] uppercase text-slate-500 mb-1.5 block">
              What are you studying? <span className="text-slate-600 font-normal normal-case tracking-normal">(optional)</span>
            </span>
            <textarea
              ref={inputRef}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleStart())}
              placeholder="e.g. Chapter 4 review, past paper practice…"
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] ring-1 ring-white/[0.08] focus:ring-purple-500/40 focus:bg-white/[0.06] text-[13px] text-slate-200 placeholder-slate-600 resize-none outline-none transition-all duration-200"
            />
          </label>
 
          <button
            onClick={handleStart}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold text-white transition-all duration-200 active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${hex}cc, ${hex}88)`,
              boxShadow: `0 4px 24px ${hex}44`,
            }}
          >
            <PlayIcon />
            Start Session
          </button>
        </div>
      </div>
    </div>
  );
}