import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, ArrowRight } from 'lucide-react';

export default function Page4VirtualBouquet({ config, onNext }) {
  const pageData = config?.page4 || {};
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAccept = () => {
    setIsAccepted(true);

    // Heart explosion
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#ec4899', '#f472b6', '#fbbf24', '#ffffff']
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-4 py-12 overflow-hidden">
      
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-pink-600/30 via-rose-500/20 to-purple-600/25 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="glass-panel-pink max-w-lg w-full rounded-3xl p-6 sm:p-10 text-center relative z-20 shadow-2xl border border-pink-500/30 flex flex-col items-center"
      >
        
        {/* Message */}
        <h2 className="text-2xl sm:text-4xl font-bold font-dancing text-white mb-3 leading-relaxed drop-shadow">
          "{pageData.message || "This bouquet will never dry...\nJust like my love for you 🌹✨"}"
        </h2>

        {/* Center Aesthetic Bouquet Container */}
        <div className="relative my-8 w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          
          {/* Animated Glow Circle */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500/40 via-rose-500/30 to-purple-500/40 blur-2xl transition duration-700 ${isAccepted ? 'scale-125 opacity-100' : 'animate-pulse'}`} />

          {/* Floating Bouquet Image / Illustration */}
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [0, 2, -2, 0]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="relative z-10 w-full h-full rounded-3xl overflow-hidden p-3 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl"
          >
            <img
              src={pageData.bouquetImage || "https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80"}
              alt="Romantic Flower Bouquet"
              className="w-full h-full object-cover rounded-2xl"
            />
          </motion.div>

          {/* Floating Butterflies & Sparkles overlay */}
          <div className="absolute -top-4 -right-4 text-2xl animate-float" style={{ animationDelay: '0.5s' }}>🦋</div>
          <div className="absolute top-1/2 -left-6 text-xl animate-float" style={{ animationDelay: '1.2s' }}>✨</div>
          <div className="absolute -bottom-2 right-4 text-2xl animate-float" style={{ animationDelay: '2s' }}>🌸</div>
        </div>

        {/* Accept Button or Next Page Button */}
        {!isAccepted ? (
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAccept}
            className="w-full py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-lg rounded-full shadow-lg flex items-center justify-center gap-2 cursor-pointer transition"
          >
            <span>{pageData.buttonText || "Accept My Flowers 💐"}</span>
            <Sparkles className="w-5 h-5 animate-spin" />
          </motion.button>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full flex flex-col items-center gap-3"
            >
              <div className="flex items-center gap-2 text-pink-300 font-medium text-sm">
                <Heart className="w-4 h-4 fill-pink-400 text-pink-400" />
                <span>Flowers accepted with love! 💖</span>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onNext}
                className="w-full py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold text-base rounded-full shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Read My Love Letter</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          </AnimatePresence>
        )}

      </motion.div>
    </div>
  );
}
