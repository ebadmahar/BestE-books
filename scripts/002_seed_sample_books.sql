-- Insert sample books
INSERT INTO books (name, author, description, cover_image_url, book_url, is_free, category) VALUES
  ('The Great Gatsby', 'F. Scott Fitzgerald', 'A classic American novel about the Jazz Age and the American Dream.', '/placeholder.svg?height=300&width=200', 'https://www.gutenberg.org/files/64317/64317-pdf.pdf', true, 'Fiction'),
  ('To Kill a Mockingbird', 'Harper Lee', 'A gripping tale of racial injustice and childhood innocence in the American South.', '/placeholder.svg?height=300&width=200', 'https://example.com/mockingbird.pdf', true, 'Fiction'),
  ('1984', 'George Orwell', 'A dystopian social science fiction novel about totalitarian control.', '/placeholder.svg?height=300&width=200', null, false, 'Science Fiction'),
  ('Pride and Prejudice', 'Jane Austen', 'A romantic novel about manners, upbringing, morality, and marriage.', '/placeholder.svg?height=300&width=200', 'https://www.gutenberg.org/files/1342/1342-pdf.pdf', true, 'Romance'),
  ('The Catcher in the Rye', 'J.D. Salinger', 'A controversial novel about teenage rebellion and alienation.', '/placeholder.svg?height=300&width=200', null, false, 'Fiction'),
  ('Harry Potter and the Philosopher''s Stone', 'J.K. Rowling', 'The first book in the magical Harry Potter series.', '/placeholder.svg?height=300&width=200', null, false, 'Fantasy');

-- Insert sample blog posts
INSERT INTO blogs (title, image_url, description, content, tags) VALUES
  ('Top 10 Books to Read This Summer', '/placeholder.svg?height=400&width=600', 'Discover the best books to add to your summer reading list.', 'Summer is the perfect time to dive into some great books. Here are our top 10 recommendations for your summer reading list...', ARRAY['reading', 'summer', 'recommendations']),
  ('The Art of Book Collecting', '/placeholder.svg?height=400&width=600', 'Learn the basics of building a meaningful book collection.', 'Book collecting is more than just accumulating books. It''s about curating a personal library that reflects your interests and passions...', ARRAY['collecting', 'books', 'hobby']),
  ('Digital vs Physical Books: The Great Debate', '/placeholder.svg?height=400&width=600', 'Exploring the pros and cons of digital and physical reading formats.', 'The debate between digital and physical books continues to divide readers. Let''s explore the benefits of each format...', ARRAY['digital', 'physical', 'reading']);
