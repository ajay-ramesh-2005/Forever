import React, { useEffect, useState } from 'react';

export default function CursorHearts({ active = true }) {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    if (!active) return;

    const handleMouseMove = (e) => {
      // Throttle creation rate
      if (Math.random() > 0.3) return;

      const newHeart = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 12 + 10,
        color: ['#f43f5e', '#ec4899', '#f472b6', '#a855f7', '#fb7185'][Math.floor(Math.random() * 5)],
        char: ['💖', '💕', '💗', '✨'][Math.floor(Math.random() * 4)]
      };

      setHearts((prev) => [...prev.slice(-15), newHeart]);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [active]);

  useEffect(() => {
    if (hearts.length === 0) return;
    const timer = setTimeout(() => {
      setHearts((prev) => prev.slice(1));
    }, 800);
    return () => clearTimeout(timer);
  }, [hearts]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="absolute font-bold animate-ping transition-all duration-700 ease-out select-none"
          style={{
            left: `${h.x}px`,
            top: `${h.y}px`,
            fontSize: `${h.size}px`,
            color: h.color,
            transform: 'translate(-50%, -50%) scale(1.2)',
            opacity: 0.85
          }}
        >
          {h.char}
        </span>
      ))}
    </div>
  );
}
