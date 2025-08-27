-- Fix database schema inconsistencies
-- This script updates the simple schema to match the main schema structure

-- Drop existing policies first
DROP POLICY IF EXISTS "Allow public read access on books" ON books;
DROP POLICY IF EXISTS "Allow public read access on blogs" ON blogs;
DROP POLICY IF EXISTS "Allow service role full access on books" ON books;
DROP POLICY IF EXISTS "Allow service role full access on blogs" ON blogs;
DROP POLICY IF EXISTS "Allow service role full access on book_requests" ON book_requests;
DROP POLICY IF EXISTS "Allow service role full access on site_settings" ON site_settings;
DROP POLICY IF EXISTS "Allow public insert on book_requests" ON book_requests;

-- Update books table to match main schema
ALTER TABLE books 
  RENAME COLUMN name TO title;

ALTER TABLE books 
  RENAME COLUMN book_url TO pdf_url;

-- Add missing price column if it doesn't exist
ALTER TABLE books 
  ADD COLUMN IF NOT EXISTS price DECIMAL(10,2);

-- Update default for is_free to match main schema
ALTER TABLE books 
  ALTER COLUMN is_free SET DEFAULT false;

-- Update blogs table to match blog_posts structure
ALTER TABLE blogs 
  RENAME TO blog_posts;

ALTER TABLE blog_posts 
  RENAME COLUMN image_url TO featured_image_url;

ALTER TABLE blog_posts 
  ADD COLUMN IF NOT EXISTS excerpt TEXT;

ALTER TABLE blog_posts 
  ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT false;

-- Remove tags column as it's not in main schema
ALTER TABLE blog_posts 
  DROP COLUMN IF EXISTS tags;

-- Update book_requests table structure
ALTER TABLE book_requests 
  RENAME COLUMN book_request TO book_title;

ALTER TABLE book_requests 
  ADD COLUMN IF NOT EXISTS author TEXT;

ALTER TABLE book_requests 
  ADD COLUMN IF NOT EXISTS message TEXT;

ALTER TABLE book_requests 
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create consistent RLS policies
-- Public read access for books and blog posts
CREATE POLICY "Allow public read access on books" ON books 
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on blog_posts" ON blog_posts 
  FOR SELECT USING (published = true);

-- Admin access policies
CREATE POLICY "Allow service role full access on books" ON books 
  USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access on blog_posts" ON blog_posts 
  USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access on book_requests" ON book_requests 
  USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access on site_settings" ON site_settings 
  USING (auth.role() = 'service_role');

-- Admin users policies
CREATE POLICY "Allow admins to view admin data" ON admin_users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow admins to update their own data" ON admin_users 
  FOR UPDATE USING (auth.uid() = id);

-- Allow public to insert book requests
CREATE POLICY "Allow public insert on book_requests" ON book_requests 
  FOR INSERT WITH CHECK (true);

-- Update site settings with additional defaults
INSERT INTO site_settings (key, value) VALUES 
  ('site_title', 'Modern Bookstore'),
  ('site_description', 'Discover amazing books and stories')
ON CONFLICT (key) DO NOTHING;
