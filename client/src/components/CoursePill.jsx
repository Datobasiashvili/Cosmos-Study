// icons
import { PlusIcon } from "../icons/PlusIcon";

export default function CoursePill({ course, onClick, onStartSession }) {
  const hex = course.color ?? "#7c3aed";
  return (
    <div className="relative flex-shrink-0 snap-start group">
      <button
        onClick={onClick}
        className="flex flex-col justify-between w-[112px] h-[76px] px-3 py-2.5 rounded-xl text-left bg-white/[0.04] hover:bg-white/[0.07] active:scale-[0.97] ring-1 ring-white/[0.08] transition-all duration-150"
      >
        <span className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: hex + "22", boxShadow: `0 0 0 1px ${hex}44` }}>
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hex }} />
        </span>
        <p className="text-[11px] font-medium text-slate-300 leading-tight line-clamp-2 pr-5">
          {course.title}
        </p>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onStartSession(course); }}
        className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-md flex items-center justify-center text-white transition-all duration-150 active:scale-90 opacity-70 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${hex}dd, ${hex}88)`,
          boxShadow: `0 2px 8px ${hex}55`,
        }}
        title={`Start session for ${course.title}`}
      >
        <PlusIcon size={9} />
      </button>
    </div>
  );
}