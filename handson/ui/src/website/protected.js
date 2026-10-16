const API_BASE = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function () {
    initTheme();

    const token = localStorage.getItem('auth_token');
    if (!token) {
        document.getElementById('auth-required-msg').style.display = 'block';
        document.getElementById('main-content').style.display = 'block';
        return;
    }

    document.getElementById('logout-btn').addEventListener('click', function () {
        localStorage.removeItem('auth_token');
        window.location.href = '/login.html';
    });
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    document.getElementById('logout-btn').style.display = 'block';
    document.getElementById('main-content').style.display = 'block';
    loadProtectedData(token);
});

async function loadProtectedData(token) {
    const container = document.getElementById('protected-data');

    try {
        const response = await fetch(`${API_BASE}/protected`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.status === 401) {
            // Token invalid or expired — force re-login
            localStorage.removeItem('auth_token');
            window.location.href = '/login.html';
            return;
        }

        const data = await response.json();

        container.innerHTML = `
            <div class="protected-grid">
                <div class="protected-card">
                    <div class="protected-label">Secret Recipes</div>
                    <ul>
                        ${data.data.secretRecipes.map(r => `<li>${r}</li>`).join('')}
                    </ul>
                </div>
                <div class="protected-card">
                    <div class="protected-label">Staff Discount</div>
                    <div class="protected-value">${data.data.staffDiscount}</div>
                </div>
                <div class="protected-card">
                    <div class="protected-label">VIP Code</div>
                    <div class="protected-value">${data.data.vipCode}</div>
                </div>
                <div class="protected-card">
                    <div class="protected-label">Delivery Note</div>
                    <div class="protected-value">${data.data.deliveryNote}</div>
                </div>
            </div>`;
    } catch (error) {
        container.textContent = 'Failed to load protected data.';
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
