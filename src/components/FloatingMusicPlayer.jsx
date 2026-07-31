import React, { useState } from 'react';
import { useAudio } from '../context/AudioContext';
import { Play, Pause, Volume2, VolumeX, Repeat, Music, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingMusicPlayer() {
  const { isPlaying, togglePlay, volume, setVolume, isLooping, setIsLooping, musicTitle, hasInteracted } = useAudio();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="fixed bottom-6 right-6 z-50 select-none"
    >
      <div className="relative group">
        {/* Glow backdrop */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 rounded-full blur-md opacity-60 group-hover:opacity-100 transition duration-500 animate-pulse-glow" />

        <div className="relative flex items-center bg-slate-900/80 backdrop-blur-xl border border-pink-500/30 rounded-full px-4 py-2.5 shadow-2xl text-pink-200 gap-3">
          
          {/* Music Animated Icon */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 cursor-pointer focus:outline-none"
            title="Toggle Music Menu"
          >
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-pink-500/20 text-pink-400">
              <Music className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            </div>
            <div className="hidden sm:flex flex-col text-left pr-1">
              <span className="text-[10px] text-pink-400 font-semibold tracking-wider uppercase">Background Music</span>
              <span className="text-xs font-medium text-white truncate max-w-[120px]">{musicTitle || 'Love Song'}</span>
            </div>
          </button>

          {/* Equalizer Bars when playing */}
          <div className="flex items-end gap-0.5 h-4 px-1">
            <div className={`w-1 bg-pink-400 rounded-full transition-all duration-300 ${isPlaying ? 'h-4 animate-pulse' : 'h-1.5'}`} />
            <div className={`w-1 bg-rose-400 rounded-full transition-all duration-300 ${isPlaying ? 'h-3 animate-pulse delay-75' : 'h-2'}`} />
            <div className={`w-1 bg-purple-400 rounded-full transition-all duration-300 ${isPlaying ? 'h-4.5 animate-pulse delay-150' : 'h-1'}`} />
          </div>

          {/* Play / Pause Toggle Button */}
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white flex items-center justify-center shadow-lg transform active:scale-95 transition cursor-pointer"
            title={isPlaying ? "Pause Music" : "Play Music"}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          </button>

          {/* Expand / Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-pink-300 hover:text-white transition p-1 cursor-pointer"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Expanded Controls Popover */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: -12 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute bottom-full right-0 mb-2 w-64 bg-slate-900/90 backdrop-blur-2xl border border-pink-500/30 rounded-2xl p-4 shadow-2xl text-slate-100 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between text-xs text-pink-300 border-b border-pink-500/20 pb-2">
                <span className="font-semibold">Audio Controls</span>
                <span className="text-[11px] text-slate-400">{!hasInteracted ? 'Click anywhere to play' : isPlaying ? 'Playing' : 'Paused'}</span>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
                  className="text-pink-400 hover:text-pink-300"
                >
                  {volume === 0 ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-pink-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
                />
                <span className="text-[11px] text-pink-300 w-8 text-right">{Math.round(volume * 100)}%</span>
              </div>

              {/* Loop Toggle */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-300">Loop Track</span>
                <button
                  onClick={() => setIsLooping(!isLooping)}
                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1.5 transition ${
                    isLooping
                      ? 'bg-pink-500/20 border-pink-500 text-pink-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <Repeat className="w-3.5 h-3.5" />
                  <span>{isLooping ? 'On' : 'Off'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
