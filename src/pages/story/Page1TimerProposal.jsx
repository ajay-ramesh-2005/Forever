import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Clock } from 'lucide-react';

export function calculateTimeTogether(startDateStr) {
  const start = new Date(startDateStr);
  const now = new Date();
  
  if (isNaN(start.getTime())) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  let totalSecs = Math.max(0, Math.floor((now - start) / 1000));
  
  const years = Math.floor(totalSecs / (365.25 * 24 * 3600));
  totalSecs %= Math.floor(365.25 * 24 * 3600);

  const months = Math.floor(totalSecs / (30.4375 * 24 * 3600));
  totalSecs %= Math.floor(30.4375 * 24 * 3600);

  const days = Math.floor(totalSecs / (24 * 3600));
  totalSecs %= (24 * 3600);

  const hours = Math.floor(totalSecs / 3600);
  totalSecs %= 3600;

  const minutes = Math.floor(totalSecs / 60);
  const seconds = totalSecs % 60;

  return { years, months, days, hours, minutes, seconds };
}

export default function Page1TimerProposal({ config, onNext }) {
  const pageData = config?.page1 || {};
  const startDate = config?.startDate || "2023-08-01T00:00:00.000Z";
  
  const [time, setTime] = useState(() => calculateTimeTogether(startDate));
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [noAttemptCount, setNoAttemptCount] = useState(0);
  const [captionIndex, setCaptionIndex] = useState(0);
  const [isYesClicked, setIsYesClicked] = useState(false);

  const captions = pageData.noCaptions || [
    "Nope 😜",
    "Catch me first 💨",
    "You really thought? 🤭",
    "Hehe 💕",
    "Not happening 💖",
    "You can't reject destiny ✨"
  ];

  // Update timer live
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(calculateTimeTogether(startDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [startDate]);

  // Escaping NO button behavior
  const handleNoHover = () => {
    const margin = 100;
    const maxX = window.innerWidth - margin * 2;
    const maxY = window.innerHeight - margin * 2;

    const randomX = (Math.random() - 0.5) * (maxX * 0.7);
    const randomY = (Math.random() - 0.5) * (maxY * 0.7);

    setNoButtonPos({ x: randomX, y: randomY });
    setNoAttemptCount((prev) => prev + 1);
    setCaptionIndex((prev) => (prev + 1) % captions.length);
  };

  // YES click handler
  const handleYes = () => {
    setIsYesClicked(true);
    
    // Heart & Confetti Burst
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#f472b6', '#ffffff', '#fbbf24']
    });

    setTimeout(() => {
      onNext();
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-4 py-12 overflow-hidden">
      
      {/* Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-pink-600/30 to-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-panel-pink max-w-xl w-full rounded-3xl p-6 sm:p-10 text-center relative z-20 shadow-2xl border border-pink-500/30"
      >
        {/* TOP OF THE CARD: Live Love Timer Header */}
        <div className="flex items-center justify-center gap-2 text-pink-300 mb-2">
          <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
          <span className="text-sm font-semibold tracking-wider uppercase text-pink-200">
            {pageData.title || "We've been together for"}
          </span>
        </div>

        {/* Live Timer Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 my-6">
          {[
            { label: 'Years', val: time.years },
            { label: 'Months', val: time.months },
            { label: 'Days', val: time.days },
            { label: 'Hours', val: time.hours },
            { label: 'Minutes', val: time.minutes },
            { label: 'Seconds', val: time.seconds }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/60 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-pink-500/20 shadow-inner flex flex-col items-center justify-center transform hover:scale-105 transition"
            >
              <span className="text-xl sm:text-2xl font-bold font-mono text-white bg-clip-text text-transparent bg-gradient-to-r from-pink-300 to-rose-400">
                {String(item.val).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-pink-300 font-medium uppercase mt-0.5">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Heart Divider */}
        <div className="flex items-center justify-center my-6 gap-3">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-pink-500/40 to-transparent flex-1" />
          <Heart className="w-6 h-6 text-pink-400 fill-pink-500/40 animate-pulse" />
          <div className="h-[1px] bg-gradient-to-r from-transparent via-pink-500/40 to-transparent flex-1" />
        </div>

        {/* Question & Subtitle */}
        <h1 className="text-2xl sm:text-4xl font-bold text-white font-dancing mb-3 drop-shadow-md">
          {pageData.question || "Will you be mine forever? 💖"}
        </h1>

        <p className="text-sm sm:text-base text-pink-200/90 font-medium italic mb-8">
          "{pageData.subtitle || "Try saying NO... I dare you 😏"}"
        </p>

        {/* YES & NO BUTTON CONTAINER */}
        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-6 min-h-[90px]">
          
          {/* YES Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleYes}
            disabled={isYesClicked}
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-lg rounded-full shadow-lg shadow-pink-500/30 flex items-center justify-center gap-2 cursor-pointer z-30 transform transition"
          >
            <span>YES! 💖</span>
            <Sparkles className="w-5 h-5 animate-spin" />
          </motion.button>

          {/* Escaping NO Button */}
          <motion.button
            animate={{
              x: noButtonPos.x,
              y: noButtonPos.y,
            }}
            transition={{
              type: 'spring',
              stiffness: Math.min(300 + noAttemptCount * 40, 800),
              damping: 15
            }}
            onMouseEnter={handleNoHover}
            onTouchStart={handleNoHover}
            onClick={handleNoHover}
            className="px-8 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 backdrop-blur-md text-pink-300 font-semibold text-sm rounded-full border border-pink-500/30 shadow-md cursor-pointer select-none whitespace-nowrap"
          >
            {noAttemptCount > 0 ? captions[captionIndex] : "NO 😜"}
          </motion.button>
        </div>

        {/* Funny counter note if attempted NO */}
        {noAttemptCount > 0 && (
          <p className="text-xs text-pink-400 mt-4 animate-bounce">
            NO click attempts: {noAttemptCount} — Destiny always wins! 💕
          </p>
        )}
      </motion.div>
    </div>
  );
}
