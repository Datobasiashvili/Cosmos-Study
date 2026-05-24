import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import SessionRow from "./SessionRow";

// utils
import { formatDuration } from "../utils/time";

// icons
import { XIcon } from "../icons/XIcon";
import { ClockIcon } from "../icons/ClockIcon";
import { BookIcon } from "../icons/BookIcon";
import { ArchiveIcon } from "../icons/ArchiveIcon";

const Dot = ({ style }) => (
  <span
    className="absolute rounded-full bg-purple-400 opacity-30 pointer-events-none"
    style={{ width: 2, height: 2, ...style }}
  />
);


export default function SessionsModal({
  course,
  isOpen,
  onClose,
  onArchiveCourse,
  onDeleteSession,
  sessions = [],
  onFetchSessions
}) {
  const [visible, setVisible] = useState(false);
  const [deletingIds, setDeletingIds] = useState(new Set());
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [archiving, setArchiving] = useState(false);

  useEffect(() => {
    if (isOpen && course) onFetchSessions(course._id);
  }, [isOpen, course?._id]);

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
    setShowArchiveConfirm(false);
    setTimeout(() => onClose(), 220);
  }, [onClose]);

  const handleDeleteSession = useCallback(async (sessionId) => {
    setDeletingIds((prev) => new Set(prev).add(sessionId));
    try {
      await onDeleteSession(course._id, sessionId);
    } catch (err) {
      console.error("Failed to delete session:", err);
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(sessionId);
        return next;
      });
    }
  }, [course, onDeleteSession]);

  const handleArchive = useCallback(async () => {
    setArchiving(true);
    try {
      await onArchiveCourse(course._id);
      handleClose();
    } catch (err) {
      console.error("Failed to archive course:", err);
      setArchiving(false);
    }
  }, [course, onArchiveCourse, handleClose]);

  if (!isOpen || !course) return null;

  const courseColor = course.color || "#7c6fff";
  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((s) => s.completed).length;
  const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);

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
        aria-label={`Sessions for ${course.title}`}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none"
      >
        <div
          className="
            pointer-events-auto
            relative w-full sm:max-w-[420px]
            rounded-t-2xl sm:rounded-2xl overflow-hidden
            bg-[#0d0d1c]
            ring-1 ring-white/[0.10]
            shadow-[0_24px_64px_rgba(0,0,0,0.7),0_0_0_1px_rgba(139,92,246,0.08)]
            flex flex-col
            max-h-[92dvh] sm:max-h-[85vh]
          "
          style={{
            transition: "opacity 220ms ease, transform 220ms cubic-bezier(0.34,1.56,0.64,1)",
            opacity: visible ? 1 : 0,
            transform: visible
              ? "scale(1) translateY(0)"
              : "scale(0.97) translateY(12px)",
          }}
        >
          <Dot style={{ top: 10, right: 16 }} />
          <Dot style={{ top: 34, right: 9 }} />
          <Dot style={{ bottom: 18, left: 12 }} />

          <div
            className="absolute top-0 left-1/4 right-1/4 h-px"
            style={{
              background: `linear-gradient(to right, transparent, ${courseColor}66, transparent)`,
            }}
          />

          <div className="flex justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
            <div className="w-8 h-1 rounded-full bg-white/10" />
          </div>

          <div className="flex items-start justify-between px-5 pt-4 sm:pt-5 pb-4 border-b border-white/[0.06] flex-shrink-0">
            <div className="flex items-start gap-3 min-w-0">
              <div
                className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center ring-1"
                style={{
                  backgroundColor: courseColor + "22",
                  borderColor: courseColor + "44",
                  color: courseColor,
                }}
              >
                <BookIcon />
              </div>

              <div className="min-w-0">
                <h2 className="text-[14px] font-semibold text-slate-100 tracking-wide truncate">
                  {course.title}
                </h2>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {totalSessions} session{totalSessions !== 1 ? "s" : ""}
                  {totalSessions > 0 && ` · ${completedSessions} completed`}
                  {totalMinutes > 0 && ` · ${formatDuration(totalMinutes)}`}
                </p>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="
                flex-shrink-0 ml-2
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

          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-2.5 min-h-0">
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 ring-1"
                  style={{
                    backgroundColor: courseColor + "15",
                    borderColor: courseColor + "30",
                    color: courseColor + "80",
                  }}
                >
                  <ClockIcon />
                </div>
                <p className="text-[12px] text-slate-600 font-mono">No sessions yet</p>
                <p className="text-[10px] text-slate-700 font-mono mt-1">
                  Start a pomodoro to log your first session
                </p>
              </div>
            ) : (
              sessions.map((session, i) => (
                <SessionRow
                  key={session._id}
                  session={session}
                  courseColor={courseColor}
                  onDelete={handleDeleteSession}
                  isDeleting={deletingIds.has(session._id)}
                  index={i}
                />
              ))
            )}
          </div>

          {showArchiveConfirm && (
            <div className="mx-5 mb-3 px-4 py-3 rounded-xl bg-red-500/[0.07] ring-1 ring-red-500/20 flex-shrink-0">
              <p className="text-[11px] text-red-400 font-mono font-semibold mb-1">
                Archive this course?
              </p>
              <p className="text-[10px] text-slate-500 font-mono mb-3">
                The course and all its sessions will be archived. You can restore them later.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleArchive}
                  disabled={archiving}
                  className="
                    px-3 py-1.5 rounded-lg
                    text-[11px] font-semibold font-mono text-red-400
                    bg-red-500/15 hover:bg-red-500/25
                    ring-1 ring-red-500/30
                    transition-all duration-150
                    disabled:opacity-50
                  "
                >
                  {archiving ? "Archiving…" : "Yes, archive"}
                </button>
                <button
                  onClick={() => setShowArchiveConfirm(false)}
                  className="
                    px-3 py-1.5 rounded-lg
                    text-[11px] font-medium font-mono text-slate-400
                    bg-white/[0.04] hover:bg-white/[0.07]
                    ring-1 ring-white/[0.06]
                    transition-all duration-150
                  "
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 px-5 pb-5 pt-3 border-t border-white/[0.06] flex-shrink-0">
            <button
              onClick={() => setShowArchiveConfirm(true)}
              disabled={showArchiveConfirm || archiving}
              className="
                flex items-center gap-1.5
                px-3 py-1.5 rounded-lg
                text-[11px] font-mono font-medium text-slate-500
                hover:text-red-400
                bg-white/[0.03] hover:bg-red-500/[0.07]
                ring-1 ring-white/[0.06] hover:ring-red-500/25
                transition-all duration-150
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              <ArchiveIcon />
              Archive course
            </button>

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
              Close
            </button>
          </div>

          <div
            className="h-px flex-shrink-0"
            style={{
              background: `linear-gradient(to right, transparent, ${courseColor}30, transparent)`,
            }}
          />
        </div>
      </div>
    </>,
    document.body
  );
}