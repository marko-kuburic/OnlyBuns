import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isLoggedIn, handleLogout, username }) {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
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
            {/* Left Section with Padding for OnlyBuns */}
            <div style={{ paddingLeft: '20px' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    OnlyBuns
                </Link>
            </div>

            {/* Center Section */}
            <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                <Link to="/posts" style={{ color: 'white', textDecoration: 'none', fontSize: '1rem' }}>
                    Posts
                </Link>
            </div>

            {/* Right Section with Padding for Login/Logout */}
            <div style={{ paddingRight: '20px' }}>
                {isLoggedIn ? (
                    <>
                        <span style={{ marginRight: '15px' }}>Welcome, {username}!</span>
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
