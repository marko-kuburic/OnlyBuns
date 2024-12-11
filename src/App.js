// src/App.js

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
import ProtectedRoute from './components/ProtectedRoute';// Import the ProtectedRoute component
import MyProfile from './components/MyProfile';// Import the MyProfile component
import SettingsForm from './components/SettingsForm'; // Import the Settings component
import TrendsPage from './components/TrendsPage';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const decodedToken = jwt_decode(token);
                // Check if token is still valid (not expired)
                if (decodedToken.exp * 1000 > Date.now()) {
                    setIsLoggedIn(true);
                    setUsername(decodedToken.username); // Assuming your token includes username
                    setUserId(decodedToken.userId);     // Assuming your token includes userId
                } else {
                    localStorage.removeItem('authToken');
                }
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        setUsername(null);
        setUserId(null);
        window.location.reload();
    };

    return (
        <Router>
            <div className="App" style={{ paddingTop: '60px', backgroundColor: '#f5f5f5' }}>
                <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} username={username} userId={userId} />
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginForm setIsLoggedIn={setIsLoggedIn} />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/activate/:token" element={<ActivationPage />} />
                        <Route path="/profile/:userId" element={<UserProfile />} />
                        <Route path="/myprofile/:userId" element={<MyProfile />} />
                        <Route path="/posts" element={<PostList />} />
                        <Route path="/profile/:userId/settings" element={<SettingsForm />} />



                        {/* Protected Routes */}
                        <Route path="/create-post" element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <PostForm />
                            </ProtectedRoute>
                        } />
                        <Route path="/trends" element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <TrendsPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/nearby-posts" element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <div>Nearby Posts</div>
                            </ProtectedRoute>
                        } />
                        <Route path="/chat" element={
                            <ProtectedRoute isLoggedIn={isLoggedIn}>
                                <div>Chat</div>
                            </ProtectedRoute>
                        } />
                    </Routes>
                </Suspense>
            </div>
        </Router>
    );
}

export default App;
