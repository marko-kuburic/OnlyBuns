// src/components/UserProfile.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function UserProfile() {
    const { userId } = useParams(); // Get the userId from the URL
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('authToken'); // Retrieve token from storage
                const response = await fetch(`http://localhost:8080/api/users/id/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch user');
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [userId]);

    if (!user) return <p>Loading user profile...</p>;

    return (
        <div style={{
            backgroundColor: '#fff',
            padding: '2rem',
            margin: '2rem auto',
            borderRadius: '10px',
            maxWidth: '600px',
            textAlign: 'left'
        }}>
            <h2 style={{
                fontSize: '2rem',
                marginBottom: '1rem',
                color: '#333'
            }}>{user.username}'s Profile</h2>
            <p style={{ fontSize: '1.1rem', color: '#333' }}><strong>Name:</strong> {user.name}</p>
            <p style={{ fontSize: '1.1rem', color: '#333' }}><strong>Surname:</strong> {user.surname}</p>
            <p style={{ fontSize: '1.1rem', color: '#333' }}><strong>Email:</strong> {user.email}</p>
            <p style={{ fontSize: '1.1rem', color: '#333' }}><strong>Followers:</strong> {user.followersCount}</p>
            <p style={{ fontSize: '1.1rem', color: '#333' }}><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
    );
}

export default UserProfile;
