import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostList from './PostList';
import jwt_decode from 'jwt-decode';

function MyProfile() {
    const { userId } = useParams();
    const [userData, setUserData] = useState({});
    const [posts, setPosts] = useState([]);
    const [followersCount, setFollowersCount] = useState(0);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Get logged-in user's ID from the token
        const token = localStorage.getItem('authToken');
        if (token) {
            try {
                const decodedToken = jwt_decode(token);
                setLoggedInUserId(decodedToken.userId);
            } catch (error) {
                console.error('Invalid token:', error);
            }
        }

        const fetchUserData = async () => {
            try {
                const userResponse = await fetch(`http://localhost:8080/api/users/id/${userId}`);
                const userData = await userResponse.json();
                setUserData(userData);

                const postsResponse = await fetch(`http://localhost:8080/api/posts/user/${userId}`);
                const postsData = await postsResponse.json();
                setPosts(postsData);

                const followersResponse = await fetch(`http://localhost:8080/api/users/${userId}/followers`);
                const followersData = await followersResponse.json();
                setFollowers(followersData);
                setFollowersCount(followersData.length);

                const followingResponse = await fetch(`http://localhost:8080/api/users/${userId}/following`);
                const followingData = await followingResponse.json();
                setFollowing(followingData);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading...</div>;
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <h2 style={{ textAlign: 'center', color: '#333' }}>User Profile</h2>
            <div style={{ backgroundColor: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
                <h3 style={{ color: '#007bff', marginBottom: '1rem' }}>{userData.name} {userData.surname}</h3>
                <p><strong>Email:</strong> {userData.email}</p>
                <p><strong>Address:</strong> {userData.address}</p>
                <p><strong>Followers:</strong> {followersCount}</p>
                <p><strong>Following:</strong> {following.length}</p>
                {loggedInUserId === parseInt(userId) && (
                    <button
                        onClick={() => navigate(`/profile/${userId}/settings`)}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: '#007bff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Settings
                    </button>
                )}
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: '#007bff' }}>Posts</h3>
                {posts.length > 0 ? (
                    <PostList posts={posts} />
                ) : (
                    <p style={{ textAlign: 'center', color: '#666' }}>No posts available.</p>
                )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
                <div style={{ flex: 1, backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                    <h3 style={{ textAlign: 'center', color: '#007bff', marginBottom: '1rem' }}>Followers</h3>
                    {followers.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {followers.map(follower => (
                                <li key={follower.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}>
                                    {follower.username}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#666' }}>No followers yet.</p>
                    )}
                </div>

                <div style={{ flex: 1, backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '8px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)' }}>
                    <h3 style={{ textAlign: 'center', color: '#007bff', marginBottom: '1rem' }}>Following</h3>
                    {following.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {following.map(followed => (
                                <li key={followed.id} style={{ padding: '0.5rem 0', borderBottom: '1px solid #ddd' }}>
                                    {followed.username}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#666' }}>Not following anyone yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyProfile;
