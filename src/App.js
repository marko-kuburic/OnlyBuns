import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import UserHome from './components/UserHome';
import 'leaflet/dist/leaflet.css';
import './App.css';

function App() {
    const [posts, setPosts] = useState([]);

    const fetchPosts = () => {
        fetch('http://localhost:8080/api/posts')
            .then((response) => response.json())
            .then((data) => {
                console.log('Fetched posts:', data);
                setPosts(data);
            })
            .catch((error) => console.error('Error fetching posts:', error));
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostSubmit = (formData, resetFormCallback) => {
        fetch('http://localhost:8080/api/posts', {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Post created:', data);
                fetchPosts();
                if (resetFormCallback) resetFormCallback();
            })
            .catch((error) => console.error('Error creating post:', error));
    };

    return (
        <Router>
            <div className="App">
                <nav>
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/create-post" className="nav-link">Create Post</Link>
                    <Link to="/posts" className="nav-link">View Posts</Link>
                    <Link to="/nearby-posts" className="nav-link">Nearby Posts</Link>
                    <Link to="/chat" className="nav-link">Chat</Link>
                    <Link to="/profile" className="nav-link">My profile</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<UserHome />} />
                    <Route path="/create-post" element={<PostForm onSubmit={handlePostSubmit} />} />
                    <Route path="/posts" element={<PostList posts={posts} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
