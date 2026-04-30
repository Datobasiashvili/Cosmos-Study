import React from "react";

export function StarField() {
  const stars = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: (i * 37 + 11) % 100,
    y: (i * 53 + 7) % 100,
    r: i % 5 === 0 ? 1.2 : 0.7,
    opacity: 0.15 + (i % 4) * 0.08,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.r * 2,
            height: s.r * 2,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}