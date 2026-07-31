import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Flame, ArrowRight } from 'lucide-react';

export default function Page2LoveMeter({ config, onNext }) {
  const pageData = config?.page2 || {};
  const targetClicks = pageData.targetClicks || 70;
  
  const [clickCount, setClickCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [isBlooming, setIsBlooming] = useState(false);
  const lastClickTime = useRef(Date.now());

  const progress = Math.min(100, Math.round((clickCount / targetClicks) * 100));

  // Handle click on heart
  const handleHeartClick = () => {
    if (isCompleted) return;

    lastClickTime.current = Date.now();
    setClickCount((prev) => {
      const next = prev + 1;
      if (next >= targetClicks && !isCompleted) {
        trigger100PercentCelebration();
      }
      return next;
    });

    // Small click heart burst
    confetti({
      particleCount: 6,
      spread: 40,
      startVelocity: 15,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#f472b6']
    });
  };

  // Decay timer if user stops clicking for 1 sec
  useEffect(() => {
    if (isCompleted) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastClickTime.current > 1000 && clickCount > 0) {
        setClickCount((prev) => Math.max(0, prev - 1));
      }
    }, 400);

    return () => clearInterval(interval);
  }, [clickCount, isCompleted]);

  // Massive celebration at 100%
  const trigger100PercentCelebration = () => {
    setIsCompleted(true);
    setIsShaking(true);
    setIsBlooming(true);

    setTimeout(() => setIsShaking(false), 800);
    setTimeout(() => setIsBlooming(false), 1500);

    // Massive confetti explosion
    const end = Date.now() + 3000;
    const colors = ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center relative px-4 py-12 overflow-hidden ${isShaking ? 'shake-screen' : ''} ${isBlooming ? 'bloom-screen' : ''}`}>
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-rose-600/30 via-pink-500/20 to-purple-600/30 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-panel-pink max-w-lg w-full rounded-3xl p-6 sm:p-10 text-center relative z-20 shadow-2xl border border-pink-500/30"
      >
        {/* Top Message */}
        <h2 className="text-2xl sm:text-3xl font-bold font-dancing text-white mb-2">
          {pageData.topMessage || "Awww... That's the sweetest answer ever 🥰"}
        </h2>
        
        <p className="text-xs sm:text-sm text-pink-200/90 font-medium mb-8">
          {pageData.subtitle || "Click the big heart to fill our Love Meter to 100%!"}
        </p>

        {/* Love Meter Bar */}
        <div className="relative w-full bg-slate-900/80 rounded-full p-2 border border-pink-500/30 shadow-inner mb-8">
          <div
            className="h-6 sm:h-8 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 transition-all duration-300 relative flex items-center justify-end pr-3 overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
            <span className="text-xs font-bold text-white relative z-10 font-mono shadow-sm">
              {progress}%
            </span>
          </div>
        </div>

        {/* Animated Heart Button */}
        <div className="flex flex-col items-center justify-center mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.85 }}
            onClick={handleHeartClick}
            disabled={isCompleted}
            className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-purple-600 p-1 shadow-2xl flex items-center justify-center group cursor-pointer transition transform ${
              isCompleted ? 'ring-8 ring-pink-400/50' : 'animate-heartbeat'
            }`}
          >
            <div className="w-full h-full rounded-full bg-slate-950/70 backdrop-blur-md flex flex-col items-center justify-center gap-1 text-pink-400 group-hover:text-pink-300">
              <Heart className={`w-16 h-16 sm:w-20 sm:h-20 fill-pink-500 text-pink-400 transition-transform ${isCompleted ? 'scale-125' : ''}`} />
              {!isCompleted && (
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-pink-200">
                  Tap Me! 💕
                </span>
              )}
            </div>
          </motion.button>
          
          {!isCompleted && (
            <span className="text-xs text-pink-300 mt-4 font-medium italic animate-pulse">
              (Keep clicking! Don't let the meter drop!)
            </span>
          )}
        </div>

        {/* 100% Completion Popup & Continue Button */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="flex flex-col items-center justify-center gap-4 pt-4 border-t border-pink-500/30"
            >
              <div className="flex items-center gap-2 text-yellow-300">
                <Sparkles className="w-5 h-5 animate-spin" />
                <span className="text-xl sm:text-2xl font-bold font-dancing text-white">
                  {pageData.completionPopup || "I'm 100% Yours My Love 💖✨"}
                </span>
                <Sparkles className="w-5 h-5 animate-spin" />
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNext}
                className="w-full py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold rounded-full shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Continue Our Journey</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
}
