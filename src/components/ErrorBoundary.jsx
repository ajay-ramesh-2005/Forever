import React from 'react';
import { Heart, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center text-pink-200">
          <div className="glass-panel-pink max-w-md w-full p-8 rounded-3xl border border-pink-500/30 shadow-2xl flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-400">
              <Heart className="w-8 h-8 fill-pink-500 animate-pulse" />
            </div>

            <h2 className="text-2xl font-bold font-dancing text-white">Something went wrong</h2>
            <p className="text-xs text-pink-300">Don't worry! Your romantic story is safe. Click below to reload.</p>

            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow flex items-center gap-2 transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
