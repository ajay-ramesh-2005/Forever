import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { Heart, Plus, Sparkles, FolderHeart, Globe, CheckCircle2, ArrowRight } from 'lucide-react';

export default function DashboardHome() {
  const { websites } = useStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Hero Banner */}
        <div className="glass-panel-pink rounded-3xl p-8 sm:p-10 border border-pink-500/30 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 z-10 max-w-xl text-center md:text-left">
            <span className="bg-pink-500/20 text-pink-300 border border-pink-500/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Forever Us Creator Studio
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold font-dancing text-white">
              Craft Unforgettable Romantic Stories 💕
            </h1>
            <p className="text-xs sm:text-sm text-pink-200/90 font-normal leading-relaxed">
              Create award-winning interactive digital gifts for Girlfriend's Day. Add your relationship timer, custom escaping NO button, love meter, memories timeline, bouquet, letter, and grand fireworks finale!
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => navigate('/dashboard/create')}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm rounded-xl shadow-lg flex items-center gap-2 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Website</span>
              </button>

              <button
                onClick={() => navigate('/dashboard/saved')}
                className="px-6 py-3 bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-pink-200 font-semibold text-sm rounded-xl transition flex items-center gap-2"
              >
                <FolderHeart className="w-4 h-4 text-pink-400" />
                <span>View Saved ({websites.length})</span>
              </button>
            </div>
          </div>

          <div className="relative z-10 w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-tr from-pink-500/30 to-purple-500/30 rounded-full blur-2xl flex items-center justify-center pointer-events-none">
            <Heart className="w-32 h-32 text-pink-400/80 fill-pink-500/30 animate-pulse" />
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-pink-500/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-pink-300 font-semibold uppercase">Total Websites</span>
              <h3 className="text-2xl font-bold text-white">{websites.length}</h3>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-pink-500/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-purple-300 font-semibold uppercase">Supabase Integration</span>
              <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Ready & Connected
              </h3>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-pink-500/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-rose-300 font-semibold uppercase">Default Template</span>
              <h3 className="text-sm font-bold text-white">Forever Us Standard</h3>
            </div>
          </div>
        </div>

        {/* Quick Recent Websites */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Recent Websites</h2>
            <button
              onClick={() => navigate('/dashboard/saved')}
              className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1"
            >
              <span>See All</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {websites.slice(0, 4).map((ws) => (
              <div
                key={ws.id}
                onClick={() => navigate(`/dashboard/edit/${ws.slug}`)}
                className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-pink-500/40 transition cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-white text-base">{ws.title || ws.girlfriendName}</h4>
                  <span className="text-xs text-pink-300 font-mono">/love/{ws.slug}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-pink-400" />
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
