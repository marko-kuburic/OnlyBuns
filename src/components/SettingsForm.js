import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

function SettingsForm() {
    const [userData, setUserData] = useState({});
    const [editField, setEditField] = useState(null); // Track which field is being edited
    const [updatedValue, setUpdatedValue] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const [userId, setLoggedInUserId] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false); // Toggle password visibility
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // Toggle confirm password visibility

    useEffect(() => {
        // Get logged-in user's ID from the token
        const token = localStorage.getItem("authToken");
        if (token) {
            try {
                const decodedToken = jwt_decode(token);
                setLoggedInUserId(decodedToken.userId);
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }

        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/users/id/${userId}`);
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    const validate = (field, value, confirmValue = "") => {
        const fieldErrors = {};
        if (field === "password") {
            if (value.length < 6) {
                fieldErrors.password = "Password must be at least 6 characters.";
            }
            if (value !== confirmValue) {
                fieldErrors.confirmPassword = "Passwords do not match.";
            }
        }
        return fieldErrors;
    };

    const handleUpdate = async (field) => {
        const validationErrors = validate(field, updatedValue, confirmPassword);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const endpoint = `http://localhost:8080/api/users/${userId}/update-${field}`;
            const body = {};

            if (field === "password") {
                body.newPassword = updatedValue;
                body.confirmPassword = confirmPassword;
            } else {
                body[field] = updatedValue;
            }

            const response = await fetch(endpoint, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            alert(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully.`);
            setEditField(null);
            setUpdatedValue("");
            setConfirmPassword("");
            setErrors({});

            // Refresh the user data
            const updatedUserResponse = await fetch(`http://localhost:8080/api/users/id/${userId}`);
            const updatedData = await updatedUserResponse.json();
            setUserData(updatedData);
        } catch (error) {
                alert(`Error updating ${field}: ${error.message}`);
            }
        };

        return (
            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
                <h2 style={{ textAlign: "center", color: "#333" }}>Settings</h2>
                <div style={{ backgroundColor: "#f9f9f9", padding: "1.5rem", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
                    <div style={{ marginBottom: "1rem" }}>
                        <strong>Name:</strong> {editField === "name" ? (
                        <>
                            <input
                                type="text"
                                value={updatedValue}
                                onChange={(e) => setUpdatedValue(e.target.value)}
                                placeholder="Enter new name"
                            />
                            <button onClick={() => handleUpdate("name")} style={buttonStyle}>Save</button>
                            <button onClick={() => setEditField(null)} style={buttonStyle}>Cancel</button>
                        </>
                    ) : (
                        <>
                            {userData.name} <button onClick={() => setEditField("name")} style={buttonStyle}>Change</button>
                        </>
                    )}
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <strong>Surname:</strong> {editField === "surname" ? (
                        <>
                            <input
                                type="text"
                                value={updatedValue}
                                onChange={(e) => setUpdatedValue(e.target.value)}
                                placeholder="Enter new surname"
                            />
                            <button onClick={() => handleUpdate("surname")} style={buttonStyle}>Save</button>
                            <button onClick={() => setEditField(null)} style={buttonStyle}>Cancel</button>
                        </>
                    ) : (
                        <>
                            {userData.surname} <button onClick={() => setEditField("surname")} style={buttonStyle}>Change</button>
                        </>
                    )}
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <strong>Address:</strong> {editField === "address" ? (
                        <>
                            <input
                                type="text"
                                value={updatedValue}
                                onChange={(e) => setUpdatedValue(e.target.value)}
                                placeholder="Enter new address"
                            />
                            <button onClick={() => handleUpdate("address")} style={buttonStyle}>Save</button>
                            <button onClick={() => setEditField(null)} style={buttonStyle}>Cancel</button>
                        </>
                    ) : (
                        <>
                            {userData.address} <button onClick={() => setEditField("address")} style={buttonStyle}>Change</button>
                        </>
                    )}
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <strong>Password:</strong> {editField === "password" ? (
                        <>
                            <input
                                type={passwordVisible ? "text" : "password"}
                                value={updatedValue}
                                onChange={(e) => setUpdatedValue(e.target.value)}
                                placeholder="Enter new password"
                            />
                            <button onClick={() => setPasswordVisible(!passwordVisible)} style={buttonStyle}>
                                {passwordVisible ? "Hide" : "Show"}
                            </button>
                            <input
                                type={confirmPasswordVisible ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm password"
                            />
                            <button onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} style={buttonStyle}>
                                {confirmPasswordVisible ? "Hide" : "Show"}
                            </button>
                            {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
                            {errors.confirmPassword && <p style={{ color: "red" }}>{errors.confirmPassword}</p>}
                            <button onClick={() => handleUpdate("password")} style={buttonStyle}>Save</button>
                            <button onClick={() => setEditField(null)} style={buttonStyle}>Cancel</button>
                        </>
                    ) : (
                        <>
                            ******** <button onClick={() => setEditField("password")} style={buttonStyle}>Change</button>
                        </>
                    )}
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                        <strong>Email:</strong> {userData.email}
                    </div>
                </div>
            </div>
        );
    }

    const buttonStyle = {
        marginLeft: "1rem",
        padding: "0.5rem",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    };

    export default SettingsForm;
