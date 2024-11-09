import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

function ActivationPage() {
    const { token } = useParams();
    const location = useLocation();
    const [message, setMessage] = useState('Activating your account, please wait...');
    const [activationSuccess, setActivationSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const email = queryParams.get('email');

        const activateAccount = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/users/activate/${token}?email=${email}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await response.json();

                if (response.ok) {
                    setMessage(data.message || 'Your account has been successfully activated! You can now log in.');
                    setActivationSuccess(true);
                } else {
                    setMessage(data.message || 'Account activation failed. The token may have expired.');
                }
            } catch (error) {
                setMessage('An error occurred while activating your account. Please try again.');
            }
        };

        activateAccount();
    }, [token, location.search]);

    const handleBackToHome = () => {
        navigate('/');
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={headerStyle}>Account Activation</h2>
                <p style={{ color: activationSuccess ? 'green' : 'red', fontSize: '1rem' }}>{message}</p>
                {activationSuccess && <button onClick={handleBackToHome} style={buttonStyle}>Back to Home</button>}
            </div>
        </div>
    );
}

const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f8ff',
};

const cardStyle = {
    width: '400px',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
    textAlign: 'center'
};

const headerStyle = {
    color: '#333',
    marginBottom: '1rem',
};

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

export default ActivationPage;
