import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import Navbar from './components/Navbar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import ActivationPage from './components/ActivationPage';
import HomePage from './components/HomePage';
import UserProfile from './components/UserProfile';

function App() {
    const [username, setUsername] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [posts, setPosts] = useState([]); // State to store posts

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const decodedToken = jwt_decode(token);
                const userId = decodedToken.userId;

                // Fetch username from backend using userId
                fetch(`http://localhost:8080/api/users/${userId}`)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Failed to fetch user data");
                        }
                        return response.json();
                    })
                    .then((data) => {
                        setUsername(data.username);
                        setIsLoggedIn(true);
                    })
                    .catch((error) => {
                        console.error("Error fetching user data:", error);
                    });
            } catch (error) {
                console.error("Failed to decode token", error);
            }
        }
    }, [isLoggedIn]);

    // Fetch posts from backend
    useEffect(() => {
        fetch('http://localhost:8080/api/posts')
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch posts");
                }
                return response.json();
            })
            .then((data) => {
                setPosts(data); // Set the posts state with the fetched data
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
            });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setUsername(null);
        setIsLoggedIn(false);
        window.location.reload();
    };

    const handlePostSubmit = (formData, resetForm) => {
        // Here you can handle the form submission, for example, sending the data to the backend
        console.log('Form submitted:', formData);

        // Reset the form after submission
        resetForm();
    };

    return (
        <Router>
            <div className="App" style={{ paddingTop: '60px', backgroundColor: '#f5f5f5' }}>
                <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} username={username} />
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/login" element={<LoginForm setIsLoggedIn={setIsLoggedIn} />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/activate/:token" element={<ActivationPage />} />
                        <Route path="/profile/:userId" element={<UserProfile />} />
                        <Route path="/" element={<HomePage />} />
                        <Route path="/create-post" element={<PostForm onSubmit={handlePostSubmit} />} />
                        <Route path="/posts" element={<PostList posts={posts} />} /> {/* Pass posts as prop */}
                    </Routes>
                </Suspense>
            </div>
        </Router>
    );
}

export default App;
