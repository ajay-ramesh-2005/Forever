import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AudioProvider } from './context/AudioContext';
import { StoreProvider } from './context/StoreContext';
import ErrorBoundary from './components/ErrorBoundary';
import FloatingMusicPlayer from './components/FloatingMusicPlayer';
import Navbar from './components/Navbar';
import PublicStoryView from './pages/PublicStoryView';
import DashboardHome from './pages/dashboard/DashboardHome';
import WebsiteEditor from './pages/dashboard/WebsiteEditor';
import SavedWebsites from './pages/dashboard/SavedWebsites';
import Settings from './pages/dashboard/Settings';
import Login from './pages/Login';

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <AudioProvider>
          <Router>
            <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-poppins antialiased relative">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Public Interactive Story Routes */}
                  <Route path="/" element={<PublicStoryView />} />
                  <Route path="/love/:slug" element={<PublicStoryView />} />

                  {/* Dashboard Admin Routes */}
                  <Route path="/dashboard" element={<DashboardHome />} />
                  <Route path="/dashboard/create" element={<WebsiteEditor editExisting={false} />} />
                  <Route path="/dashboard/edit/:slug" element={<WebsiteEditor editExisting={true} />} />
                  <Route path="/dashboard/saved" element={<SavedWebsites />} />
                  <Route path="/dashboard/settings" element={<Settings />} />
                  <Route path="/login" element={<Login />} />

                  {/* Custom direct website route e.g. /custom-name */}
                  <Route path="/:slug" element={<PublicStoryView />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              {/* Seamless Floating Music Player on every page */}
              <FloatingMusicPlayer />
            </div>
          </Router>
        </AudioProvider>
      </StoreProvider>
    </ErrorBoundary>
  );
}
