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

function App() {
    const [username, setUsername] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setUsername(null);
        setIsLoggedIn(false);
        window.location.reload();
    };

    return (
        <Router>
            <div className="App" style={{ padding: '100px', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
                <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} username={username} />
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/login" element={<LoginForm setIsLoggedIn={setIsLoggedIn} />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/activate/:token" element={<ActivationPage />} />
                        <Route path="/" element={<HomePage />} />
                    </Routes>
                </Suspense>
            </div>
        </Router>
    );
}

export default App;
