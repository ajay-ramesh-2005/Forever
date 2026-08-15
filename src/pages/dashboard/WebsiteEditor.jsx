import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { DEFAULT_WEBSITE_CONFIG } from '../../lib/defaultData';
import { uploadMediaFile } from '../../lib/storage';
import PublicStoryView from '../PublicStoryView';
import DeviceFrame from '../../components/DeviceFrame';
import {
  Save,
  ArrowLeft,
  Heart,
  Music,
  Calendar,
  Sparkles,
  Image as ImageIcon,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Eye,
  Settings,
  CheckCircle,
  Upload,
  Download
} from 'lucide-react';
import { downloadWebsiteHTML } from '../../lib/exportWebsite';

export default function WebsiteEditor({ editExisting = false }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { websites, saveWebsite } = useStore();

  // Find existing config or initialize new
  const initialConfig = editExisting && slug
    ? websites.find(w => w.slug === slug || w.id === slug) || DEFAULT_WEBSITE_CONFIG
    : { ...DEFAULT_WEBSITE_CONFIG, id: '', slug: '', title: "My Love Story 💖", girlfriendName: "My Angel" };

  const [form, setForm] = useState(initialConfig);
  const [activeTab, setActiveTab] = useState('general'); // general, proposal, memories, bouquet_letter, finale, preview
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (path, value) => {
    setForm(prev => {
      const copy = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let curr = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        const nextKey = parts[i + 1];
        const isNextKeyIndex = !isNaN(Number(nextKey));
        if (!curr[key]) {
          curr[key] = isNextKeyIndex ? [] : {};
        }
        curr = curr[key];
      }
      curr[parts[parts.length - 1]] = value;
      return copy;
    });
  };

  // Upload handler for files (photos / audio)
  const handleFileUpload = async (e, path) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadedUrl = await uploadMediaFile(file);
      if (uploadedUrl) {
        handleChange(path, uploadedUrl);
      }
    } catch (err) {
      console.error('File upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  // Memory Array Helpers
  const addMemory = () => {
    const newMem = {
      id: 'mem-' + Date.now(),
      date: 'Special Day',
      title: 'New Romantic Memory 💕',
      description: 'Describe this magical moment together...',
      imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80'
    };
    setForm(prev => ({
      ...prev,
      memories: [...(prev.memories || []), newMem]
    }));
  };

  const updateMemory = (index, field, value) => {
    setForm(prev => {
      const newMems = [...(prev.memories || [])];
      newMems[index] = { ...newMems[index], [field]: value };
      return { ...prev, memories: newMems };
    });
  };

  const removeMemory = (index) => {
    setForm(prev => ({
      ...prev,
      memories: (prev.memories || []).filter((_, i) => i !== index)
    }));
  };

  const moveMemory = (index, direction) => {
    const mems = [...(form.memories || [])];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= mems.length) return;
    const temp = mems[index];
    mems[index] = mems[targetIdx];
    mems[targetIdx] = temp;
    setForm(prev => ({ ...prev, memories: mems }));
  };

  // Save Website Submit
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const saved = await saveWebsite(form);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      navigate(`/dashboard/saved`);
    } catch (err) {
      console.error('Failed to save website:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 relative">
      
      {/* ALWAYS VISIBLE STICKY TOP-RIGHT FLOATING ACTION BUTTONS */}
      <div className="fixed top-20 right-4 sm:right-8 z-50 flex items-center gap-2">
        <button
          onClick={() => downloadWebsiteHTML(form)}
          className="px-4 py-3 bg-slate-900/90 hover:bg-slate-800 text-pink-300 font-bold text-xs sm:text-sm rounded-full shadow-xl border border-pink-500/40 backdrop-blur-md flex items-center gap-1.5 transition cursor-pointer"
          title="Download Standalone HTML Code"
        >
          <Download className="w-4 h-4 text-pink-400" />
          <span className="hidden sm:inline">Download Code</span>
        </button>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-3 sm:px-6 sm:py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs sm:text-sm rounded-full shadow-2xl shadow-pink-500/40 border border-pink-400/40 flex items-center gap-2 transition cursor-pointer transform active:scale-95 animate-pulse-glow"
        >
          {saveSuccess ? (
            <>
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{saving ? 'Saving...' : 'Save & Publish Website'}</span>
            </>
          )}
        </button>
      </div>

      {/* Header Bar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800 pr-36 sm:pr-48">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard/saved')}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              {editExisting ? 'Edit Romantic Story' : 'Create New Romantic Website'} 💖
            </h1>
            <p className="text-xs text-pink-300">Customize every text, timer, photo, letter, and ending!</p>
          </div>
        </div>
      </div>

      {/* Editor Navigation Tabs */}
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-slate-800/80">
        {[
          { id: 'general', label: 'Basic Info & Timer', icon: Calendar },
          { id: 'proposal', label: 'Proposal & Love Meter', icon: Heart },
          { id: 'memories', label: 'Memories Timeline', icon: ImageIcon },
          { id: 'bouquet_letter', label: 'Bouquet & Letter', icon: Sparkles },
          { id: 'finale', label: 'Grand Finale & Theme', icon: Settings },
          { id: 'preview', label: 'Live Device Preview', icon: Eye }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto">
        
        {/* TAB 1: General Info & Timer */}
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-pink-500/20 space-y-4">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Heart className="w-5 h-5 text-pink-400" /> Basic Details
              </h2>

              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1">Website Title (Internal)</label>
                <input
                  type="text"
                  value={form.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-pink-500 focus:outline-none"
                  placeholder="Girlfriend Day 2026"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1">Girlfriend's Name (Her Name)</label>
                <input
                  type="text"
                  value={form.girlfriendName || ''}
                  onChange={(e) => handleChange('girlfriendName', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-pink-500 focus:outline-none"
                  placeholder="Sophia"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1">Custom URL Slug</label>
                <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-400">
                  <span>/love/</span>
                  <input
                    type="text"
                    value={form.slug || ''}
                    onChange={(e) => handleChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="bg-transparent text-white focus:outline-none ml-1 w-full"
                    placeholder="forever-us"
                  />
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-pink-500/20 space-y-4">
              <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-pink-400" /> Relationship Timer & Background Music
              </h2>

              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1 flex items-center justify-between">
                  <span>Relationship Start Date & Time (Editable Text & Calendar)</span>
                  <span className="text-[11px] text-pink-400 font-normal">Type or pick any date/time</span>
                </label>

                {/* Dedicated Date & Time Controls */}
                <div className="space-y-3 mb-4">
                  {/* Direct Text String */}
                  <div>
                    <span className="text-[11px] text-pink-300 font-semibold block mb-1">Direct Editable Text String:</span>
                    <input
                      type="text"
                      value={form.startDate || ''}
                      onChange={(e) => handleChange('startDate', e.target.value)}
                      placeholder="e.g. 2023-08-01T00:00:00.000Z or August 1, 2023"
                      className="w-full bg-slate-900 border border-pink-500/30 rounded-xl px-4 py-2.5 text-sm text-white focus:border-pink-500 focus:outline-none shadow font-mono"
                    />
                  </div>

                  {/* Dual Calendar & Time Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold block mb-1">Calendar Date Picker:</span>
                      <input
                        type="date"
                        value={(() => {
                          if (!form.startDate) return '';
                          const d = new Date(form.startDate);
                          if (isNaN(d.getTime())) return '';
                          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                        })()}
                        onChange={(e) => {
                          const newDateStr = e.target.value;
                          if (!newDateStr) return;
                          const existing = new Date(form.startDate || Date.now());
                          const hours = isNaN(existing.getTime()) ? 0 : existing.getHours();
                          const minutes = isNaN(existing.getTime()) ? 0 : existing.getMinutes();
                          const parts = newDateStr.split('-').map(Number);
                          const updated = new Date(parts[0], parts[1] - 1, parts[2], hours, minutes);
                          handleChange('startDate', updated.toISOString());
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-pink-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400 font-semibold block mb-1">Time Picker (HH:MM):</span>
                      <input
                        type="time"
                        value={(() => {
                          if (!form.startDate) return '00:00';
                          const d = new Date(form.startDate);
                          if (isNaN(d.getTime())) return '00:00';
                          return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
                        })()}
                        onChange={(e) => {
                          const timeStr = e.target.value;
                          if (!timeStr) return;
                          const existing = new Date(form.startDate || Date.now());
                          const baseDate = isNaN(existing.getTime()) ? new Date() : existing;
                          const [hrs, mins] = timeStr.split(':').map(Number);
                          const updated = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate(), hrs, mins);
                          handleChange('startDate', updated.toISOString());
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-pink-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Calendar Presets */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[11px] text-slate-400 font-semibold block">Quick Presets:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: '6 Months Ago', months: 6 },
                      { label: '1 Year Ago', years: 1 },
                      { label: '2 Years Ago', years: 2 },
                      { label: '3 Years Ago', years: 3 },
                      { label: '5 Years Ago', years: 5 }
                    ].map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          if (preset.years) d.setFullYear(d.getFullYear() - preset.years);
                          if (preset.months) d.setMonth(d.getMonth() - preset.months);
                          handleChange('startDate', d.toISOString());
                        }}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-pink-500/20 border border-slate-700 hover:border-pink-500/40 rounded-lg text-[11px] text-pink-300 font-medium transition cursor-pointer"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Countdown Counter Preview Box */}
                {(() => {
                  const start = new Date(form.startDate || Date.now());
                  const now = new Date();
                  let totalSecs = Math.max(0, Math.floor((now - start) / 1000));
                  const yrs = Math.floor(totalSecs / (365.25 * 24 * 3600));
                  totalSecs %= Math.floor(365.25 * 24 * 3600);
                  const mos = Math.floor(totalSecs / (30.4375 * 24 * 3600));
                  totalSecs %= Math.floor(30.4375 * 24 * 3600);
                  const dys = Math.floor(totalSecs / (24 * 3600));
                  totalSecs %= (24 * 3600);
                  const hrs = Math.floor(totalSecs / 3600);
                  totalSecs %= 3600;
                  const mins = Math.floor(totalSecs / 60);

                  return (
                    <div className="bg-slate-900/90 border border-pink-500/30 rounded-xl p-3.5 shadow-inner">
                      <span className="text-[11px] font-semibold text-pink-300 uppercase tracking-wider block mb-2">
                        Live Calculated Countdown Preview:
                      </span>
                      <div className="grid grid-cols-5 gap-1.5 text-center">
                        <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                          <span className="text-sm font-bold text-pink-300 block font-mono">{yrs}</span>
                          <span className="text-[9px] text-slate-400 font-medium">Yrs</span>
                        </div>
                        <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                          <span className="text-sm font-bold text-pink-300 block font-mono">{mos}</span>
                          <span className="text-[9px] text-slate-400 font-medium">Mos</span>
                        </div>
                        <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                          <span className="text-sm font-bold text-pink-300 block font-mono">{dys}</span>
                          <span className="text-[9px] text-slate-400 font-medium">Days</span>
                        </div>
                        <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                          <span className="text-sm font-bold text-pink-300 block font-mono">{hrs}</span>
                          <span className="text-[9px] text-slate-400 font-medium">Hrs</span>
                        </div>
                        <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                          <span className="text-sm font-bold text-pink-300 block font-mono">{mins}</span>
                          <span className="text-[9px] text-slate-400 font-medium">Mins</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <p className="text-[11px] text-slate-400 mt-2">The live love counter automatically updates years, months, days, hours, minutes, seconds from this date.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1">Background Music Track URL</label>
                <input
                  type="text"
                  value={form.musicUrl || ''}
                  onChange={(e) => handleChange('musicUrl', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-pink-500 focus:outline-none"
                  placeholder="https://..."
                />
                <div className="mt-2 flex items-center gap-2">
                  <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-medium text-pink-300 cursor-pointer flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Audio File</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileUpload(e, 'musicUrl')}
                      className="hidden"
                    />
                  </label>
                  {uploading && <span className="text-xs text-pink-400 animate-pulse">Uploading audio...</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Proposal & Love Meter */}
        {activeTab === 'proposal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-pink-500/20 space-y-4">
              <h2 className="text-lg font-bold text-white mb-2">Page 1: Proposal Card Texts</h2>
              
              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1">Timer Header Text</label>
                <input
                  type="text"
                  value={form.page1?.title || ''}
                  onChange={(e) => handleChange('page1.title', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1">Main Proposal Question</label>
                <input
                  type="text"
                  value={form.page1?.question || ''}
                  onChange={(e) => handleChange('page1.question', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1">Cute Subtitle</label>
                <input
                  type="text"
                  value={form.page1?.subtitle || ''}
                  onChange={(e) => handleChange('page1.subtitle', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1">Escaping NO Button Funny Captions</label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(form.page1?.noCaptions || []).map((cap, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={cap}
                        onChange={(e) => {
                          const newCaps = [...form.page1.noCaptions];
                          newCaps[idx] = e.target.value;
                          handleChange('page1.noCaptions', newCaps);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                      <button
                        onClick={() => {
                          const newCaps = form.page1.noCaptions.filter((_, i) => i !== idx);
                          handleChange('page1.noCaptions', newCaps);
                        }}
                        className="p-1.5 text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newCaps = [...(form.page1?.noCaptions || []), "Nice try! 😉"];
                      handleChange('page1.noCaptions', newCaps);
                    }}
                    className="text-xs text-pink-400 hover:underline font-semibold flex items-center gap-1 mt-2"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Caption
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-pink-500/20 space-y-4">
              <h2 className="text-lg font-bold text-white mb-2">Page 2: Interactive Love Meter</h2>

              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1">Top Message</label>
                <input
                  type="text"
                  value={form.page2?.topMessage || ''}
                  onChange={(e) => handleChange('page2.topMessage', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1">Target Clicks to Reach 100%</label>
                <input
                  type="number"
                  value={form.page2?.targetClicks || 70}
                  onChange={(e) => handleChange('page2.targetClicks', parseInt(e.target.value) || 70)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1">Completion Celebration Popup Text</label>
                <input
                  type="text"
                  value={form.page2?.completionPopup || ''}
                  onChange={(e) => handleChange('page2.completionPopup', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Memories Timeline */}
        {activeTab === 'memories' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-pink-400" /> Unlimited Memory Cards
              </h2>
              <button
                onClick={addMemory}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" /> Add New Memory
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(form.memories || []).map((mem, idx) => (
                <div key={mem.id || idx} className="glass-panel p-5 rounded-2xl border border-pink-500/20 space-y-3 relative">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-bold text-pink-300">Memory #{idx + 1}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveMemory(idx, -1)}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveMemory(idx, 1)}
                        disabled={idx === form.memories.length - 1}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeMemory(idx)}
                        className="p-1 text-rose-400 hover:text-rose-300 ml-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Date</label>
                    <input
                      type="text"
                      value={mem.date || ''}
                      onChange={(e) => updateMemory(idx, 'date', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Title</label>
                    <input
                      type="text"
                      value={mem.title || ''}
                      onChange={(e) => updateMemory(idx, 'title', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={mem.description || ''}
                      onChange={(e) => updateMemory(idx, 'description', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">Photo Image URL (16:9 Ratio)</label>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={mem.imageUrl || ''}
                        onChange={(e) => updateMemory(idx, 'imageUrl', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                      <label className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-pink-300 cursor-pointer flex items-center shrink-0">
                        <Upload className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, `memories.${idx}.imageUrl`)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* 16:9 Photo Thumbnail Preview */}
                    {mem.imageUrl && (
                      <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden border border-pink-500/30 bg-slate-950">
                        <img
                          src={mem.imageUrl}
                          alt={mem.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <span className="absolute bottom-1 right-1 bg-slate-950/80 px-2 py-0.5 rounded text-[9px] text-pink-300 font-mono">16:9</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Bouquet & Letter */}
        {activeTab === 'bouquet_letter' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-pink-500/20 space-y-4">
              <h2 className="text-lg font-bold text-white mb-2">Page 4: Virtual Bouquet</h2>

              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1">Bouquet Message</label>
                <textarea
                  rows={3}
                  value={form.page4?.message || ''}
                  onChange={(e) => handleChange('page4.message', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1">Accept Button Text</label>
                <input
                  type="text"
                  value={form.page4?.buttonText || ''}
                  onChange={(e) => handleChange('page4.buttonText', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1">Bouquet Image URL</label>
                <input
                  type="text"
                  value={form.page4?.bouquetImage || ''}
                  onChange={(e) => handleChange('page4.bouquetImage', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-pink-500/20 space-y-4">
              <h2 className="text-lg font-bold text-white mb-2">Page 5: Love Letter & Golden Coupon</h2>

              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1">Envelope Title</label>
                <input
                  type="text"
                  value={form.page5?.envelopeTitle || ''}
                  onChange={(e) => handleChange('page5.envelopeTitle', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1">Love Letter Content</label>
                <textarea
                  rows={6}
                  value={form.page5?.letterText || ''}
                  onChange={(e) => handleChange('page5.letterText', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-pink-300 mb-1">Coupon Perk 1</label>
                  <input
                    type="text"
                    value={form.page5?.perk1 || ''}
                    onChange={(e) => handleChange('page5.perk1', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-pink-300 mb-1">Coupon Perk 2</label>
                  <input
                    type="text"
                    value={form.page5?.perk2 || ''}
                    onChange={(e) => handleChange('page5.perk2', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Grand Finale & Theme */}
        {activeTab === 'finale' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-pink-500/20 space-y-4">
              <h2 className="text-lg font-bold text-white mb-2">Grand Finale Fireworks & Text</h2>

              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1">Fireworks Heading</label>
                <input
                  type="text"
                  value={form.ending?.fireworkHeading || ''}
                  onChange={(e) => handleChange('ending.fireworkHeading', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1">Giant Glowing Cursive Name</label>
                <input
                  type="text"
                  value={form.ending?.herName || ''}
                  onChange={(e) => handleChange('ending.herName', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1">Sub Heading</label>
                <input
                  type="text"
                  value={form.ending?.subHeading || ''}
                  onChange={(e) => handleChange('ending.subHeading', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1">Final Climax Message</label>
                <input
                  type="text"
                  value={form.ending?.finalNote || ''}
                  onChange={(e) => handleChange('ending.finalNote', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-pink-300 mb-1">Footer Text</label>
                <input
                  type="text"
                  value={form.ending?.footerText || ''}
                  onChange={(e) => handleChange('ending.footerText', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-pink-500/20 space-y-4">
              <h2 className="text-lg font-bold text-white mb-2">Theme Palette & Styling</h2>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Primary Color</label>
                  <input
                    type="color"
                    value={form.theme?.primaryColor || '#f43f5e'}
                    onChange={(e) => handleChange('theme.primaryColor', e.target.value)}
                    className="w-full h-10 bg-slate-900 border border-slate-800 rounded-lg p-1 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Secondary Color</label>
                  <input
                    type="color"
                    value={form.theme?.secondaryColor || '#ec4899'}
                    onChange={(e) => handleChange('theme.secondaryColor', e.target.value)}
                    className="w-full h-10 bg-slate-900 border border-slate-800 rounded-lg p-1 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">Accent Color</label>
                  <input
                    type="color"
                    value={form.theme?.accentColor || '#a855f7'}
                    onChange={(e) => handleChange('theme.accentColor', e.target.value)}
                    className="w-full h-10 bg-slate-900 border border-slate-800 rounded-lg p-1 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Live Device Preview */}
        {activeTab === 'preview' && (
          <DeviceFrame
            publicSlug={form.slug}
            onSave={handleSave}
            saving={saving}
            saveSuccess={saveSuccess}
          >
            <PublicStoryView configOverride={form} />
          </DeviceFrame>
        )}

      </div>
    </div>
  );
}
