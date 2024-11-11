import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/userService';

function RegisterForm() {
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        name: '',
        surname: '',
        email: '',
        address: ''
    });

    const [errors, setErrors] = useState({});
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!/^[a-zA-Z0-9]{3,15}$/.test(userData.username)) {
            newErrors.username = "Username must be 3-15 alphanumeric characters.";
        }
        if (userData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters.";
        }
        if (userData.password !== userData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }
        if (!/^[a-zA-Z]+$/.test(userData.name)) {
            newErrors.name = "Name can only contain letters.";
        }
        if (!/^[a-zA-Z]+$/.test(userData.surname)) {
            newErrors.surname = "Surname can only contain letters.";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
            newErrors.email = "Invalid email format.";
        }
        if (!userData.address) {
            newErrors.address = "Address is required.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

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
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '90vh', // Set exact height to prevent scroll
            boxSizing: 'border-box' // Ensures padding is included within height
        }}>
            <div style={{
                width: '400px',
                padding: '2rem',
                borderRadius: '10px',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'white'
            }}>
                {registrationSuccess ? (
                    <div style={{ textAlign: 'center', marginTop: '-2rem' }}>
                        <p style={{ fontSize: '1rem', color: '#333' }}>{message}</p>
                        <button onClick={handleBackToHome} style={buttonStyle}>Back to Home</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <h2 style={{ textAlign: 'center', color: '#333' }}>Register</h2>
                        {['username', 'password', 'confirmPassword', 'name', 'surname', 'email', 'address'].map((field) => (
                            <div key={field} style={{ marginBottom: '1rem' }}>
                                <label style={labelStyle}>{field === 'confirmPassword' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)}:</label>
                                <input
                                    type={field === 'password' || field === 'confirmPassword' ? 'password' : 'text'}
                                    name={field}
                                    value={userData[field]}
                                    onChange={handleChange}
                                    style={inputStyle}
                                    required
                                />
                                {errors[field] && <p style={{ color: 'red', fontSize: '0.875rem' }}>{errors[field]}</p>}
                            </div>
                        ))}
                        <button type="submit" style={buttonStyle}>Register</button>
                        {message && !registrationSuccess && (
                            <p style={{ color: 'red', fontSize: '0.875rem' }}>{message}</p>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
}

const buttonStyle = {
    width: '100%',
    padding: '0.75rem',
    marginTop: '1rem',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
};

const labelStyle = {
    fontWeight: 'bold',
    color: '#555',
    marginBottom: '0.5rem',
    display: 'block'
};

const inputStyle = {
    width: '93%',
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '1rem'
};

export default RegisterForm;
