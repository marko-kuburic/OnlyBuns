import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isLoggedIn, handleLogout, username }) {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '1rem 2rem',
            backgroundColor: '#333',
            color: 'white',
            alignItems: 'center',
            width: '100vw', // Full width
            position: 'fixed', // Fixed position to stick to the top
            top: 0,
            left: 0,
            boxSizing: 'border-box',
            zIndex: 1000, // Ensures it stays on top
            borderRadius: '0' // No rounded edges
        }}>
            {/* Left Section - Logo or Home Link */}
            <div style={{ flex: '1', textAlign: 'left' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.5rem' }}>
                    OnlyBuns
                </Link>
            </div>

            {/* Center Section - Navigation Links */}
            <div style={{ display: 'flex', gap: '1.5rem', flex: '1', justifyContent: 'center' }}>
                <Link to="/posts" style={{ color: 'white', textDecoration: 'none', fontSize: '1rem' }}>
                    Posts
                </Link>
                <Link to="/create-post" style={{ color: 'white', textDecoration: 'none', fontSize: '1rem' }}>
                    Create Post
                </Link>
            </div>

            {/* Right Section - Login/Logout and Username */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1', justifyContent: 'flex-end' }}>
                {isLoggedIn && <span style={{ color: 'white', marginRight: '0.5rem', fontSize: '1rem' }}>Welcome, {username}!</span>}
                {isLoggedIn ? (
                    <button onClick={handleLogout} style={{ color: 'white', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
                        Logout
                    </button>
                ) : (
                    <button onClick={handleLoginRedirect} style={{ color: 'white', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
