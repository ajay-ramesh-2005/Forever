import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, ExternalLink, RefreshCw, Save, CheckCircle } from 'lucide-react';
import { getPublicHref } from '../lib/utils';

export default function DeviceFrame({ children, publicSlug, onSave, saving = false, saveSuccess = false }) {
  const [device, setDevice] = useState('desktop'); // desktop, tablet, mobile
  const [key, setKey] = useState(0); // for refresh

  const getWidthClass = () => {
    switch (device) {
      case 'mobile':
        return 'w-[375px] h-[720px] rounded-[40px] border-[12px] border-slate-800 shadow-2xl';
      case 'tablet':
        return 'w-[768px] h-[850px] rounded-[30px] border-[10px] border-slate-800 shadow-2xl';
      case 'desktop':
      default:
        return 'w-full h-[850px] rounded-2xl border border-slate-800 shadow-2xl';
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* Device Switcher Toolbar */}
      <div className="flex flex-wrap items-center justify-between w-full bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-pink-500/20 mb-4 gap-3 shadow">
        
        {/* Left: Viewport Selectors */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDevice('desktop')}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              device === 'desktop' ? 'bg-pink-500 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden sm:inline">Desktop</span>
          </button>

          <button
            onClick={() => setDevice('tablet')}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              device === 'tablet' ? 'bg-pink-500 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Tablet className="w-4 h-4" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            onClick={() => setDevice('mobile')}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
              device === 'mobile' ? 'bg-pink-500 text-white shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden sm:inline">Mobile</span>
          </button>
        </div>

        {/* Right: Actions (Save, Reset, Open Fullscreen) */}
        <div className="flex items-center gap-2">
          {/* Prominent Save Button */}
          {onSave && (
            <button
              onClick={onSave}
              disabled={saving}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-rose-600 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save & Publish'}</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => setKey(prev => prev + 1)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
            title="Reload Preview"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Story</span>
          </button>

          {publicSlug && (
            <a
              href={getPublicHref(publicSlug)}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-pink-500/20 border border-pink-500/40 text-pink-300 hover:bg-pink-500/30 text-xs font-semibold flex items-center gap-1 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open Fullscreen</span>
            </a>
          )}
        </div>

      </div>

      {/* Frame Container */}
      <div className="w-full flex items-center justify-center bg-slate-950/80 p-4 rounded-3xl border border-slate-800 min-h-[700px]">
        <div key={key} className={`overflow-hidden relative transition-all duration-300 bg-slate-950 ${getWidthClass()}`}>
          {/* Mobile Speaker Notch */}
          {device === 'mobile' && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-b-xl z-50 flex items-center justify-center">
              <div className="w-12 h-1 bg-slate-600 rounded-full" />
            </div>
          )}

          <div className="w-full h-full overflow-y-auto">
            {children}
          </div>
        </div>
      </div>

    </div>
  );
}
