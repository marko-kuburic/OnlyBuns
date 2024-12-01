import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa'; // Import the user icon from react-icons

function Navbar({ isLoggedIn, handleLogout, userId }) {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    const handleProfileRedirect = () => {
        navigate(`/myprofile/${userId}`);
    };

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '60px',
            backgroundColor: '#222',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
        }}>
            {/* Left Section */}
            <div style={{ paddingLeft: '20px' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    OnlyBuns
                </Link>
            </div>

            {/* Center Section */}
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '15px' }}>
                {isLoggedIn && (
                    <>
                        <Link to="/create-post" style={{ color: 'white', textDecoration: 'none', fontSize: '1rem' }}>
                            Create Post
                        </Link>
                        <Link to="/trends" style={{ color: 'white', textDecoration: 'none', fontSize: '1rem' }}>
                            Trends
                        </Link>
                        <Link to="/nearby-posts" style={{ color: 'white', textDecoration: 'none', fontSize: '1rem' }}>
                            Nearby Posts
                        </Link>
                        <Link to="/chat" style={{ color: 'white', textDecoration: 'none', fontSize: '1rem' }}>
                            Chat
                        </Link>
                    </>
                )}
            </div>

            {/* Right Section */}
            <div style={{ paddingRight: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {isLoggedIn ? (
                    <>
                        {/* Profile Icon */}
                        <FaUserCircle
                            onClick={handleProfileRedirect}
                            style={{
                                fontSize: '1.8rem',
                                cursor: 'pointer',
                                color: 'white',
                            }}
                            title="Profile"
                        />
                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            style={{
                                background: 'none',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1rem',
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleLoginRedirect}
                        style={{
                            background: 'none',
                            color: 'white',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1rem',
                        }}
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
