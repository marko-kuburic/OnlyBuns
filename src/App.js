import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import ActivationPage from './components/ActivationPage';

function HomePage({ username }) {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div>
            <h1>Post Your Rabbit</h1>
            {username ? (
                <p>Welcome, {username}!</p> // Show username if logged in
            ) : (
                <button onClick={handleLoginRedirect}>Login</button> // Show Login button if not logged in
            )}
            <PostForm />
            <PostList />
        </div>
    );
}

function App() {
    const [username, setUsername] = useState(null);

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
                        setUsername(data.username); // Set the username from the response
                    })
                    .catch((error) => {
                        console.error("Error fetching user data:", error);
                    });
            } catch (error) {
                console.error("Failed to decode token", error);
            }
        }
    }, []);

    return (
        <Router>
            <div className="App">
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/activate/:token" element={<ActivationPage />} />
                        <Route path="/" element={<HomePage username={username} />} />
                    </Routes>
                </Suspense>
            </div>
        </Router>
    );
}

export default App;
