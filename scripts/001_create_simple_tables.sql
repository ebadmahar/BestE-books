-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  author TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  book_url TEXT, -- For free books, this is the download URL
  is_free BOOLEAN DEFAULT true,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  content TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create book requests table
CREATE TABLE IF NOT EXISTS book_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  book_request TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES 
  ('maintenance_mode', 'false'),
  ('whatsapp_number', '+1234567890')
ON CONFLICT (key) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on books" ON books FOR SELECT USING (true);
CREATE POLICY "Allow public read access on blogs" ON blogs FOR SELECT USING (true);

-- Create policies for admin access (we'll use service role key for admin operations)
CREATE POLICY "Allow service role full access on books" ON books USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access on blogs" ON blogs USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access on book_requests" ON book_requests USING (auth.role() = 'service_role');
CREATE POLICY "Allow service role full access on site_settings" ON site_settings USING (auth.role() = 'service_role');

-- Allow public to insert book requests
CREATE POLICY "Allow public insert on book_requests" ON book_requests FOR INSERT WITH CHECK (true);
