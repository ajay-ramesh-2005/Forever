import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Mail, Gift, Heart, Sparkles, CheckCircle2, Ticket } from 'lucide-react';

export default function Page5LoveLetterCoupon({ config, onClaimCoupon }) {
  const pageData = config?.page5 || {};
  const [isOpen, setIsOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isTypingDone, setIsTypingDone] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);

  const fullLetter = pageData.letterText || `My Dearest,

From the moment you entered my world, everything became brighter, warmer, and infinitely more beautiful. Your smile is my daily dose of happiness, and your laughter is my absolute favorite song in the world.

Thank you for being my best friend, my soulmate, my biggest supporter, and the love of my life. No matter where life takes us, my heart will always belong to you.

Happy Girlfriend's Day, my love. Forever & Always. ❤️`;

  const typingSpeed = pageData.typingSpeedMs || 35;

  // Typewriter effect
  useEffect(() => {
    if (!isOpen) return;

    let index = 0;
    setTypedText('');
    setIsTypingDone(false);

    const timer = setInterval(() => {
      if (index < fullLetter.length) {
        setTypedText(fullLetter.slice(0, index + 1));
        index++;
      } else {
        setIsTypingDone(true);
        clearInterval(timer);
      }
    }, typingSpeed);

    return () => clearInterval(timer);
  }, [isOpen, fullLetter, typingSpeed]);

  const handleOpenEnvelope = () => {
    setIsOpen(true);
  };

  const handleShowCoupon = () => {
    setShowCoupon(true);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#fbbf24', '#f43f5e', '#ec4899']
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative px-4 py-12 overflow-hidden">
      
      {/* Fireflies background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_12px_#fde047] animate-firefly"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 3 + 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-20 max-w-xl w-full flex flex-col items-center">
        
        <AnimatePresence mode="wait">
          {!showCoupon ? (
            /* LOVE LETTER ENVELOPE / CARD */
            <motion.div
              key="letter-card"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -30 }}
              className="glass-panel-pink w-full rounded-3xl p-6 sm:p-10 shadow-2xl border border-pink-500/30 text-center relative"
            >
              {!isOpen ? (
                /* Unopened Vintage Envelope View */
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="relative mb-6 group cursor-pointer" onClick={handleOpenEnvelope}>
                    <div className="absolute -inset-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-3xl blur-xl opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse" />
                    <div className="relative w-36 h-28 sm:w-44 sm:h-32 bg-gradient-to-tr from-rose-950 via-rose-900 to-pink-900 rounded-2xl border-2 border-pink-400/40 flex items-center justify-center shadow-2xl">
                      <Mail className="w-16 h-16 text-pink-300 group-hover:scale-110 transition transform" />
                      <div className="absolute bottom-2 text-[10px] text-pink-300 font-semibold uppercase tracking-widest">
                        For My Love
                      </div>
                    </div>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold font-dancing text-white mb-2">
                    {pageData.envelopeTitle || "A Secret Letter For You 💌"}
                  </h2>
                  <p className="text-xs sm:text-sm text-pink-200/80 mb-6">
                    Click to open your handwritten digital love note
                  </p>

                  <button
                    onClick={handleOpenEnvelope}
                    className="px-8 py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold rounded-full shadow-lg flex items-center gap-2 hover:from-pink-600 transition cursor-pointer"
                  >
                    <span>{pageData.openButtonText || "Open Letter ✨"}</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Opened Letter View with Typewriter animation */
                <div className="flex flex-col items-center text-left">
                  <div className="w-full flex items-center justify-between border-b border-pink-500/30 pb-3 mb-4">
                    <span className="text-xs font-semibold uppercase tracking-widest text-pink-300 flex items-center gap-1.5">
                      <Mail className="w-4 h-4" /> Handwritten Note
                    </span>
                    <span className="text-xs text-pink-300 font-mono">Forever Yours</span>
                  </div>

                  {/* Letter Body Container */}
                  <div className="w-full bg-slate-950/70 backdrop-blur-md rounded-2xl p-5 sm:p-7 border border-pink-500/20 text-pink-100 font-poppins text-sm sm:text-base leading-relaxed whitespace-pre-wrap min-h-[220px] shadow-inner relative">
                    {typedText}
                    {!isTypingDone && (
                      <span className="inline-block w-2 h-5 bg-pink-400 ml-1 animate-pulse" />
                    )}
                  </div>

                  {/* One Last Gift Button */}
                  {isTypingDone && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="w-full mt-6"
                    >
                      <button
                        onClick={handleShowCoupon}
                        className="w-full py-4 bg-gradient-to-r from-yellow-500 via-pink-500 to-rose-600 hover:from-yellow-600 hover:to-rose-700 text-white font-bold text-lg rounded-full shadow-xl flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-98"
                      >
                        <Gift className="w-5 h-5" />
                        <span>One Last Gift 🎁</span>
                      </button>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            /* PREMIUM GOLDEN COUPON VIEW */
            <motion.div
              key="coupon-card"
              initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass-card-gold w-full rounded-3xl p-6 sm:p-10 shadow-2xl relative text-center border-2 border-yellow-400/50 flex flex-col items-center"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-300/10 to-transparent animate-pulse rounded-3xl pointer-events-none" />

              {/* Top Badge */}
              <div className="bg-yellow-500/20 border border-yellow-400/50 text-yellow-300 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 mb-4 shadow">
                <Ticket className="w-4 h-4" />
                <span>{pageData.couponTitle || "LIFETIME REWARD COUPON"}</span>
              </div>

              {/* Main Coupon Perks */}
              <div className="my-4 py-6 px-4 bg-slate-950/80 rounded-2xl border border-yellow-400/30 w-full flex flex-col items-center gap-3">
                <div className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-300 to-yellow-100 font-dancing">
                  {pageData.perk1 || "Unlimited Hugs 🫂"}
                </div>
                <div className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-yellow-200 to-rose-300 font-dancing">
                  {pageData.perk2 || "Unlimited Kisses 💋"}
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 w-full my-3 text-xs text-yellow-200/90">
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-yellow-400/20 text-left">
                  <span className="text-[10px] text-yellow-400 uppercase font-semibold block">Valid For</span>
                  <span className="font-semibold text-white">{pageData.validity || "Lifetime & Beyond"}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-yellow-400/20 text-left">
                  <span className="text-[10px] text-yellow-400 uppercase font-semibold block">Issued To</span>
                  <span className="font-semibold text-white truncate block">{pageData.couponOwner || "The Love Of My Life 👑"}</span>
                </div>
              </div>

              {/* Large Claim Coupon Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClaimCoupon}
                className="w-full mt-4 py-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-rose-600 text-slate-950 font-bold text-lg rounded-full shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <Heart className="w-5 h-5 fill-slate-950" />
                <span>Claim My Coupon 💖</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
