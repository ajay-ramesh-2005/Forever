-- ========================================================
-- FOREVER US - SUPABASE DATABASE & STORAGE SCHEMA MIGRATION
-- ========================================================

-- 1. Create Websites Table
CREATE TABLE IF NOT EXISTS public.websites (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT,
  "girlfriendName" TEXT NOT NULL,
  "startDate" TEXT,
  "musicUrl" TEXT,
  "musicTitle" TEXT,
  page1 JSONB,
  page2 JSONB,
  memories JSONB,
  page4 JSONB,
  page5 JSONB,
  ending JSONB,
  theme JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning-fast slug lookup
CREATE INDEX IF NOT EXISTS idx_websites_slug ON public.websites (slug);
CREATE INDEX IF NOT EXISTS idx_websites_updated ON public.websites (updated_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access
CREATE POLICY "Public Read Access"
  ON public.websites
  FOR SELECT
  USING (true);

-- Allow Public Insert Access
CREATE POLICY "Public Insert Access"
  ON public.websites
  FOR INSERT
  WITH CHECK (true);

-- Allow Public Update Access
CREATE POLICY "Public Update Access"
  ON public.websites
  FOR UPDATE
  USING (true);

-- Allow Public Delete Access
CREATE POLICY "Public Delete Access"
  ON public.websites
  FOR DELETE
  USING (true);


-- 2. Create Storage Bucket for Media (Photos & Music)
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Public Storage Read Policy
CREATE POLICY "Public Media Read Access"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'media');

-- Public Storage Insert Policy
CREATE POLICY "Public Media Insert Access"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'media');

-- Public Storage Update Policy
CREATE POLICY "Public Media Update Access"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'media');

-- Public Storage Delete Policy
CREATE POLICY "Public Media Delete Access"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'media');
