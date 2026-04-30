import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { navItems } from "../utils/navItems";
import { StarField } from "../utils/starField";

export default function CosmosLayout() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);

  const getInitials = (name) => {
    if (!name) return "??";

    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return words
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user?.nickname || "Guest User";
  const initials = getInitials(displayName);

  const currentPath = location.pathname.split("/")[1] || "dashboard";

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row font-mono text-white">
      <aside className="hidden md:flex flex-col w-56 min-h-screen relative border-r border-white/5 bg-[#080b14] shrink-0">
        <StarField />
        <div className="relative z-10 px-5 pt-7 pb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-indigo-400/20 border border-indigo-300/30 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-indigo-300" />
            </div>
            <span className="text-sm tracking-[0.15em] uppercase text-indigo-200/70 font-light">
              Cosmos Study
            </span>
          </div>
        </div>

        <nav className="relative z-10 flex flex-col gap-1 px-3 flex-1">
          {navItems.map((item) => {
            const isActive = currentPath === item.id;
            const isHovered = hovered === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(`/${item.id}`)}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition-all duration-200 ${
                  isActive ? "text-white" : "text-white/35 hover:text-white/70"
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-lg bg-indigo-500/10 border border-indigo-400/20" />
                )}
                {isHovered && !isActive && (
                  <div className="absolute inset-0 rounded-lg bg-white/3" />
                )}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-r-full bg-indigo-400" />
                )}
                <span className="relative z-10 shrink-0">
                  {item.icon(isActive)}
                </span>
                <span
                  className={`relative z-10 text-xs tracking-[0.12em] uppercase transition-all duration-200 ${isActive ? "text-indigo-200" : ""}`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="relative z-10 px-4 py-5 border-t border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-violet-500/30 border border-violet-400/30 flex items-center justify-center text-[10px] text-violet-200">
              {initials}
            </div>
            <span className="text-[11px] text-white/30 tracking-widest uppercase">
              {displayName}
            </span>
          </div>
        </div>
      </aside>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16">
        <div className="absolute inset-0 bg-[#080b14]/80 backdrop-blur-xl border-t border-white/5" />
        <div className="relative z-10 flex items-center justify-around h-full px-2">
          {navItems.map((item) => {
            const isActive = currentPath === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(`/${item.id}`)}
                className="relative flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-all duration-200"
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-xl bg-indigo-500/10 border border-indigo-400/15" />
                )}
                <span
                  className={`relative z-10 ${isActive ? "text-indigo-300" : "text-white/30"}`}
                >
                  {item.icon(isActive)}
                </span>
                <span
                  className={`relative z-10 text-[9px] tracking-[0.12em] uppercase ${isActive ? "text-indigo-300/80" : "text-white/20"}`}
                >
                  {item.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
