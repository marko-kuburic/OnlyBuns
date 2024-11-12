/*-- Drop tables if they exist to avoid conflicts
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS ads CASCADE;
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS likes CASCADE;

-- Table for Users
CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       username VARCHAR(50) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       name VARCHAR(32) NOT NULL,
                       surname VARCHAR(32) NOT NULL,
                       address VARCHAR(255), -- New address field
                       followers_count INTEGER DEFAULT 0 NOT NULL,
                       activated BOOLEAN DEFAULT FALSE NOT NULL,
                       is_admin BOOLEAN DEFAULT FALSE NOT NULL,
                       activation_token VARCHAR(100),
                       activation_expires_at TIMESTAMP,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for Locations
CREATE TABLE locations (
                           id SERIAL PRIMARY KEY,
                           name VARCHAR(255) NOT NULL,
                           address VARCHAR(255),
                           latitude DOUBLE PRECISION,
                           longitude DOUBLE PRECISION,
                           service_type VARCHAR(50) CHECK (service_type IN ('shelter', 'veterinarian', 'other')),
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for Posts
CREATE TABLE posts (
                       id SERIAL PRIMARY KEY,
                       user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                       location_id INTEGER REFERENCES locations(id) ON DELETE SET NULL,
                       image_path TEXT NOT NULL,
                       content TEXT NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       likes_count INTEGER DEFAULT 0 NOT NULL,
                       comments_count INTEGER DEFAULT 0 NOT NULL
);

-- Table for Comments
CREATE TABLE comments (
                          id SERIAL PRIMARY KEY,
                          post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
                          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                          content TEXT NOT NULL,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for Likes
CREATE TABLE likes (
                       id SERIAL PRIMARY KEY,
                       post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
                       user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       UNIQUE (post_id, user_id) -- ensures a user can like a post only once
);

-- Table for Ads (Advertising Service)
CREATE TABLE ads (
                     id SERIAL PRIMARY KEY,
                     post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
                     agency_name VARCHAR(255) NOT NULL,
                     description TEXT,
                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster lookup
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_locations_service_type ON locations(service_type);
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);

-- Insert sample data into users table with the address field included
INSERT INTO users (username, email, password, name, surname, address, activated, is_admin, activation_token, activation_expires_at)
VALUES
    ('admin', 'admin@gmail.com', 'hashed_password_0', 'Admin', 'User', '123 Admin Lane', TRUE, TRUE, NULL, NULL),
    ('john_doe', 'john@example.com', 'hashed_password_1', 'John', 'Doe', '456 John St', FALSE, FALSE, 'sample_token_123', NOW() + INTERVAL '1 day'),
    ('jane_smith', 'jane@example.com', 'hashed_password_2', 'Jane', 'Smith', '789 Jane Ave', FALSE, FALSE, 'sample_token_456', NOW() + INTERVAL '1 day');

-- Insert sample data into locations table
INSERT INTO locations (name, address, latitude, longitude, service_type) VALUES
                                                                             ('Bunny Shelter', '123 Rabbit St', 40.712776, -74.005974, 'shelter'),
                                                                             ('Happy Vet Clinic', '456 Carrot Blvd', 34.052235, -118.243683, 'veterinarian');

-- Insert sample data into posts table
INSERT INTO posts (user_id, location_id, content, image_path, created_at, updated_at) VALUES
                                                                                          (1, 1, 'Snowflake is a gentle soul with the softest white fur that feels like a cloud. Her big, curious eyes sparkle with innocence, and her favorite pastime is hopping around in the garden. She loves to nibble on fresh greens and enjoys quiet moments with her favorite human.', '/images/rabbit1.jpg', NOW(), NOW()),
                                                                                          (2, 2, 'Midnight is a mysterious, sleek black bunny with a heart full of love. Known for his gentle, calming presence, he adores snuggling up on a cozy blanket. Midnight’s playful spirit shines when he chases after his toy ball, a little bundle of joy and curiosity.', '/images/rabbit2.jpg', NOW(), NOW()),
                                                                                          (1, NULL, 'Clover is a sweet, brown-spotted bunny with an adventurous streak. Her twitching nose never stops as she explores her surroundings. Clover’s signature move is a little hop and twist in the air, showing off her playful personality. She’s a gentle friend and brings happiness wherever she hops.', '/images/rabbit3.jpg', NOW(), NOW());


-- Insert sample data into comments table
INSERT INTO comments (post_id, user_id, content) VALUES
                                                     (1, 2, 'Great post!'),
                                                     (2, 1, 'Thanks for sharing!');

-- Insert sample data into likes table
INSERT INTO likes (post_id, user_id) VALUES
                                         (1, 2),
                                         (2, 1);
*/