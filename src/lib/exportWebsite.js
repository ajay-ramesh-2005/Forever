/**
 * Utility to download the full interactive code of a single saved website as a standalone HTML file or JSON.
 * Embedded with live Supabase & REST Database Sync so dashboard edits automatically update the separately hosted site!
 */
import { getSupabaseCredentials } from './supabase';

export function downloadWebsiteHTML(config) {
  const girlfriendName = config.girlfriendName || 'My Love';
  const title = config.title || `For ${girlfriendName} 💖`;
  const filename = `${girlfriendName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_love_story.html`;

  const { url: supabaseUrl, anonKey: supabaseAnonKey } = getSupabaseCredentials();
  const apiBaseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000';

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Playfair+Display:ital,wght@0,600;0,800;1,600&family=Dancing+Script:wght@700&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #020617;
      color: #f8fafc;
      overflow-x: hidden;
    }
    .font-serif-romantic { font-family: 'Playfair Display', serif; }
    .font-cursive { font-family: 'Dancing Script', cursive; }
    
    .glass-panel {
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(244, 114, 182, 0.2);
    }
    .glass-panel-pink {
      background: rgba(30, 11, 26, 0.7);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(244, 114, 182, 0.3);
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-15px) rotate(5deg); }
    }
    .animate-float { animation: float 4s ease-in-out infinite; }

    @keyframes pulse-slow {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.05); }
    }
    .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }

    .particle {
      position: absolute;
      pointer-events: none;
      animation: float-up 8s linear infinite;
    }
    @keyframes float-up {
      0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
      20% { opacity: 0.8; }
      80% { opacity: 0.8; }
      100% { transform: translateY(-10vh) scale(1.2); opacity: 0; }
    }
  </style>
</head>
<body class="min-h-screen relative bg-slate-950 text-slate-100 selection:bg-pink-500 selection:text-white">

  <!-- Background Floating Particles -->
  <div id="particles-container" class="fixed inset-0 pointer-events-none z-0 overflow-hidden"></div>

  <!-- Live Database Sync Badge -->
  <div class="fixed top-4 left-4 z-50">
    <div id="db-status-badge" class="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-pink-300 border border-pink-500/30 rounded-full text-[11px] font-semibold flex items-center gap-2 backdrop-blur-md transition shadow-lg">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
      <span id="db-status-text">Connected to Database ⚡</span>
    </div>
  </div>

  <!-- Audio Player Button -->
  <div class="fixed top-4 right-4 z-50">
    <button id="music-btn" onclick="toggleAudio()" class="px-4 py-2 bg-pink-600/80 hover:bg-pink-500 text-white font-semibold rounded-full shadow-lg border border-pink-400/40 backdrop-blur-md flex items-center gap-2 transition cursor-pointer text-xs sm:text-sm">
      <span id="music-icon">🎵</span>
      <span id="music-text">${escapeHtml(config.musicTitle || 'Play Romantic Song')}</span>
    </button>
    <audio id="audio-element" loop src="${escapeHtml(config.musicUrl || '')}"></audio>
  </div>

  <!-- Page Containers -->
  <main id="app" class="relative z-10 min-h-screen flex items-center justify-center p-4">
    
    <!-- Page 1: Timer & Proposal -->
    <div id="page-1" class="page-step w-full max-w-2xl text-center py-10">
      <div class="glass-panel-pink p-8 sm:p-12 rounded-3xl shadow-2xl relative border border-pink-500/30">
        <div class="inline-block px-4 py-1.5 bg-pink-500/20 text-pink-300 border border-pink-500/40 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
          💖 Girlfriend's Day Special
        </div>
        <h1 id="hero-title" class="text-4xl sm:text-6xl font-extrabold text-white font-serif-romantic mb-4">
          For ${escapeHtml(girlfriendName)} ✨
        </h1>
        <p id="hero-subtitle" class="text-pink-200 text-base sm:text-lg mb-8 max-w-lg mx-auto">
          "${escapeHtml(config.heroSubtitle || 'Every moment with you is a dream come true.')}"
        </p>

        <!-- Countdown Timer -->
        <div class="grid grid-cols-4 gap-3 max-w-md mx-auto mb-10">
          <div class="bg-slate-900/80 p-3 rounded-2xl border border-pink-500/20">
            <span id="timer-days" class="text-2xl sm:text-3xl font-extrabold text-pink-400 block">00</span>
            <span class="text-[10px] text-pink-300 uppercase tracking-wider">Days</span>
          </div>
          <div class="bg-slate-900/80 p-3 rounded-2xl border border-pink-500/20">
            <span id="timer-hours" class="text-2xl sm:text-3xl font-extrabold text-pink-400 block">00</span>
            <span class="text-[10px] text-pink-300 uppercase tracking-wider">Hours</span>
          </div>
          <div class="bg-slate-900/80 p-3 rounded-2xl border border-pink-500/20">
            <span id="timer-minutes" class="text-2xl sm:text-3xl font-extrabold text-pink-400 block">00</span>
            <span class="text-[10px] text-pink-300 uppercase tracking-wider">Mins</span>
          </div>
          <div class="bg-slate-900/80 p-3 rounded-2xl border border-pink-500/20">
            <span id="timer-seconds" class="text-2xl sm:text-3xl font-extrabold text-pink-400 block">00</span>
            <span class="text-[10px] text-pink-300 uppercase tracking-wider">Secs</span>
          </div>
        </div>

        <!-- Proposal Question -->
        <div class="p-6 bg-pink-950/40 rounded-2xl border border-pink-500/30 mb-8">
          <h2 id="proposal-question" class="text-2xl sm:text-3xl font-bold text-white mb-6">
            ${escapeHtml(config.proposalQuestion || 'Will you be my forever Valentine & Girlfriend? 💕')}
          </h2>

          <div class="relative flex items-center justify-center gap-4 min-h-[60px]">
            <button id="proposal-yes-btn" onclick="acceptProposal()" class="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold text-lg rounded-2xl shadow-xl hover:scale-105 transition transform cursor-pointer">
              ${escapeHtml(config.proposalYesText || 'YES! 💖')}
            </button>
            <button id="no-btn" onmouseover="dodgeNoButton()" onclick="dodgeNoButton()" class="px-6 py-3 bg-slate-800 text-slate-400 font-semibold text-sm rounded-xl border border-slate-700 transition">
              ${escapeHtml(config.proposalNoText || 'No 😢')}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Page 2: Love Meter -->
    <div id="page-2" class="page-step w-full max-w-2xl text-center py-10 hidden">
      <div class="glass-panel-pink p-8 sm:p-12 rounded-3xl shadow-2xl border border-pink-500/30">
        <h2 class="text-3xl sm:text-5xl font-extrabold text-white font-serif-romantic mb-4">
          Love Compatibility Meter 💘
        </h2>
        <p class="text-pink-200 text-sm mb-8">Measuring our endless love index...</p>

        <div class="mb-8">
          <div class="w-full bg-slate-900 h-6 rounded-full overflow-hidden p-1 border border-pink-500/40">
            <div id="love-bar" class="h-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 rounded-full transition-all duration-1000 w-0"></div>
          </div>
          <span id="love-percent" class="text-4xl font-extrabold text-pink-400 mt-4 block">0%</span>
        </div>

        <button id="meter-btn" onclick="runLoveMeter()" class="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-lg transition cursor-pointer">
          Calculate Love Score! ✨
        </button>

        <div id="meter-result" class="hidden mt-8 p-6 bg-pink-900/30 rounded-2xl border border-pink-500/30">
          <h3 class="text-2xl font-bold text-pink-300 mb-2">Result: 1,000,000% Infinite Love! Infinity & Beyond! 🚀❤️</h3>
          <p class="text-sm text-pink-200 mb-6">Our love breaks all scale boundaries!</p>
          <button onclick="showPage(3)" class="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg transition cursor-pointer">
            Explore Our Special Memories 📸 →
          </button>
        </div>
      </div>
    </div>

    <!-- Page 3: Memories Timeline -->
    <div id="page-3" class="page-step w-full max-w-4xl py-10 hidden">
      <div class="text-center mb-8">
        <h2 class="text-3xl sm:text-5xl font-extrabold text-white font-serif-romantic mb-3">
          Our Favorite Memories 📸
        </h2>
        <p class="text-pink-300 text-sm">Every single second with you is a memory I treasure forever.</p>
      </div>

      <div id="memories-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        ${renderMemoriesGrid(config.memories || [])}
      </div>

      <div class="text-center">
        <button onclick="showPage(4)" class="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-extrabold rounded-2xl shadow-xl transition cursor-pointer">
          Pick Your Virtual Bouquet 💐 →
        </button>
      </div>
    </div>

    <!-- Page 4: Virtual Bouquet -->
    <div id="page-4" class="page-step w-full max-w-3xl text-center py-10 hidden">
      <div class="glass-panel-pink p-8 sm:p-12 rounded-3xl border border-pink-500/30 shadow-2xl">
        <h2 class="text-3xl sm:text-5xl font-extrabold text-white font-serif-romantic mb-4">
          Select Your Flowers 🌹
        </h2>
        <p class="text-pink-200 text-sm mb-8">Pick your favorite romantic bouquet arrangement!</p>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div onclick="selectBouquet(this, 'Red Roses')" class="bouquet-option p-4 bg-slate-900/80 border border-pink-500/30 rounded-2xl cursor-pointer hover:border-pink-500 transition">
            <span class="text-4xl block mb-2">🌹</span>
            <span class="text-xs font-bold text-white">Classic Red Roses</span>
          </div>
          <div onclick="selectBouquet(this, 'Pink Tulips')" class="bouquet-option p-4 bg-slate-900/80 border border-pink-500/30 rounded-2xl cursor-pointer hover:border-pink-500 transition">
            <span class="text-4xl block mb-2">🌷</span>
            <span class="text-xs font-bold text-white">Pink Tulips</span>
          </div>
          <div onclick="selectBouquet(this, 'Sunflowers')" class="bouquet-option p-4 bg-slate-900/80 border border-pink-500/30 rounded-2xl cursor-pointer hover:border-pink-500 transition">
            <span class="text-4xl block mb-2">🌻</span>
            <span class="text-xs font-bold text-white">Bright Sunflowers</span>
          </div>
          <div onclick="selectBouquet(this, 'Lilies & Orchids')" class="bouquet-option p-4 bg-slate-900/80 border border-pink-500/30 rounded-2xl cursor-pointer hover:border-pink-500 transition">
            <span class="text-4xl block mb-2">💐</span>
            <span class="text-xs font-bold text-white">Royal Lilies</span>
          </div>
          <div onclick="selectBouquet(this, 'Cherry Blossoms')" class="bouquet-option p-4 bg-slate-900/80 border border-pink-500/30 rounded-2xl cursor-pointer hover:border-pink-500 transition">
            <span class="text-4xl block mb-2">🌸</span>
            <span class="text-xs font-bold text-white">Cherry Blossoms</span>
          </div>
          <div onclick="selectBouquet(this, 'Sparkle Hearts')" class="bouquet-option p-4 bg-slate-900/80 border border-pink-500/30 rounded-2xl cursor-pointer hover:border-pink-500 transition">
            <span class="text-4xl block mb-2">💖</span>
            <span class="text-xs font-bold text-white">Heart Blossoms</span>
          </div>
        </div>

        <button onclick="showPage(5)" class="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-2xl shadow-lg transition cursor-pointer">
          Read Your Love Letter 💌 →
        </button>
      </div>
    </div>

    <!-- Page 5: Love Letter & Coupons -->
    <div id="page-5" class="page-step w-full max-w-3xl py-10 hidden">
      <div class="glass-panel p-8 sm:p-12 rounded-3xl border border-pink-500/30 shadow-2xl mb-8">
        <h2 class="text-3xl sm:text-5xl font-extrabold text-center text-white font-serif-romantic mb-6">
          My Love Letter To You 💌
        </h2>

        <div id="love-letter-content" class="bg-pink-950/20 p-6 sm:p-8 rounded-2xl border border-pink-500/20 text-pink-100 leading-relaxed font-cursive text-xl sm:text-2xl whitespace-pre-line mb-8">
          ${escapeHtml(config.loveLetter || 'You are the light of my life and the owner of my heart.')}
        </div>

        <!-- Love Coupons -->
        <h3 class="text-2xl font-bold text-center text-white mb-6">Your Redeemable Love Coupons 🎟️</h3>
        <div id="coupons-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          ${renderCouponsGrid(config.coupons || [])}
        </div>

        <div class="text-center">
          <button onclick="showPage(6)" class="px-8 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-extrabold rounded-2xl shadow-xl transition cursor-pointer">
            Grand Finale Ending ✨ →
          </button>
        </div>
      </div>
    </div>

    <!-- Page 6: Grand Finale -->
    <div id="page-6" class="page-step w-full max-w-2xl text-center py-10 hidden">
      <div class="glass-panel-pink p-8 sm:p-12 rounded-3xl border border-pink-500/40 shadow-2xl">
        <span class="text-6xl animate-bounce block mb-4">💖</span>
        <h2 id="finale-title" class="text-4xl sm:text-6xl font-extrabold text-white font-serif-romantic mb-4">
          ${escapeHtml(config.finaleTitle || 'Forever & Always Yours!')}
        </h2>
        <p id="finale-message" class="text-pink-200 text-lg mb-8 max-w-md mx-auto leading-relaxed">
          ${escapeHtml(config.finaleMessage || 'Thank you for making my world brighter every day.')}
        </p>

        <button onclick="triggerGrandConfetti()" class="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white font-extrabold rounded-2xl shadow-xl hover:scale-105 transition cursor-pointer mb-6">
          Celebrate Again! 🎉
        </button>
      </div>
    </div>

  </main>

  <script>
    // Embedded Database Sync Identifiers & Credentials
    const WEBSITE_ID = "${escapeHtml(config.id || '')}";
    const WEBSITE_SLUG = "${escapeHtml(config.slug || '')}";
    const SUPABASE_URL = "${escapeHtml(supabaseUrl || '')}";
    const SUPABASE_ANON_KEY = "${escapeHtml(supabaseAnonKey || '')}";
    const API_BASE_URL = "${escapeHtml(apiBaseUrl || '')}";

    // Active Config State
    let WEBSITE_CONFIG = ${JSON.stringify(config, null, 2)};
    let TARGET_DATE = "${escapeHtml(config.targetDate || '2026-08-01T00:00')}";

    // Audio Controls
    function toggleAudio() {
      const audio = document.getElementById('audio-element');
      const text = document.getElementById('music-text');
      if (audio.paused) {
        audio.play().catch(e => console.log('Audio playback policy:', e));
        text.innerText = 'Pause Song';
      } else {
        audio.pause();
        text.innerText = WEBSITE_CONFIG.musicTitle || 'Play Romantic Song';
      }
    }

    // Page Switcher
    function showPage(pageNum) {
      document.querySelectorAll('.page-step').forEach(el => el.classList.add('hidden'));
      const target = document.getElementById('page-' + pageNum);
      if (target) {
        target.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (typeof confetti === 'function') {
        confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
      }
    }

    // Dodging No Button
    function dodgeNoButton() {
      const btn = document.getElementById('no-btn');
      if (!btn) return;
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 150;
      btn.style.transform = \`translate(\${x}px, \${y}px)\`;
    }

    // Proposal Acceptance
    function acceptProposal() {
      if (typeof confetti === 'function') {
        confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
      }
      showPage(2);
    }

    // Love Meter Calculation
    function runLoveMeter() {
      const bar = document.getElementById('love-bar');
      const text = document.getElementById('love-percent');
      const res = document.getElementById('meter-result');
      const btn = document.getElementById('meter-btn');
      btn.disabled = true;
      btn.classList.add('opacity-50');

      let current = 0;
      const interval = setInterval(() => {
        current += 5;
        if (current > 100) {
          clearInterval(interval);
          bar.style.width = '100%';
          text.innerText = '1,000,000%!';
          res.classList.remove('hidden');
          if (typeof confetti === 'function') {
            confetti({ particleCount: 100, spread: 80 });
          }
        } else {
          bar.style.width = current + '%';
          text.innerText = current + '%';
        }
      }, 50);
    }

    // Bouquet selection
    function selectBouquet(element, name) {
      document.querySelectorAll('.bouquet-option').forEach(el => el.classList.remove('border-pink-500', 'bg-pink-900/40'));
      element.classList.add('border-pink-500', 'bg-pink-900/40');
      if (typeof confetti === 'function') {
        confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
      }
    }

    // Claim Coupon
    function claimCoupon(btn) {
      btn.innerText = 'Claimed! 💖';
      btn.disabled = true;
      btn.classList.replace('bg-pink-500', 'bg-emerald-600');
      if (typeof confetti === 'function') {
        confetti({ particleCount: 40, spread: 60 });
      }
    }

    // Grand Finale Confetti
    function triggerGrandConfetti() {
      if (typeof confetti === 'function') {
        confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 } });
      }
    }

    // Countdown Timer Logic
    function updateTimer() {
      const target = new Date(TARGET_DATE).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      document.getElementById('timer-days').innerText = String(d).padStart(2, '0');
      document.getElementById('timer-hours').innerText = String(h).padStart(2, '0');
      document.getElementById('timer-minutes').innerText = String(m).padStart(2, '0');
      document.getElementById('timer-seconds').innerText = String(s).padStart(2, '0');
    }
    setInterval(updateTimer, 1000);
    updateTimer();

    // LIVE DATABASE SYNC ENGINE
    async function syncDatabaseChanges() {
      const target = WEBSITE_ID || WEBSITE_SLUG;
      if (!target) return;

      let latestData = null;

      // 1. Try Supabase Cloud Database query
      if (SUPABASE_URL && SUPABASE_ANON_KEY) {
        try {
          const res = await fetch(\`\${SUPABASE_URL}/rest/v1/websites?or=(id.eq.\${target},slug.eq.\${target})&select=*\`, {
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': \`Bearer \${SUPABASE_ANON_KEY}\`
            }
          });
          if (res.ok) {
            const list = await res.json();
            if (Array.isArray(list) && list.length > 0) {
              latestData = list[0];
            }
          }
        } catch(e) {
          console.warn("Supabase fetch fallback:", e);
        }
      }

      // 2. Fallback to API server if Supabase wasn't used or failed
      if (!latestData && API_BASE_URL) {
        try {
          const res = await fetch(\`\${API_BASE_URL}/api/websites/\${target}\`);
          if (res.ok) {
            latestData = await res.json();
          }
        } catch(e) {
          console.warn("API server fetch fallback:", e);
        }
      }

      if (latestData) {
        applyLiveUpdates(latestData);
      }
    }

    function applyLiveUpdates(data) {
      WEBSITE_CONFIG = data;
      if (data.targetDate) TARGET_DATE = data.targetDate;

      const gfName = data.girlfriendName || 'My Love';
      document.title = data.title || \`For \${gfName} 💖\`;

      const heroTitle = document.getElementById('hero-title');
      if (heroTitle) heroTitle.innerText = \`For \${gfName} ✨\`;

      const heroSub = document.getElementById('hero-subtitle');
      if (heroSub) heroSub.innerText = \`"\${data.heroSubtitle || ''}"\`;

      const propQ = document.getElementById('proposal-question');
      if (propQ) propQ.innerText = data.proposalQuestion || '';

      const propYes = document.getElementById('proposal-yes-btn');
      if (propYes) propYes.innerText = data.proposalYesText || 'YES! 💖';

      const propNo = document.getElementById('no-btn');
      if (propNo) propNo.innerText = data.proposalNoText || 'No 😢';

      const letter = document.getElementById('love-letter-content');
      if (letter) letter.innerText = data.loveLetter || '';

      const finaleTitle = document.getElementById('finale-title');
      if (finaleTitle) finaleTitle.innerText = data.finaleTitle || '';

      const finaleMsg = document.getElementById('finale-message');
      if (finaleMsg) finaleMsg.innerText = data.finaleMessage || '';

      const badgeText = document.getElementById('db-status-text');
      if (badgeText) badgeText.innerText = 'Synced with Database ⚡';
    }

    // Auto sync on page load and poll every 10 seconds
    syncDatabaseChanges();
    setInterval(syncDatabaseChanges, 10000);

    // Generate Background Particles
    const pContainer = document.getElementById('particles-container');
    const symbols = ['💖', '💕', '✨', '🌸', '🌹', '💗'];
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.innerText = symbols[Math.floor(Math.random() * symbols.length)];
      p.style.left = Math.random() * 100 + 'vw';
      p.style.animationDuration = (5 + Math.random() * 6) + 's';
      p.style.animationDelay = (Math.random() * 5) + 's';
      p.style.fontSize = (14 + Math.random() * 16) + 'px';
      pContainer.appendChild(p);
    }
  </script>
</body>
</html>`;

  // Trigger file download in browser
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadWebsiteJSON(config) {
  const girlfriendName = config.girlfriendName || 'My Love';
  const filename = `${girlfriendName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_love_story.json`;
  const jsonContent = JSON.stringify(config, null, 2);

  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function renderMemoriesGrid(memories) {
  const list = Array.isArray(memories) 
    ? memories 
    : (memories && typeof memories === 'object' ? Object.values(memories) : []);
  if (!list.length) return '';
  return list.map(m => `
    <div class="glass-panel p-5 rounded-2xl border border-pink-500/30 hover:border-pink-500/60 transition group">
      ${m.imageUrl ? `<img src="${escapeHtml(m.imageUrl)}" alt="${escapeHtml(m.title || '')}" class="w-full h-48 object-cover rounded-xl mb-4 group-hover:scale-102 transition duration-300">` : ''}
      <span class="text-[11px] font-bold text-pink-400 uppercase tracking-wider block mb-1">${escapeHtml(m.date || '')}</span>
      <h3 class="text-xl font-bold text-white mb-2">${escapeHtml(m.title || '')}</h3>
      <p class="text-xs text-pink-200/80 leading-relaxed">${escapeHtml(m.description || '')}</p>
    </div>
  `).join('');
}

function renderCouponsGrid(coupons) {
  const list = Array.isArray(coupons) 
    ? coupons 
    : (coupons && typeof coupons === 'object' ? Object.values(coupons) : []);
  if (!list.length) return '';
  return list.map((c) => `
    <div class="p-4 bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-dashed border-pink-400/50 rounded-2xl flex items-center justify-between">
      <div>
        <span class="text-2xl block mb-1">${escapeHtml(c.icon || '🎟️')}</span>
        <h4 class="font-bold text-white text-sm">${escapeHtml(c.title || 'Love Coupon')}</h4>
        <p class="text-[11px] text-pink-300">${escapeHtml(c.description || 'Valid anytime!')}</p>
      </div>
      <button onclick="claimCoupon(this)" class="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer">
        Claim!
      </button>
    </div>
  `).join('');
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
