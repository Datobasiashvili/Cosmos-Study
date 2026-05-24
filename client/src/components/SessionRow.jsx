import { useState } from "react";

// icons 
import { TrashIcon } from "../icons/TrashIcon";
import { ZapIcon } from "../icons/ZapIcon";
import { ClockIcon } from "../icons/ClockIcon";

// utils
import { formatDate } from "../utils/time";
import { formatTime } from "../utils/time";
import { formatDuration } from "../utils/time";

export default function SessionRow({ session, courseColor, onDelete, isDeleting, index }) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDeleteClick = () => {
        if (confirmDelete) {
            onDelete(session._id);
        } else {
            setConfirmDelete(true);
            setTimeout(() => setConfirmDelete(false), 3000);
        }
    };

    const duration = formatDuration(session.duration);
    const dateLabel = formatDate(session.startTime);
    const startLabel = formatTime(session.startTime);
    const endLabel = session.endTime ? formatTime(session.endTime) : null;

    return (
        <div
            className="relative rounded-xl ring-1 ring-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-300"
            style={{
                opacity: isDeleting ? 0.3 : 1,
                transform: isDeleting ? "scale(0.97)" : "scale(1)",
                animationDelay: `${index * 40}ms`,
            }}
        >
            <div
                className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
                style={{ backgroundColor: courseColor + "99" }}
            />

            <div className="pl-4 pr-3 py-3">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono text-slate-500">{dateLabel}</span>
                        {session.completed && (
                            <span
                                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-semibold font-mono"
                                style={{
                                    backgroundColor: courseColor + "22",
                                    color: courseColor,
                                    border: `1px solid ${courseColor}44`,
                                }}
                            >
                                <ZapIcon /> {session.xpEarned ?? 0} xp
                            </span>
                        )}
                        {!session.completed && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-mono bg-white/[0.04] text-slate-600 ring-1 ring-white/[0.06]">
                                incomplete
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleDeleteClick}
                        disabled={isDeleting}
                        className={`
              flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg
              text-[10px] font-mono font-medium
              ring-1 transition-all duration-150
              ${confirmDelete
                                ? "bg-red-500/20 ring-red-500/40 text-red-400"
                                : "bg-white/[0.03] ring-white/[0.06] text-slate-600 hover:text-red-400 hover:ring-red-500/30 hover:bg-red-500/10"
                            }
            `}
                    >
                        <TrashIcon />
                        {confirmDelete ? "confirm?" : ""}
                    </button>
                </div>

                {session.description ? (
                    <p className="text-[12px] text-slate-300 font-mono leading-relaxed mb-2 line-clamp-2">
                        {session.description}
                    </p>
                ) : (
                    <p className="text-[11px] text-slate-700 font-mono italic mb-2">No description</p>
                )}

                <div className="flex items-center gap-3 flex-wrap">
                    <span className="flex items-center gap-1 text-[10px] font-mono text-slate-600">
                        <ClockIcon />
                        {startLabel}{endLabel ? ` → ${endLabel}` : ""}
                    </span>
                    {duration && (
                        <span
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded-md"
                            style={{
                                backgroundColor: courseColor + "18",
                                color: courseColor + "cc",
                            }}
                        >
                            {duration}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}