import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/userService';

function RegisterForm() {
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        name: '',
        surname: '',
        email: ''
    });
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(userData);
            setMessage('Registration successful! Check your email to activate your account.');
            setRegistrationSuccess(true);
        } catch (error) {
            setMessage(error.message || 'Registration failed. Please try again.');
        }
    };

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div>
            {registrationSuccess ? (
                <div>
                    <p>{message}</p>
                    <button onClick={handleBackToHome}>Back to Home</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <h2>Register</h2>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            name="username"
                            value={userData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={userData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Surname:</label>
                        <input
                            type="text"
                            name="surname"
                            value={userData.surname}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit">Register</button>
                    <p>{message}</p>
                </form>
            )}
        </div>
    );
}

export default RegisterForm;
