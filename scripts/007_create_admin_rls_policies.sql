-- Disable RLS for admin operations on books table
-- Since this is an admin-only application, we can safely disable RLS
-- or create permissive policies for admin operations

-- Option 1: Disable RLS entirely for books table (simplest for admin-only app)
ALTER TABLE books DISABLE ROW LEVEL SECURITY;

-- Option 2: If you want to keep RLS enabled, create permissive policies
-- ALTER TABLE books ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all operations on books" ON books FOR ALL USING (true) WITH CHECK (true);

-- Do the same for other admin tables
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;
ALTER TABLE book_requests DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;

-- Keep RLS on blogs table if it exists but create permissive policy
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'blogs') THEN
        ALTER TABLE blogs DISABLE ROW LEVEL SECURITY;
    END IF;
END $$;
