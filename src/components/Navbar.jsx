import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getPublicHref } from '../lib/utils';
import { Heart, Plus, FolderHeart, Settings, LayoutDashboard, ExternalLink } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const path = location.pathname;

  // Don't show Dashboard navbar when viewing public story `/love/:slug` or `/:slug` or root `/`
  if (path === '/' || path.startsWith('/love/') || (!path.startsWith('/dashboard') && path !== '/login')) return null;

  return (
    <header className="bg-slate-950/80 backdrop-blur-xl border-b border-pink-500/20 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Brand */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition transform">
            <Heart className="w-4 h-4 fill-white" />
          </div>
          <span className="text-xl font-bold font-dancing text-white tracking-wide">
            Forever Us <span className="text-xs font-poppins text-pink-400 font-normal">Studio</span>
          </span>
        </Link>

        {/* Links */}
        <nav className="flex items-center gap-1 sm:gap-2 text-xs font-semibold">
          <Link
            to="/dashboard"
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              path === '/dashboard' ? 'bg-pink-500/20 border border-pink-500/40 text-pink-300' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <Link
            to="/dashboard/create"
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              path === '/dashboard/create' ? 'bg-pink-500/20 border border-pink-500/40 text-pink-300' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <Plus className="w-4 h-4 text-pink-400" />
            <span className="hidden sm:inline">Create New</span>
          </Link>

          <Link
            to="/dashboard/saved"
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              path === '/dashboard/saved' ? 'bg-pink-500/20 border border-pink-500/40 text-pink-300' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <FolderHeart className="w-4 h-4 text-pink-400" />
            <span className="hidden sm:inline">Saved Websites</span>
          </Link>

          <Link
            to="/dashboard/settings"
            className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition ${
              path === '/dashboard/settings' ? 'bg-pink-500/20 border border-pink-500/40 text-pink-300' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>

          <a
            href={getPublicHref('forever-us')}
            target="_blank"
            rel="noreferrer"
            className="ml-2 px-3.5 py-2 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl flex items-center gap-1.5 shadow transition hover:opacity-90"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Live Demo</span>
          </a>
        </nav>

      </div>
    </header>
  );
}
