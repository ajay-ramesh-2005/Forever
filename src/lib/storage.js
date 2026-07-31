import { supabase, isSupabaseConfigured } from './supabase';

/**
 * Uploads a file (photo or audio) to Supabase Storage if configured,
 * or falls back to backend Express upload API / base64 Data URL.
 */
export async function uploadMediaFile(file, bucketName = 'media') {
  if (!file) return null;

  // 1. Try Supabase Storage if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (!error && data) {
        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          return publicUrlData.publicUrl;
        }
      } else {
        console.warn('Supabase storage upload error, falling back:', error?.message);
      }
    } catch (err) {
      console.warn('Supabase storage exception:', err);
    }
  }

  // 2. Try Express Backend Upload API
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      const data = await res.json();
      return data.url;
    }
  } catch (err) {
    console.warn('Backend API upload fallback error:', err);
  }

  // 3. Data URL Fallback
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}
