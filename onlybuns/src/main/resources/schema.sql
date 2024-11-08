-- Table for Users
CREATE TABLE IF NOT EXISTS users (
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
CREATE TABLE IF NOT EXISTS locations (
                                         id SERIAL PRIMARY KEY,
                                         name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    service_type VARCHAR(50) CHECK (service_type IN ('shelter', 'veterinarian', 'other')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Table for Posts
CREATE TABLE IF NOT EXISTS posts (
                                     id SERIAL PRIMARY KEY,
                                     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    address VARCHAR(255),
    image_data BYTEA NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    likes_count INTEGER DEFAULT 0 NOT NULL,
    comments_count INTEGER DEFAULT 0 NOT NULL
    );

-- Table for Comments
CREATE TABLE IF NOT EXISTS comments (
                                        id SERIAL PRIMARY KEY,
                                        post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Table for Likes
CREATE TABLE IF NOT EXISTS likes (
                                     id SERIAL PRIMARY KEY,
                                     post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (post_id, user_id) -- ensures a user can like a post only once
    );

-- Table for Ads (Advertising Service)
CREATE TABLE IF NOT EXISTS ads (
                                   id SERIAL PRIMARY KEY,
                                   post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    agency_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Indexes for faster lookup
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_locations_service_type ON locations(service_type);
CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);

-- Sample Data (Optional) using ON CONFLICT
INSERT INTO users (username, email, password, name, surname, activated) VALUES
                                                                            ('john_doe', 'john@example.com', 'hashed_password_1', 'John', 'Doe', TRUE),
                                                                            ('jane_smith', 'jane@example.com', 'hashed_password_2', 'Jane', 'Smith', TRUE)
    ON CONFLICT (username) DO NOTHING;

INSERT INTO locations (name, address, latitude, longitude, service_type) VALUES
                                                                             ('Bunny Shelter', '123 Rabbit St', 40.712776, -74.005974, 'shelter'),
                                                                             ('Happy Vet Clinic', '456 Carrot Blvd', 34.052235, -118.243683, 'veterinarian');

-- INSERT INTO posts (user_id, latitude, longitude, address, image_data, content, likes_count, comments_count) VALUES
--                                                                                                                 (1, 45.2671, 19.8335, 'Example Street, Novi Sad', decode('hex_encoded_image_data', 'hex'), 'Sample content for post 1', 0, 0),
--                                                                                                                 (2, 45.2671, 19.8335, 'Another Example Street, Novi Sad', decode('hex_encoded_image_data', 'hex'), 'Sample content for post 2', 0, 0)
--     ON CONFLICT DO NOTHING;
