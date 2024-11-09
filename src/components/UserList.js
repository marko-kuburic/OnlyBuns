import React, { useState, useEffect } from 'react';

function UserList() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/users/all', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                return response.json();
            })
            .then(data => setUsers(data))
            .catch(error => setError(error.message));
    }, []);

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h2>All Users</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        <p>Username: {user.username}</p>
                        <p>Email: {user.email}</p>
                        <p>Name: {user.name} {user.surname}</p>
                        <p>Pass: {user.password}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserList;
