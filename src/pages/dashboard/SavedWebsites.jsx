import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { getPublicUrl, getPublicHref } from '../../lib/utils';
import {
  ExternalLink,
  Edit,
  Copy,
  Trash2,
  Plus,
  Share2,
  Calendar,
  Sparkles,
  Heart,
  Check
} from 'lucide-react';

export default function SavedWebsites() {
  const { websites, deleteWebsite, duplicateWebsite, loading } = useStore();
  const navigate = useNavigate();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyLink = (slug, id) => {
    const url = getPublicUrl(slug);
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            Saved Websites 💖
          </h1>
          <p className="text-xs text-pink-300">Manage, preview, edit, share, or duplicate your digital love stories</p>
        </div>

        <button
          onClick={() => navigate('/dashboard/create')}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm rounded-xl shadow-lg flex items-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Website</span>
        </button>
      </div>

      {/* Grid of Saved Websites */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-16 text-pink-300">
            <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span className="text-sm">Loading your saved websites...</span>
          </div>
        ) : websites.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl max-w-lg mx-auto border border-pink-500/20">
            <Heart className="w-16 h-16 text-pink-400 mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-white mb-2">No Websites Created Yet</h3>
            <p className="text-xs text-pink-200/80 mb-6">Create your very first Girlfriend's Day digital gift experience now!</p>
            <button
              onClick={() => navigate('/dashboard/create')}
              className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold text-sm rounded-xl transition"
            >
              Get Started Now ✨
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websites.map((ws) => (
              <div
                key={ws.id}
                className="glass-panel-pink rounded-2xl p-6 border border-pink-500/30 flex flex-col justify-between hover:border-pink-500/60 transition group shadow-xl"
              >
                <div>
                  {/* Top Badge & Slug */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-pink-500/20 text-pink-300 border border-pink-500/30 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      /love/{ws.slug}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-pink-400" />
                      {ws.updated_at ? new Date(ws.updated_at).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  {/* Title & Girlfriend Name */}
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-pink-300 transition">
                    {ws.title || ws.girlfriendName}
                  </h3>
                  
                  <p className="text-xs text-pink-200/80 mb-4 font-medium">
                    Created for: <span className="text-white font-semibold">{ws.girlfriendName}</span>
                  </p>
                </div>

                {/* Action Buttons Bar */}
                <div className="space-y-3 pt-4 border-t border-pink-500/20">
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={getPublicHref(ws.slug)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Website</span>
                    </a>

                    <button
                      onClick={() => navigate(`/dashboard/edit/${ws.slug}`)}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Story</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => handleCopyLink(ws.slug, ws.id)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      {copiedId === ws.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5 text-pink-400" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => duplicateWebsite(ws)}
                        className="p-2 text-slate-400 hover:text-pink-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg transition"
                        title="Duplicate Website"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${ws.title}"?`)) {
                            deleteWebsite(ws.id);
                          }
                        }}
                        className="p-2 text-rose-400 hover:text-rose-300 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg transition"
                        title="Delete Website"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
