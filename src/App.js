import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import PostForm from './components/PostForm';
import PostList from './components/PostList';

function App() {
    return (
        <Router>
            <div className="App">
                <h1>Post Your Rabbit</h1>
                <Routes>
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/" element={
                        <>
                            <LoginForm />
                            <PostForm />
                            <PostList />
                        </>
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;