import { Link } from "react-router-dom";

const features = [
  { title: "Focus sessions", description: "Stay on task with structured study bursts and built-in timers." },
  { title: "Course progress", description: "Track every course, chapter, and milestone in one clean dashboard." },
  { title: "Smart reminders", description: "Never miss a session with friendly scheduling and session review prompts." },
];

export default function Landing() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Syne:wght@700;800&display=swap');

        .font-display { font-family: 'Syne', sans-serif; }
        .font-body { font-family: 'Inter', system-ui, sans-serif; }
      `}</style>

      <main className="relative min-h-screen overflow-hidden bg-[#030816] text-white font-body">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-[#1f2a59] to-transparent opacity-90" />
        <div className="pointer-events-none absolute right-[-4rem] top-10 h-44 w-44 rounded-full bg-[#7c6fff]/15 blur-3xl" />
        <div className="pointer-events-none absolute left-[-4rem] bottom-16 h-40 w-40 rounded-full bg-[#3de8c0]/10 blur-3xl" />

        <div className="relative mx-auto flex min-h-screen max-w-xl flex-col justify-between px-6 py-8 sm:px-8">
          <section className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-[#9ab0d5] shadow-sm shadow-black/10 backdrop-blur-sm">
              Modern mobile launch
            </div>

            <div className="space-y-4">
              <p className="font-display text-sm uppercase tracking-[0.28em] text-[#7c9cff]">cosmos study</p>
              <h1 className="max-w-lg text-4xl font-bold tracking-[-0.04em] text-white sm:text-5xl">
                Build your study flow with a mobile-ready learning dashboard.
              </h1>
              <p className="max-w-xl text-sm leading-7 text-[#c8d4f0]/80 sm:text-base">
                Plan sessions, track course progress, and keep momentum on every device. Clean, fast, and built for launch.
              </p>
            </div>

            <div className="grid gap-4 sm:max-w-md">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-[#3de8c0] to-[#7c6fff] px-6 py-4 text-sm font-semibold text-[#03040e] shadow-[0_16px_48px_rgba(61,232,192,0.18)] transition hover:-translate-y-0.5"
              >
                Get started
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-3xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Log in
              </Link>
            </div>
          </section>

          <section className="grid gap-4 pt-6 sm:grid-cols-3 sm:gap-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-sm shadow-black/10 backdrop-blur-sm">
                <p className="text-sm font-semibold text-[#eef2ff]">{feature.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#c8d4f0]/85">{feature.description}</p>
              </div>
            ))}
          </section>

          <footer className="space-y-4 text-center text-sm text-[#7f8bb6] sm:text-base">
            <p className="max-w-lg mx-auto">
              Launch-ready design, tuned for phone screens and desktop previews. Start with a modern, friendly intro that guides users to login quickly.
            </p>
            <p className="text-[#5d6b9a]">No code required. No gimmicks. Just a clean app start page.</p>
          </footer>
        </div>
      </main>
    </>
  );
}
