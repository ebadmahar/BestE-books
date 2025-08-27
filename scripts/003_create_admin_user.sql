-- Insert a default admin user (you'll need to create this user in Supabase Auth first)
-- This is just an example - replace with actual admin user ID after creating the auth user

-- First, you need to sign up an admin user through the Supabase Auth interface or API
-- Then use their user ID here

-- Example admin user insertion (replace 'your-admin-user-id' with actual UUID)
-- INSERT INTO admin_users (id, email, role) VALUES 
--   ('your-admin-user-id', 'admin@modernbookstore.com', 'admin');

-- For now, we'll create a placeholder that you can update later
INSERT INTO admin_users (id, email, role) VALUES 
  ('00000000-0000-0000-0000-000000000000', 'admin@modernbookstore.com', 'admin')
ON CONFLICT (id) DO NOTHING;

-- Note: You'll need to:
-- 1. Create an admin user account through Supabase Auth
-- 2. Get their user ID 
-- 3. Update this record with the correct ID
-- 4. Or manually insert a new record with the correct admin user ID
