// src/components/LoginPromptModal.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPromptModal.css';

function LoginPromptModal({ onClose }) {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login');
        onClose(); // Close the modal after redirecting
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Login Required</h2>
                <p>You need to log in to comment on posts.</p>
                <button onClick={handleLoginRedirect} className="modal-button">Log In</button>
                <button onClick={onClose} className="modal-close-button">Close</button>
            </div>
        </div>
    );
}

export default LoginPromptModal;
