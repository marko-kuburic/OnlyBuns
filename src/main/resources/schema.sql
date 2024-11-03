-- Drop tables if they exist to avoid conflicts
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
                       password VARCHAR(100) NOT NULL,
                       email VARCHAR(100) UNIQUE NOT NULL,
                       name VARCHAR(32) NOT NULL,
                       surname VARCHAR(32) NOT NULL,
                       followers INTEGER DEFAULT 0 NOT NULL,
                       activated BOOLEAN DEFAULT FALSE NOT NULL,
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
                       image_data BYTEA NOT NULL,
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

-- Sample Data (Optional)
INSERT INTO users (username, email, password, name, surname, activated) VALUES
                                                                            ('john_doe', 'john@example.com', 'hashed_password_1', 'John', 'Doe', TRUE),
                                                                            ('jane_smith', 'jane@example.com', 'hashed_password_2', 'Jane', 'Smith', TRUE);

INSERT INTO locations (name, address, latitude, longitude, service_type) VALUES
                                                                             ('Bunny Shelter', '123 Rabbit St', 40.712776, -74.005974, 'shelter'),
                                                                             ('Happy Vet Clinic', '456 Carrot Blvd', 34.052235, -118.243683, 'veterinarian');

INSERT INTO posts (user_id, location_id, content, image_data) VALUES
                                                                  (1, 1, 'Content of the first post', '\\x89504E470D0A1A0A...'), -- placeholder binary data
                                                                  (2, 2, 'Content of the second post', '\\x89504E470D0A1A0A...');

INSERT INTO comments (post_id, user_id, content) VALUES
                                                     (1, 2, 'Great post!'),
                                                     (2, 1, 'Thanks for sharing!');

INSERT INTO likes (post_id, user_id) VALUES
                                         (1, 2),
                                         (2, 1);
