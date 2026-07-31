import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isLooping, setIsLooping] = useState(true);
  const [musicUrl, setMusicUrl] = useState("https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=romantic-piano-112199.mp3");
  const [musicTitle, setMusicTitle] = useState("Romantic Piano Melody");
  const [hasInteracted, setHasInteracted] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    try {
      const audio = new Audio();
      audio.loop = isLooping;
      audio.volume = volume;
      audioRef.current = audio;

      const handleAudioError = (e) => {
        console.warn('Audio playback error (continuing app without sound):', e);
        setIsPlaying(false);
      };

      audio.addEventListener('error', handleAudioError);

      return () => {
        audio.removeEventListener('error', handleAudioError);
        audio.pause();
        audio.src = '';
      };
    } catch (e) {
      console.warn('Audio API unavailable:', e);
    }
  }, []);

  // Update src when musicUrl changes
  useEffect(() => {
    if (audioRef.current && musicUrl) {
      try {
        const wasPlaying = isPlaying;
        audioRef.current.src = musicUrl;
        if (wasPlaying || hasInteracted) {
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch((err) => {
              console.warn('Autoplay prevented or network error:', err);
              setIsPlaying(false);
            });
        }
      } catch (err) {
        console.warn('Error setting audio src:', err);
      }
    }
  }, [musicUrl]);

  // Sync volume & loop
  useEffect(() => {
    if (audioRef.current) {
      try {
        audioRef.current.volume = volume;
      } catch (e) {}
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      try {
        audioRef.current.loop = isLooping;
      } catch (e) {}
    }
  }, [isLooping]);

  // Autoplay unlock on first user interaction anywhere in the window
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        if (audioRef.current && audioRef.current.src) {
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(err => console.log('Autoplay play error:', err));
        }
      }
    };

    window.addEventListener('click', handleFirstInteraction, { once: true });
    window.addEventListener('touchstart', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [hasInteracted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error('Play error:', err));
    }
  };

  const setAudioTrack = (url, title = 'Background Music') => {
    if (url) setMusicUrl(url);
    if (title) setMusicTitle(title);
  };

  return (
    <AudioContext.Provider value={{
      isPlaying,
      togglePlay,
      volume,
      setVolume,
      isLooping,
      setIsLooping,
      musicTitle,
      setAudioTrack,
      hasInteracted
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
}
