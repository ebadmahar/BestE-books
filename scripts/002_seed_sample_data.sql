-- Insert sample books
INSERT INTO books (title, author, description, cover_image_url, price, is_free, category, pdf_url) VALUES
  ('The Great Adventure', 'John Smith', 'An epic tale of courage and discovery in uncharted lands.', '/placeholder.svg?height=400&width=300', 19.99, false, 'Adventure', null),
  ('Digital Marketing Mastery', 'Sarah Johnson', 'Complete guide to modern digital marketing strategies.', '/placeholder.svg?height=400&width=300', 0.00, true, 'Business', '/sample.pdf'),
  ('Cooking Fundamentals', 'Chef Maria', 'Learn the basics of cooking with this comprehensive guide.', '/placeholder.svg?height=400&width=300', 24.99, false, 'Cooking', null),
  ('JavaScript Essentials', 'Tech Writer', 'Master JavaScript programming from basics to advanced.', '/placeholder.svg?height=400&width=300', 0.00, true, 'Technology', '/sample.pdf'),
  ('Mystery of the Old Manor', 'Detective Author', 'A thrilling mystery set in a Victorian mansion.', '/placeholder.svg?height=400&width=300', 15.99, false, 'Mystery', null),
  ('Healthy Living Guide', 'Dr. Wellness', 'Your complete guide to a healthier lifestyle.', '/placeholder.svg?height=400&width=300', 22.50, false, 'Health', null);

-- Insert sample blog posts
INSERT INTO blog_posts (title, content, excerpt, featured_image_url, published) VALUES
  ('Welcome to Our Bookstore', 'We are excited to launch our new online bookstore featuring a curated collection of amazing books across various genres. Our mission is to connect readers with stories that inspire, educate, and entertain.', 'Discover our new online bookstore with curated collections.', '/placeholder.svg?height=300&width=600', true),
  ('Top 5 Books This Month', 'Here are our most popular books this month based on reader reviews and sales. From thrilling adventures to practical guides, these books have captured our readers'' hearts.', 'Check out the most popular books this month.', '/placeholder.svg?height=300&width=600', true),
  ('Reading Tips for Busy People', 'Finding time to read can be challenging in our busy lives. Here are some practical tips to help you incorporate more reading into your daily routine.', 'Practical tips for reading more in your busy schedule.', '/placeholder.svg?height=300&width=600', true);
