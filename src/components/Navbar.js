import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isLoggedIn, handleLogout, username }) {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#333', color: 'white', alignItems: 'center' }}>
            {/* Left Section - For Logo or Home Link */}
            <div style={{ flex: '1' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    OnlyBuns
                </Link>
            </div>

            {/* Center Section - Navigation Links */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flex: '1' }}>
                <Link to="/posts" style={{ color: 'white', textDecoration: 'none' }}>
                    Posts
                </Link>
                <Link to="/create-post" style={{ color: 'white', textDecoration: 'none' }}>
                    Create Post
                </Link>
            </div>

            {/* Right Section - Login/Logout and Username */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1', justifyContent: 'flex-end' }}>
                {isLoggedIn && <span style={{ color: 'white', marginRight: '0.5rem' }}>Welcome, {username}!</span>}
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
