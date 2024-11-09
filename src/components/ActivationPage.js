import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

function ActivationPage() {
    const { token } = useParams(); // Get token from the URL path
    const location = useLocation();
    const [message, setMessage] = useState('Activating your account, please wait...');
    const [activationSuccess, setActivationSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const email = queryParams.get('email'); // Get email from the query

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
        <div>
            <h2>Account Activation</h2>
            <p>{message}</p>
            {activationSuccess && <button onClick={handleBackToHome}>Back to Home</button>}
        </div>
    );
}

export default ActivationPage;
