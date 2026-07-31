import React from 'react';
import { motion } from 'framer-motion';
import CanvasFireworks from '../../components/CanvasFireworks';
import { Heart, Sparkles } from 'lucide-react';

export default function GrandFinaleEnding({ config }) {
  const endingData = config?.ending || {};
  const girlfriendName = config?.girlfriendName || "Sophia";

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center px-4 text-center overflow-hidden select-none">
      
      {/* High-Performance Canvas Fireworks */}
      <CanvasFireworks />

      {/* Romantic Glowing Ambient Lights */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-to-tr from-pink-600/30 via-rose-500/25 to-purple-600/30 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Sky Message Sequence */}
      <div className="relative z-20 max-w-2xl flex flex-col items-center justify-center gap-6 px-4">
        
        {/* Step 1: HAPPY GIRLFRIEND'S DAY */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="flex items-center gap-2 text-pink-400 font-bold uppercase tracking-[0.25em] text-xs sm:text-sm shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
          <span>{endingData.fireworkHeading || "HAPPY GIRLFRIEND'S DAY"}</span>
          <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
        </motion.div>

        {/* Step 2: HER NAME IN GIANT GLOWING CURSIVE */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.6, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 1.5, type: 'spring', stiffness: 100 }}
          className="text-5xl sm:text-7xl md:text-8xl font-bold font-dancing text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-400 to-purple-300 drop-shadow-[0_0_35px_rgba(244,114,182,0.8)] py-2"
        >
          {endingData.herName || `${girlfriendName} 💕`}
        </motion.h1>

        {/* Step 3: I Love You Forever */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 2.8 }}
          className="text-2xl sm:text-4xl font-bold font-sacramento text-pink-200 tracking-wide drop-shadow-md"
        >
          {endingData.subHeading || "I Love You Forever"}
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 3.8 }}
          className="w-48 h-[1px] bg-gradient-to-r from-transparent via-pink-500/60 to-transparent my-2"
        />

        {/* Step 4: Final Message & Forever Yours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 4.2 }}
          className="flex flex-col items-center gap-3 text-pink-100 font-poppins"
        >
          <p className="text-sm sm:text-lg text-pink-200/90 font-medium italic">
            "{endingData.finalNote || "Thank you for being the best part of my life."}"
          </p>

          <div className="flex items-center gap-2 text-pink-400 font-semibold text-base sm:text-xl pt-2">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
            <span className="font-dancing text-2xl sm:text-3xl text-white">
              {endingData.footerText || "Forever Yours ❤️"}
            </span>
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
          </div>
        </motion.div>

      </div>
    </div>
  );
}
