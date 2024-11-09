import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PostList from './PostList';

function HomePage({ username, handleLogout }) {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/posts');
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <p>Loading posts...</p>;
    }

    return (
        <div style={{ padding: '0px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <PostList posts={posts} />
        </div>
    );
}

export default HomePage;
