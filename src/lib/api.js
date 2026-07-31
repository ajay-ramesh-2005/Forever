import { DEFAULT_WEBSITE_CONFIG, SAMPLE_WEBSITES } from './defaultData';
import { supabase, isSupabaseConfigured } from './supabase';

const LOCAL_STORAGE_KEY = 'forever_us_websites_v1';

// Helper to get local websites
export function getLocalWebsites() {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('LocalStorage read error:', err);
  }
  // Initialize with sample websites if empty
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SAMPLE_WEBSITES));
  } catch (e) {}
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

    // Try backend API next
    try {
      const res = await fetch('/api/websites');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
      }
    } catch (e) {}

    // Fallback to local storage
    return getLocalWebsites();
  },

  // Get website by ID or Slug
  async getWebsiteBySlug(slugOrId) {
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

    // Try backend API
    try {
      const res = await fetch(`/api/websites/${slugOrId}`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

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

    // 1. Try Supabase First
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
      } catch (e) {
        console.warn('Supabase save error:', e);
      }
    }

    // 2. Try Backend API
    try {
      const res = await fetch('/api/websites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedObj)
      });
      if (res.ok) {
        const saved = await res.json();
        this._syncToLocalStorage(saved);
        return saved;
      }
    } catch (e) {}

    // 3. Fallback Local Storage
    this._syncToLocalStorage(updatedObj);
    return updatedObj;
  },

  // Push ALL available local/sample websites to Supabase Cloud Database
  async syncAllWebsitesToSupabase() {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, message: 'Supabase is not configured yet. Please enter your URL & Anon Key first.' };
    }

    const localList = getLocalWebsites();
    const allItems = [...localList];

    // Ensure default config is included
    if (!allItems.some(w => w.slug === DEFAULT_WEBSITE_CONFIG.slug)) {
      allItems.unshift(DEFAULT_WEBSITE_CONFIG);
    }

    let pushedCount = 0;
    const errors = [];

    for (const item of allItems) {
      try {
        const payload = {
          ...item,
          updated_at: new Date().toISOString()
        };
        const { error } = await supabase.from('websites').upsert(payload);
        if (error) {
          errors.push(`${item.girlfriendName || item.title}: ${error.message}`);
        } else {
          pushedCount++;
        }
      } catch (err) {
        errors.push(`${item.girlfriendName}: ${err.message}`);
      }
    }

    if (pushedCount > 0) {
      return {
        success: true,
        count: pushedCount,
        message: `Successfully pushed ${pushedCount} website(s) directly to your Supabase database!`
      };
    } else {
      return {
        success: false,
        message: `Failed to push websites: ${errors.join(', ')}`
      };
    }
  },

  // Delete website
  async deleteWebsite(id) {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('websites').delete().eq('id', id);
      } catch (e) {}
    }

    try {
      await fetch(`/api/websites/${id}`, { method: 'DELETE' });
    } catch (e) {}

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
