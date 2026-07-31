import React from 'react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Database, ShieldCheck, Key, FileText, CheckCircle2 } from 'lucide-react';

export default function Settings() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="pb-4 border-b border-slate-800">
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            Dashboard Settings ⚙️
          </h1>
          <p className="text-xs text-pink-300">Database connections, backend status, and environment configuration</p>
        </div>

        {/* Database Status Card */}
        <div className="glass-panel p-6 rounded-2xl border border-pink-500/20 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Database className="w-5 h-5 text-pink-400" /> Database & Persistence Status
          </h2>

          <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold">Supabase Environment Status:</span>
              <span className={`font-bold px-3 py-1 rounded-full text-[11px] ${
                isSupabaseConfigured
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                  : 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-300'
              }`}>
                {isSupabaseConfigured ? 'Connected to Supabase Cloud' : 'Standalone Local / Express Storage Mode'}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <span className="text-slate-300 font-semibold">Express Server Local JSON Database:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Active & Persistent
              </span>
            </div>
          </div>
        </div>

        {/* Supabase Keys Instructions */}
        <div className="glass-panel p-6 rounded-2xl border border-pink-500/20 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-pink-400" /> How to Set Up Supabase Credentials
          </h2>
          
          <p className="text-xs text-slate-300 leading-relaxed">
            Enter your Supabase credentials inside the <code className="bg-pink-500/20 text-pink-300 px-1.5 py-0.5 rounded border border-pink-500/30">.env</code> file located in the root directory of the project:
          </p>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-pink-300 font-mono pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5"><FileText className="w-4 h-4" /> .env file path:</span>
              <span className="text-slate-400 select-all">C:\Users\Ajay Ramesh\gfday website creator\.env</span>
            </div>
            
            <pre className="text-xs font-mono text-pink-300 overflow-x-auto pt-2">
{`VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-supabase-anon-key`}
            </pre>
          </div>

          <div className="bg-pink-500/10 border border-pink-500/20 p-4 rounded-xl text-xs text-pink-200 space-y-1">
            <p className="font-semibold text-pink-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-pink-400" /> How to get your keys from Supabase:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 pt-1">
              <li>Log in to your <strong>Supabase Dashboard</strong> at <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-pink-400 underline">supabase.com</a></li>
              <li>Select your project and go to <strong>Project Settings → API</strong>.</li>
              <li>Copy the <strong>Project URL</strong> and paste it as <code className="text-pink-300">VITE_SUPABASE_URL</code>.</li>
              <li>Copy the <strong>anon public key</strong> and paste it as <code className="text-pink-300">VITE_SUPABASE_ANON_KEY</code>.</li>
              <li>Restart the dev server (<code className="text-pink-300">npm run dev</code>).</li>
            </ol>
          </div>
        </div>

      </div>

    </div>
  );
}
