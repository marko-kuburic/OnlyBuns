const BASE_URL = 'http://localhost:8080/api/users';

export async function loginUser(userData) {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        mode: 'cors'
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
    }

    return await response.json();
}

export async function registerUser(userData) {
    const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
        mode: 'cors'
    });

    const responseData = await response.json(); // Parse the response as JSON

    if (!response.ok) {
        throw new Error(responseData.message || 'Registration failed'); // Use JSON message from the response
    }

    return responseData;
}

export async function getAllUsers() {
    const response = await fetch(`${BASE_URL}/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        mode: 'cors'
    });

    if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch users');
        } else {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to fetch users');
        }
    }

    return await response.json(); // Return JSON response on success
}
