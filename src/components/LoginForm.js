import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm({ setIsLoggedIn }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const loginData = { username, password };

        fetch('http://localhost:8080/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((data) => {
                        throw new Error(data.message || 'Login failed. Please check your credentials.');
                    });
                }
                return response.json();
            })
            .then((data) => {
                const token = data.token;
                if (token) {
                    localStorage.setItem('authToken', token);
                    setErrorMessage('');
                    setIsLoggedIn(true);
                    navigate('/');
                    window.location.reload();
                } else {
                    throw new Error('Token not received, login unsuccessful.');
                }
            })
            .catch((error) => {
                setErrorMessage(error.message);
                console.error('Error:', error);
            });
    };

    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            minHeight: '70vh',

        }}>
            <form onSubmit={handleSubmit} style={{
                width: '400px',
                padding: '2rem',
                borderRadius: '8px',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#fff',
                textAlign: 'center',
                color: '#333',
                marginTop: '3rem',  // Adds top margin to give space at the top
            }}>
                <h2 style={{
                    color: '#333',
                    marginBottom: '1.5rem'
                }}>Welcome to OnlyBuns!</h2>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            marginTop: '0.5rem',
                            fontSize: '1rem',
                        }}
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            marginTop: '0.5rem',
                            fontSize: '1rem',
                        }}
                    />
                </div>

                {errorMessage && <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</p>}

                <button type="submit" style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#333',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginBottom: '1rem',
                    transition: 'background-color 0.3s',
                }}>
                    Login
                </button>
                <button type="button" onClick={handleRegisterRedirect} style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                }}>
                    Register
                </button>
            </form>
        </div>
    );
}

export default LoginForm;
