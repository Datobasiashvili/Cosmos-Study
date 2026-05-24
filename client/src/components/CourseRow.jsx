// icons
import { BookIcon } from "../icons/BookIcon";
import { PlusIcon } from "../icons/PlusIcon";

export default function CourseRow({ course, onClick, onStartSession }) {
  const hex = course.color ?? "#7c3aed";
  return (
    <li className="group relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer bg-white/[0.03] hover:bg-white/[0.07] ring-1 ring-white/[0.06] hover:ring-white/[0.12] transition-all duration-200 ease-out overflow-hidden">
      <span className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-200" style={{ backgroundColor: hex }} />
      <span
        onClick={onClick}
        className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-md bg-white/[0.05] cursor-pointer"
        style={{ boxShadow: `0 0 0 1px ${hex}4d`, color: hex }}
      >
        <BookIcon size={15} />
      </span>
      <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
        <p className="text-[13px] font-medium text-slate-200 truncate leading-tight group-hover:text-white transition-colors duration-150">
          {course.title}
        </p>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onStartSession(course); }}
        className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-md text-white opacity-0 group-hover:opacity-100 transition-all duration-150 active:scale-90"
        style={{
          background: `linear-gradient(135deg, ${hex}cc, ${hex}77)`,
          boxShadow: `0 2px 10px ${hex}44`,
        }}
        title={`Start session for ${course.title}`}
      >
        <PlusIcon size={10} />
      </button>

      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full opacity-70 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: hex }} />
    </li>
  );
}