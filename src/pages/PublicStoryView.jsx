import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { DEFAULT_WEBSITE_CONFIG } from '../lib/defaultData';
import { useAudio } from '../context/AudioContext';
import FloatingParticles from '../components/FloatingParticles';
import CursorHearts from '../components/CursorHearts';
import Page1TimerProposal from './story/Page1TimerProposal';
import Page2LoveMeter from './story/Page2LoveMeter';
import Page3MemoriesTimeline from './story/Page3MemoriesTimeline';
import Page4VirtualBouquet from './story/Page4VirtualBouquet';
import Page5LoveLetterCoupon from './story/Page5LoveLetterCoupon';
import GrandFinaleEnding from './story/GrandFinaleEnding';

export default function PublicStoryView({ configOverride }) {
  const { slug } = useParams();
  const { setAudioTrack } = useAudio();
  
  const [config, setConfig] = useState(configOverride || DEFAULT_WEBSITE_CONFIG);
  const [loading, setLoading] = useState(Boolean(slug && !configOverride));
  const [currentPage, setCurrentPage] = useState(1); // Pages 1 to 5, and 6 for Finale

  useEffect(() => {
    if (configOverride) {
      setConfig(configOverride);
      if (configOverride.musicUrl) {
        setAudioTrack(configOverride.musicUrl, configOverride.musicTitle);
      }
      setLoading(false);
      return;
    }

    if (slug) {
      setLoading(true);
      api.getWebsiteBySlug(slug).then((fetched) => {
        if (fetched) {
          setConfig(fetched);
          if (fetched.musicUrl) {
            setAudioTrack(fetched.musicUrl, fetched.musicTitle);
          }
        }
        setLoading(false);
      }).catch((err) => {
        console.error('Error loading story:', err);
        setLoading(false);
      });
    } else {
      if (DEFAULT_WEBSITE_CONFIG.musicUrl) {
        setAudioTrack(DEFAULT_WEBSITE_CONFIG.musicUrl, DEFAULT_WEBSITE_CONFIG.musicTitle);
      }
      setLoading(false);
    }
  }, [slug, configOverride]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-pink-300">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-sm font-semibold tracking-widest uppercase">Loading Your Romantic Story...</span>
      </div>
    );
  }

  // Ensure config has fallback
  const safeConfig = config || DEFAULT_WEBSITE_CONFIG;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden select-none">
      
      {/* Floating Creator Dashboard Shortcut (Only shown on main home page, hidden on saved websites) */}
      {!configOverride && !slug && (
        <div className="fixed top-4 left-4 z-50">
          <a
            href="#/dashboard"
            className="px-3.5 py-2 bg-slate-900/80 hover:bg-slate-800 text-pink-300 hover:text-white border border-pink-500/30 rounded-full text-xs font-semibold flex items-center gap-2 backdrop-blur-md shadow-xl transition transform hover:scale-105"
            title="Open Creator Dashboard"
          >
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
            <span>Dashboard ⚙️</span>
          </a>
        </div>
      )}

      {/* Background Particles & Cursor Trails */}
      <FloatingParticles count={25} />
      <CursorHearts active={currentPage === 1} />

      {/* Pages Navigation Flow */}
      {currentPage === 1 && (
        <Page1TimerProposal config={safeConfig} onNext={() => setCurrentPage(2)} />
      )}

      {currentPage === 2 && (
        <Page2LoveMeter config={safeConfig} onNext={() => setCurrentPage(3)} />
      )}

      {currentPage === 3 && (
        <Page3MemoriesTimeline config={safeConfig} onNext={() => setCurrentPage(4)} />
      )}

      {currentPage === 4 && (
        <Page4VirtualBouquet config={safeConfig} onNext={() => setCurrentPage(5)} />
      )}

      {currentPage === 5 && (
        <Page5LoveLetterCoupon config={safeConfig} onClaimCoupon={() => setCurrentPage(6)} />
      )}

      {currentPage === 6 && (
        <GrandFinaleEnding config={safeConfig} />
      )}

    </div>
  );
}
