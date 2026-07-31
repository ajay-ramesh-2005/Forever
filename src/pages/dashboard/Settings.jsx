import React, { useState, useEffect } from 'react';
import {
  isSupabaseConfigured,
  getSupabaseCredentials,
  saveSupabaseCredentials,
  clearSupabaseCredentials,
  testSupabaseConnection
} from '../../lib/supabase';
import { Database, ShieldCheck, Key, CheckCircle2, AlertCircle, RefreshCw, Trash2, PlugZap } from 'lucide-react';

export default function Settings() {
  const currentCreds = getSupabaseCredentials();
  
  const [url, setUrl] = useState(currentCreds.url);
  const [anonKey, setAnonKey] = useState(currentCreds.anonKey);
  const [status, setStatus] = useState(isSupabaseConfigured ? 'connected' : 'disconnected');
  const [testing, setTesting] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text: '' }

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
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="pb-4 border-b border-slate-800">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            Dashboard Settings ⚙️
          </h1>
          <p className="text-xs text-pink-300">Connect your live Supabase cloud database directly from GitHub Pages or local environment</p>
        </div>

        {/* Status Card */}
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
              <span className="text-slate-300 font-semibold">Express Server / Browser Local Storage:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Active Fallback Ready
              </span>
            </div>
          </div>
        </div>

        {/* Live Supabase Connection Form */}
        <div className="glass-panel-pink p-6 sm:p-8 rounded-3xl border border-pink-500/30 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-pink-500/20 pb-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 font-dancing">
              <PlugZap className="w-5 h-5 text-pink-400" /> Connect Supabase Cloud Database
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
            Enter your <strong>Supabase URL</strong> and <strong>Anon Key</strong> below. Once connected, all your website configurations, custom stories, and uploaded photos will automatically sync with your live Supabase cloud database!
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
