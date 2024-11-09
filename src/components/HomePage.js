import React from 'react';
import { useNavigate } from 'react-router-dom';
import PostForm from './PostForm';
import PostList from './PostList';

function HomePage({ username, handleLogout }) {
    const navigate = useNavigate();


    return (
        <div>
            <h1>OnlyBuns</h1>

        </div>
    );
}

export default HomePage;
