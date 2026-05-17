import { useState } from "react";
import { useCourse } from "../hooks/useCourses";
import AddCourseModal from "../components/AddCourseModal";

const BookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const OrbitIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.2 }}>
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
);

function CoursePill({ course }) {
  const hex = course.color ?? "#7c3aed";
  return (
    <button className="flex-shrink-0 snap-start flex flex-col justify-between w-[112px] h-[76px] px-3 py-2.5 rounded-xl text-left bg-white/[0.04] hover:bg-white/[0.07] active:scale-[0.97] ring-1 ring-white/[0.08] transition-all duration-150">
      <span className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: hex + "22", boxShadow: `0 0 0 1px ${hex}44` }}>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hex }} />
      </span>
      <p className="text-[11px] font-medium text-slate-300 leading-tight line-clamp-2">
        {course.title}
      </p>
    </button>
  );
}

function CourseRow({ course }) {
  const hex = course.color ?? "#7c3aed";
  return (
    <li className="group relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer bg-white/[0.03] hover:bg-white/[0.07] ring-1 ring-white/[0.06] hover:ring-white/[0.12] transition-all duration-200 ease-out overflow-hidden">
      <span className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-200" style={{ backgroundColor: hex }} />
      <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-md bg-white/[0.05]" style={{ boxShadow: `0 0 0 1px ${hex}4d`, color: hex }}>
        <BookIcon />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-slate-200 truncate leading-tight group-hover:text-white transition-colors duration-150">
          {course.title}
        </p>
      </div>
      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full opacity-70 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: hex }} />
    </li>
  );
}

const SkeletonPill = () => (
  <div className="flex-shrink-0 w-[112px] h-[76px] rounded-xl bg-white/[0.03] ring-1 ring-white/[0.05] animate-pulse" />
);

const SkeletonRow = () => (
  <li className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.02] ring-1 ring-white/[0.04] animate-pulse">
    <span className="flex-shrink-0 w-8 h-8 rounded-md bg-white/[0.05]" />
    <div className="flex-1 space-y-2">
      <div className="h-3 w-3/4 rounded bg-white/[0.07]" />
      <div className="h-2 w-1/4 rounded bg-white/[0.04]" />
    </div>
  </li>
);

export default function CourseList() {
  const { courses, isLoading, createCourse } = useCourse();
  const [modalOpen, setModalOpen] = useState(false);
  const isEmpty = !isLoading && courses.length === 0;

  return (
    <>
      <section className="lg:hidden w-full">

        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-[11px] font-semibold tracking-[0.14em] uppercase text-slate-500">
              Courses
            </h2>
            {!isLoading && (
              <p className="text-[10px] text-slate-600 font-mono mt-0.5">
                {courses.length} enrolled
              </p>
            )}
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] text-purple-400 font-medium bg-purple-500/10 hover:bg-purple-500/20 active:bg-purple-500/30 ring-1 ring-purple-500/20 transition-all duration-150"
          >
            <PlusIcon />
            New
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-0.5 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {isLoading ? (
            <><SkeletonPill /><SkeletonPill /><SkeletonPill /></>
          ) : isEmpty ? (
            <button
              onClick={() => setModalOpen(true)}
              className="flex-shrink-0 flex flex-col items-center justify-center gap-1.5 w-[112px] h-[76px] rounded-xl bg-white/[0.02] hover:bg-white/[0.05] active:scale-[0.97] ring-1 ring-white/[0.10] hover:ring-purple-500/30 ring-dashed text-purple-400/50 hover:text-purple-400/80 transition-all duration-150 snap-start"
            >
              <PlusIcon />
              <span className="text-[10px] text-slate-600">Add course</span>
            </button>
          ) : (
            <>
              {courses.map((course) => (
                <CoursePill key={course._id} course={course} />
              ))}
              <button
                onClick={() => setModalOpen(true)}
                className="flex-shrink-0 flex items-center justify-center w-[44px] h-[76px] rounded-xl bg-white/[0.02] hover:bg-white/[0.05] active:scale-[0.97] ring-1 ring-dashed ring-white/[0.08] hover:ring-purple-500/30 text-purple-400/40 hover:text-purple-400/70 transition-all duration-150 snap-start"
              >
                <PlusIcon />
              </button>
            </>
          )}
        </div>
      </section>

      <div className="hidden lg:flex flex-col relative w-full max-w-full rounded-xl overflow-hidden bg-[#0d0d18]/80 backdrop-blur-md ring-1 ring-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.5)]">

        <span className="absolute rounded-full bg-purple-400 opacity-40 pointer-events-none" style={{ width: 2, height: 2, top: 12, right: 18 }} />
        <span className="absolute rounded-full bg-purple-400 opacity-40 pointer-events-none" style={{ width: 2, height: 2, top: 40, right: 8 }} />
        <span className="absolute rounded-full bg-purple-400 opacity-40 pointer-events-none" style={{ width: 2, height: 2, bottom: 20, left: 14 }} />

        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="text-purple-400"><OrbitIcon /></span>
            <div>
              <h2 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-slate-400">Courses</h2>
              {!isLoading && (
                <p className="text-[10px] text-slate-600 font-mono mt-0.5">{courses.length} enrolled</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-purple-400 font-medium bg-purple-500/10 hover:bg-purple-500/20 ring-1 ring-purple-500/20 hover:ring-purple-500/40 transition-all duration-150"
          >
            <PlusIcon />
            <span>New</span>
          </button>
        </div>

        <div className="px-2 py-2 space-y-1 max-h-[380px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10">
          {isLoading ? (
            <><SkeletonRow /><SkeletonRow /><SkeletonRow /></>
          ) : isEmpty ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <span className="text-purple-400/40 mb-3">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
                </svg>
              </span>
              <p className="text-[12px] text-slate-500 leading-relaxed">
                No courses yet.<br />
                <span className="text-purple-400/70">Create one to begin your journey.</span>
              </p>
            </div>
          ) : (
            courses.map((course) => (
              <CourseRow key={course._id} course={course} />
            ))
          )}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      </div>

      <AddCourseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={createCourse}
      />
    </>
  );
}
