import React from 'react';
import { Link } from 'react-router-dom';
import '../UserHome.css';

function UserHome() {
    return (
        <div className="user-home">
            <h1>Welcome Back!</h1>
            <div className="link-container">
                <div className="link-card">
                    <h2>Followed Users' Posts</h2>
                    <p>See posts from the users you follow.</p>
                    <Link to="/posts" className="link-button">View Posts</Link>
                </div>
                <div className="link-card">
                    <h2>Create a New Post</h2>
                    <p>Share your story and connect with others.</p>
                    <Link to="/create-post" className="link-button">Create Post</Link>
                </div>
                <div className="link-card">
                    <h2>Nearby Posts</h2>
                    <p>Find posts from users near your location on the map.</p>
                    <button className="link-button">Explore Map</button>
                </div>
                <div className="link-card">
                    <h2>Chat with Users</h2>
                    <p>Start a conversation with your friends on the platform.</p>
                    <button className="link-button">Open Chat</button>
                </div>
                <div className="link-card">
                    <h2>Profile</h2>
                    <p>Manage your account details and view your profile.</p>
                    <button className="link-button">Go to Profile</button>
                </div>
            </div>
        </div>
    );
}

export default UserHome;
