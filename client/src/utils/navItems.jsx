import React from "react";

export const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    shortLabel: "Home",
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={active ? 1.5 : 1.2}>
        <rect x="3" y="3" width="7" height="7" rx="1.5" fill={active ? "currentColor" : "none"} stroke="currentColor" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" fill={active ? "currentColor" : "none"} opacity={active ? 0.5 : 1} stroke="currentColor" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" fill={active ? "currentColor" : "none"} opacity={active ? 0.5 : 1} stroke="currentColor" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" fill={active ? "currentColor" : "none"} opacity={active ? 0.3 : 1} stroke="currentColor" />
      </svg>
    ),
  },
  {
    id: "analytics",
    label: "Analytics",
    shortLabel: "Stats",
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.5}>
        <path d="M3 17 L7 11 L11 14 L15 7 L21 10" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="7" cy="11" r={active ? 1.5 : 1} fill="currentColor" />
        <circle cx="11" cy="14" r={active ? 1.5 : 1} fill="currentColor" />
        <circle cx="15" cy="7" r={active ? 2 : 1} fill="currentColor" />
        <circle cx="21" cy="10" r={active ? 1.5 : 1} fill="currentColor" />
        {active && <path d="M3 20 L21 20" stroke="currentColor" strokeOpacity="0.3" strokeLinecap="round" />}
      </svg>
    ),
  },
  {
    id: "cosmos",
    label: "Cosmos",
    shortLabel: "Cosmos",
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <circle cx="12" cy="12" r={active ? 2 : 1.5} fill="currentColor" />
        <circle cx="6" cy="8" r={active ? 1.5 : 1} fill="currentColor" opacity="0.8" />
        <circle cx="18" cy="7" r={active ? 1.2 : 0.8} fill="currentColor" opacity="0.7" />
        <circle cx="17" cy="16" r={active ? 1.5 : 1} fill="currentColor" opacity="0.6" />
        <circle cx="7" cy="17" r={active ? 1.2 : 0.8} fill="currentColor" opacity="0.5" />
        <circle cx="20" cy="12" r={active ? 1 : 0.6} fill="currentColor" opacity="0.4" />
        <circle cx="4" cy="13" r={active ? 0.8 : 0.5} fill="currentColor" opacity="0.35" />
        <line x1="12" y1="12" x2="6" y2="8" stroke="currentColor" strokeWidth="0.6" strokeOpacity={active ? 0.5 : 0.25} />
        <line x1="12" y1="12" x2="18" y2="7" stroke="currentColor" strokeWidth="0.6" strokeOpacity={active ? 0.5 : 0.25} />
        <line x1="12" y1="12" x2="17" y2="16" stroke="currentColor" strokeWidth="0.6" strokeOpacity={active ? 0.5 : 0.25} />
        <line x1="12" y1="12" x2="7" y2="17" stroke="currentColor" strokeWidth="0.6" strokeOpacity={active ? 0.5 : 0.25} />
        <line x1="6" y1="8" x2="4" y2="13" stroke="currentColor" strokeWidth="0.6" strokeOpacity={active ? 0.4 : 0.15} />
        <line x1="18" y1="7" x2="20" y2="12" stroke="currentColor" strokeWidth="0.6" strokeOpacity={active ? 0.4 : 0.15} />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    shortLabel: "Config",
    icon: (active) => (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="3" fill={active ? "currentColor" : "none"} />
        <path
          d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

