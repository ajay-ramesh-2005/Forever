import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Heart, ArrowRight, Sparkles } from 'lucide-react';

export default function Page3MemoriesTimeline({ config, onNext }) {
  const rawMemories = config?.memories;
  const memoriesList = Array.isArray(rawMemories) && rawMemories.length > 0
    ? rawMemories
    : (rawMemories && typeof rawMemories === 'object' && Object.values(rawMemories).length > 0
        ? Object.values(rawMemories)
        : [
            {
              id: '1',
              date: 'August 1, 2023',
              title: 'The Day We First Met ☕',
              description: 'It felt like time stood still. The moment you smiled, I knew my life was changed forever.',
              imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80'
            }
          ]);

  const memories = memoriesList;

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentMem = memories[currentIndex];
  const isLast = currentIndex === memories.length - 1;

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextMem = () => {
    if (isLast) {
      onNext();
    } else {
      setCurrentIndex((prev) => Math.min(memories.length - 1, prev + 1));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-4 py-12 overflow-hidden">
      
      {/* Night Sky Backdrop Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-purple-900/30 via-pink-900/20 to-slate-900/50 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center z-20 mb-8 max-w-xl"
      >
        <div className="flex items-center justify-center gap-2 text-pink-400 mb-1">
          <Sparkles className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-widest text-pink-300">Memory Timeline</span>
          <Sparkles className="w-4 h-4" />
        </div>
        <h2 className="text-3xl sm:text-5xl font-bold font-dancing text-white drop-shadow-lg">
          Journey Through Our Memories ✨
        </h2>
      </motion.div>

      {/* Main Memory Card Container */}
      <div className="relative z-20 max-w-xl w-full flex flex-col items-center">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMem.id || currentIndex}
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -50 }}
            transition={{ duration: 0.5 }}
            className="glass-panel-pink w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-500/30 relative flex flex-col items-center group transform hover:rotate-1 transition-transform"
          >
            {/* Polaroid Photo Frame (16:9 Aspect Ratio) */}
            <div className="w-full bg-white/10 p-2.5 sm:p-3.5 rounded-2xl backdrop-blur-md shadow-xl border border-white/20 mb-6 group-hover:shadow-pink-500/20 transition duration-500">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-slate-950">
                <img
                  src={currentMem.imageUrl}
                  alt={currentMem.title}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80 pointer-events-none" />
                
                {/* Date Tag */}
                <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-pink-500/40 text-xs font-semibold text-pink-300 flex items-center gap-1.5 shadow">
                  <Calendar className="w-3.5 h-3.5 text-pink-400" />
                  <span>{currentMem.date}</span>
                </div>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="text-2xl sm:text-3xl font-bold font-dancing text-white text-center mb-3">
              {currentMem.title}
            </h3>
            
            <p className="text-sm sm:text-base text-pink-200/90 text-center font-normal leading-relaxed mb-6 px-2">
              "{currentMem.description}"
            </p>

            {/* Progress Bar & Counter */}
            <div className="w-full flex items-center justify-between text-xs text-pink-300 border-t border-pink-500/20 pt-4">
              <span>Memory {currentIndex + 1} of {memories.length}</span>
              <div className="flex gap-1.5">
                {memories.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 rounded-full transition-all ${
                      idx === currentIndex ? 'w-6 bg-pink-500' : 'w-2 bg-slate-700 hover:bg-pink-400'
                    }`}
                  />
                ))}
              </div>
            </div>

          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between w-full mt-6 gap-4">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`px-5 py-3 rounded-full border flex items-center gap-2 text-sm font-semibold transition cursor-pointer ${
              currentIndex === 0
                ? 'opacity-40 border-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-slate-900/80 border-pink-500/30 text-pink-300 hover:bg-slate-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNextMem}
            className="px-8 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2 hover:from-pink-600 hover:to-rose-600 transition cursor-pointer"
          >
            <span>{isLast ? 'Continue Our Story 💖' : 'Next Memory'}</span>
            {isLast ? <ArrowRight className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>

      </div>
    </div>
  );
}
