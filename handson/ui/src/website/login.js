const API_BASE = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function () {
    initTheme();

    // Already logged in — go straight to protected page
    if (localStorage.getItem('auth_token')) {
        window.location.href = '/protected.html';
        return;
    }

    document.getElementById('login-btn').addEventListener('click', handleLogin);
    document.getElementById('login-password').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') handleLogin();
    });
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
});

async function handleLogin() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');

    errorEl.style.display = 'none';

    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();

        if (data.success) {
            localStorage.setItem('auth_token', data.token);
            window.location.href = '/protected.html';
        } else {
            errorEl.textContent = 'Invalid username or password';
            errorEl.style.display = 'block';
        }
    } catch (error) {
        errorEl.textContent = 'Login failed — server unreachable';
        errorEl.style.display = 'block';
    }
}

function initTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('theme-toggle').textContent = '☀️';
    }
}

function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        document.getElementById('theme-toggle').textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('theme-toggle').textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
}
