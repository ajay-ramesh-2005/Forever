import { createClient } from '@supabase/supabase-js';

const STORAGE_KEY = 'forever_us_supabase_config';

// Get current configured credentials (localStorage first, then env)
export function getSupabaseCredentials() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.url && parsed.anonKey) {
        return { url: parsed.url, anonKey: parsed.anonKey, source: 'localStorage' };
      }
    }
  } catch (e) {}

  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  
  if (envUrl && envKey) {
    return { url: envUrl, anonKey: envKey, source: 'env' };
  }

  return { url: '', anonKey: '', source: 'none' };
}

let activeCreds = getSupabaseCredentials();

export let isSupabaseConfigured = Boolean(activeCreds.url && activeCreds.anonKey);

export let supabase = isSupabaseConfigured
  ? createClient(activeCreds.url, activeCreds.anonKey)
  : null;

// Dynamic saver and client re-initializer
export function saveSupabaseCredentials(url, anonKey) {
  const cleanUrl = (url || '').trim();
  const cleanKey = (anonKey || '').trim();

  if (!cleanUrl || !cleanKey) {
    localStorage.removeItem(STORAGE_KEY);
    isSupabaseConfigured = false;
    supabase = null;
    return false;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify({ url: cleanUrl, anonKey: cleanKey }));
  activeCreds = { url: cleanUrl, anonKey: cleanKey, source: 'localStorage' };
  isSupabaseConfigured = true;
  supabase = createClient(cleanUrl, cleanKey);
  return true;
}

// Clear stored credentials
export function clearSupabaseCredentials() {
  localStorage.removeItem(STORAGE_KEY);
  const envCreds = getSupabaseCredentials();
  if (envCreds.url && envCreds.anonKey) {
    activeCreds = envCreds;
    isSupabaseConfigured = true;
    supabase = createClient(envCreds.url, envCreds.anonKey);
  } else {
    isSupabaseConfigured = false;
    supabase = null;
  }
}

// Test connection helper
export async function testSupabaseConnection() {
  if (!supabase) return { success: false, message: 'Supabase client is not initialized.' };

  try {
    const { data, error } = await supabase.from('websites').select('count', { count: 'exact', head: true });
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Successfully connected to Supabase database!' };
  } catch (err) {
    return { success: false, message: err.message || 'Connection failed.' };
  }
}
