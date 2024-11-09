import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        const loginData = { username, password };

        try {
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Login failed. Please check your credentials.');
            }

            const data = await response.json();
            const token = data.token; // Ensure backend response includes `token`

            if (token) {
                localStorage.setItem('authToken', token);
                setSuccessMessage(data.message || "Login successful");
                setErrorMessage('');

                // Redirect to home without page reload
                navigate('/');
            } else {
                throw new Error("Token not received, login unsuccessful.");
            }
        } catch (error) {
            setErrorMessage(error.message);
            setSuccessMessage('');
            console.error('Error:', error);
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Login</button>
            <button type="button" onClick={handleRegisterRedirect}>Register</button>

            {/* Display Success or Error Messages */}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
    );
}

export default LoginForm;
