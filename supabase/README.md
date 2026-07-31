# Supabase Database & Storage Setup Instructions

This directory contains the database schema and storage bucket policies for **Forever Us**.

## 1-Click Database Setup:

1. Open your **[Supabase Dashboard](https://supabase.com/dashboard)**.
2. Select your project and click on **SQL Editor** in the left sidebar.
3. Open `supabase/schema.sql` (or copy the contents of `supabase/schema.sql`).
4. Paste the SQL script into the Supabase SQL Editor and click **Run**.

This script will automatically:
- Create the `websites` table with JSONB fields for story pages.
- Create indexes for fast `/love/{slug}` lookups.
- Create Row Level Security (RLS) policies.
- Create the `media` storage bucket for uploaded photos and background music.
