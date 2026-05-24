const API_URL = 'http://localhost:3000/api';

// Utility: Get Header with Token
function getHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Utility: Check Auth
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
}

// Utility: Logout
function logout() {
    // Clear all storage to ensure a clean state across browsers
    localStorage.clear();
    // Always return to home page
    window.location.href = 'index.html';
}

// Utility: Get User
function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}
