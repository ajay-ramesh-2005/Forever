import React, { useMemo } from 'react';

export default function FloatingParticles({ count = 25, type = 'hearts' }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 18 + 10, // 10px to 28px
      duration: Math.random() * 8 + 6, // 6s to 14s
      delay: Math.random() * 5,
      opacity: Math.random() * 0.5 + 0.3,
      rotation: Math.random() * 360,
      symbol: ['💖', '✨', '🌸', '💕', '⭐', '💗', '🌹'][Math.floor(Math.random() * 7)]
    }));
  }, [count]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-float select-none transition-all"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
            filter: 'drop-shadow(0 0 8px rgba(244, 114, 182, 0.4))'
          }}
        >
          {p.symbol}
        </div>
      ))}
    </div>
  );
}
