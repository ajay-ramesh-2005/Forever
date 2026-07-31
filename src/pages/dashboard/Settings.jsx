import React, { useState } from 'react';
import {
  isSupabaseConfigured,
  getSupabaseCredentials,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  testSupabaseConnection
} from '../../lib/supabase';
import { api } from '../../lib/api';
import { useStore } from '../../context/StoreContext';
import { Database, ShieldCheck, Key, CheckCircle2, AlertCircle, RefreshCw, Trash2, PlugZap, UploadCloud, Heart } from 'lucide-react';

export default function Settings() {
  const currentCreds = getSupabaseCredentials();
  const { refreshWebsites, websites } = useStore();

  const [url, setUrl] = useState(currentCreds.url);
  const [anonKey, setAnonKey] = useState(currentCreds.anonKey);
  const [status, setStatus] = useState(isSupabaseConfigured ? 'connected' : 'disconnected');
  const [testing, setTesting] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text: '' }
  const [pushFeedback, setPushFeedback] = useState(null);

  const handleConnect = async (e) => {
    e.preventDefault();
    setTesting(true);
    setFeedback(null);

    if (!url.trim() || !anonKey.trim()) {
      setFeedback({ type: 'error', text: 'Please enter both Supabase URL and Anon Key.' });
      setTesting(false);
      return;
    }

    saveSupabaseCredentials(url, anonKey);
    const testResult = await testSupabaseConnection();

    if (testResult.success) {
      setStatus('connected');
      setFeedback({ type: 'success', text: testResult.message });
      refreshWebsites();
    } else {
      setStatus('error');
      setFeedback({ type: 'error', text: `Connection Warning: ${testResult.message}. (Ensure schema.sql has been run in Supabase SQL Editor)` });
    }
    setTesting(false);
  };

  const handleDisconnect = () => {
    clearSupabaseCredentials();
    setUrl('');
    setAnonKey('');
    setStatus('disconnected');
    setFeedback({ type: 'success', text: 'Supabase credentials cleared. Switched to standalone mode.' });
    refreshWebsites();
  };

  // Push ALL available local & default websites to Supabase Database
  const handlePushAllToSupabase = async () => {
    setPushing(true);
    setPushFeedback(null);

    try {
      const result = await api.syncAllWebsitesToSupabase();
      if (result.success) {
        setPushFeedback({ type: 'success', text: result.message });
        refreshWebsites();
      } else {
        setPushFeedback({ type: 'error', text: result.message });
      }
    } catch (err) {
      setPushFeedback({ type: 'error', text: err.message || 'Failed to push websites to Supabase.' });
    } finally {
      setPushing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="pb-4 border-b border-slate-800">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            Dashboard Settings ⚙️
          </h1>
          <p className="text-xs text-pink-300">Connect your live Supabase cloud database and sync all your website data in 1 click</p>
        </div>

        {/* Database Status Card */}
        <div className="glass-panel p-6 rounded-2xl border border-pink-500/20 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-pink-400" /> Database Connection Status
          </h2>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span className="text-slate-300 font-semibold">Supabase Environment Status:</span>
              <span className={`font-bold px-3 py-1 rounded-full text-[11px] flex items-center gap-1.5 ${
                status === 'connected'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                  : 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-300'
              }`}>
                {status === 'connected' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Connected to Supabase Cloud ({currentCreds.source})</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Standalone Storage / Local Mode</span>
                  </>
                )}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-slate-300 font-semibold">Total Saved Websites Available:</span>
              <span className="text-pink-300 font-bold font-mono">
                {websites.length} website(s)
              </span>
            </div>
          </div>
        </div>

        {/* ONE-CLICK PUSH EVERYTHING TO SUPABASE BUTTON CARD */}
        <div className="glass-card-gold p-6 sm:p-8 rounded-3xl border-2 border-yellow-400/40 shadow-2xl space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-yellow-400/20 pb-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 font-dancing">
              <UploadCloud className="w-6 h-6 text-yellow-400" /> Push All Data & Websites to Supabase Cloud
            </h2>
            <span className="bg-yellow-500/20 border border-yellow-400/40 text-yellow-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              1-Click Sync
            </span>
          </div>

          <p className="text-xs text-yellow-100/90 leading-relaxed">
            Click the button below to immediately push all your locally saved websites, proposal texts, relationship timers, memory photo cards, letters, coupons, and grand finale settings directly into your <strong>Supabase Cloud Database</strong>!
          </p>

          {pushFeedback && (
            <div className={`p-3.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
              pushFeedback.type === 'success'
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
            }`}>
              {pushFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              <span>{pushFeedback.text}</span>
            </div>
          )}

          <button
            onClick={handlePushAllToSupabase}
            disabled={pushing || !isSupabaseConfigured}
            className={`w-full py-4 font-bold text-sm sm:text-base rounded-2xl shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-98 ${
              isSupabaseConfigured
                ? 'bg-gradient-to-r from-yellow-400 via-pink-500 to-rose-600 hover:from-yellow-500 hover:to-rose-700 text-slate-950 shadow-yellow-500/30'
                : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
            }`}
          >
            {pushing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
                <span>Pushing All Data to Supabase Database...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-5 h-5 text-slate-950" />
                <span>{isSupabaseConfigured ? 'Push Everything to Supabase Database NOW 🚀' : 'Connect Supabase Credentials Below First ⚙️'}</span>
              </>
            )}
          </button>
        </div>

        {/* Live Supabase Connection Credentials Form */}
        <div className="glass-panel-pink p-6 sm:p-8 rounded-3xl border border-pink-500/30 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-pink-500/20 pb-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 font-dancing">
              <PlugZap className="w-5 h-5 text-pink-400" /> Supabase Connection Credentials
            </h2>
            {isSupabaseConfigured && (
              <button
                onClick={handleDisconnect}
                className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            )}
          </div>

          <p className="text-xs text-pink-200/90 leading-relaxed">
            Enter your <strong>Supabase URL</strong> and <strong>Anon Key</strong> below. Once connected, all your website configurations, custom stories, and uploaded photos automatically sync with your live Supabase cloud database!
          </p>

          <form onSubmit={handleConnect} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-pink-300 mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. https://your-project-ref.supabase.co"
                className="w-full bg-slate-900 border border-pink-500/30 rounded-xl px-4 py-3 text-sm text-white focus:border-pink-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-pink-300 mb-1">
                Supabase Anon Public Key
              </label>
              <textarea
                rows={3}
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="e.g. eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-slate-900 border border-pink-500/30 rounded-xl p-3 text-xs text-white focus:border-pink-500 focus:outline-none font-mono"
              />
            </div>

            {feedback && (
              <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                feedback.type === 'success'
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
              }`}>
                {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{feedback.text}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={testing}
              className="w-full py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition"
            >
              {testing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Connecting & Testing Database...</span>
                </>
              ) : (
                <>
                  <PlugZap className="w-4 h-4" />
                  <span>Test & Connect to Supabase 🚀</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Helpful instructions */}
        <div className="glass-panel p-6 rounded-2xl border border-pink-500/20 space-y-3 text-xs text-slate-300">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Key className="w-4 h-4 text-pink-400" /> Need Help Getting Your Supabase Keys?
          </h3>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
            <li>Go to <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-pink-400 underline">supabase.com/dashboard</a> and open your project.</li>
            <li>Go to <strong>Project Settings → API</strong>.</li>
            <li>Copy <strong>Project URL</strong> and paste it into the URL field above.</li>
            <li>Copy <strong>`anon` `public` key</strong> and paste it into the Anon Key field above.</li>
            <li>Click <strong>Test & Connect</strong>!</li>
          </ol>
        </div>

      </div>

    </div>
  );
}
