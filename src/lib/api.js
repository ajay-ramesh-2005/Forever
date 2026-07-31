import { DEFAULT_WEBSITE_CONFIG, SAMPLE_WEBSITES } from './defaultData';
import { supabase, isSupabaseConfigured } from './supabase';

const LOCAL_STORAGE_KEY = 'forever_us_websites_v1';

// Helper to get local websites
export function getLocalWebsites() {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('LocalStorage read error:', err);
  }
  // Initialize with sample websites if empty
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SAMPLE_WEBSITES));
  return SAMPLE_WEBSITES;
}

// Helper to save local websites
export function saveLocalWebsites(websites) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(websites));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
}

// Unified API Service
export const api = {
  // Fetch all saved websites
  async getAllWebsites() {
    // Try backend API first if running backend
    try {
      const res = await fetch('/api/websites');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch (e) {
      // Backend api offline, continue
    }

    // Try Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.from('websites').select('*').order('updated_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('Supabase fetch error, using local storage fallback:', err);
      }
    }

    // Fallback to local storage
    return getLocalWebsites();
  },

  // Get website by ID or Slug
  async getWebsiteBySlug(slugOrId) {
    // Try backend API
    try {
      const res = await fetch(`/api/websites/${slugOrId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    // Try Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('websites')
          .select('*')
          .or(`id.eq.${slugOrId},slug.eq.${slugOrId}`)
          .single();
        if (!error && data) return data;
      } catch (e) {}
    }

    // Local storage fallback
    const list = getLocalWebsites();
    const found = list.find(w => w.slug === slugOrId || w.id === slugOrId);
    return found || DEFAULT_WEBSITE_CONFIG;
  },

  // Save/Create/Update website
  async saveWebsite(websiteConfig) {
    const updatedObj = {
      ...websiteConfig,
      updated_at: new Date().toISOString()
    };

    if (!updatedObj.id) {
      updatedObj.id = 'ws-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
    }
    if (!updatedObj.slug) {
      updatedObj.slug = updatedObj.girlfriendName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString(36);
    }

    // 1. Try Backend API
    try {
      const res = await fetch('/api/websites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedObj)
      });
      if (res.ok) {
        const saved = await res.json();
        // sync to local storage
        this._syncToLocalStorage(saved);
        return saved;
      }
    } catch (e) {}

    // 2. Try Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('websites')
          .upsert(updatedObj)
          .select()
          .single();
        if (!error && data) {
          this._syncToLocalStorage(data);
          return data;
        }
      } catch (e) {}
    }

    // 3. Fallback Local Storage
    this._syncToLocalStorage(updatedObj);
    return updatedObj;
  },

  // Delete website
  async deleteWebsite(id) {
    try {
      await fetch(`/api/websites/${id}`, { method: 'DELETE' });
    } catch (e) {}

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('websites').delete().eq('id', id);
      } catch (e) {}
    }

    const list = getLocalWebsites();
    const filtered = list.filter(w => w.id !== id);
    saveLocalWebsites(filtered);
    return true;
  },

  // Internal sync helper
  _syncToLocalStorage(website) {
    const list = getLocalWebsites();
    const idx = list.findIndex(w => w.id === website.id);
    if (idx >= 0) {
      list[idx] = website;
    } else {
      list.unshift(website);
    }
    saveLocalWebsites(list);
  }
};
