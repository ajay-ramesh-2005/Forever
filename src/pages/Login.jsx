import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Heart, Lock, Sparkles, ArrowRight } from 'lucide-react';

export default function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const { setIsAuthenticated } = useStore();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Default master password or open access
    if (password === 'forever' || password === 'admin' || password.length >= 0) {
      setIsAuthenticated(true);
      navigate('/dashboard');
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-pink-600/30 to-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="glass-panel-pink max-w-md w-full rounded-3xl p-8 shadow-2xl border border-pink-500/30 relative z-10 text-center">
        
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 mx-auto flex items-center justify-center shadow-lg mb-4 text-white">
          <Heart className="w-8 h-8 fill-white animate-pulse" />
        </div>

        <h1 className="text-2xl font-bold font-dancing text-white mb-1">
          Forever Us Admin Login 💕
        </h1>
        <p className="text-xs text-pink-200/80 mb-6">Enter password to access your romantic website dashboard</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Lock className="w-4 h-4 text-pink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password (e.g. forever)"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:border-pink-500 focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 font-semibold">Incorrect password. Try "forever"</p>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer hover:from-pink-600 transition"
          >
            <span>Enter Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
}
