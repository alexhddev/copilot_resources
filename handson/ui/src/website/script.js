// API Configuration
const API_BASE = 'http://localhost:3000/api';

// Global variables
let dailyMenu = [];
let cart = {};
let currentOrderId = null;

// DOM Elements
const menuContainer = document.getElementById('menu-container');
const cartItems = document.getElementById('cart-items');
const totalItems = document.getElementById('total-items');
const customerName = document.getElementById('customer-name');
const placeOrderBtn = document.getElementById('place-order-btn');
const lookupOrderBtn = document.getElementById('lookup-order-btn');
const orderIdInput = document.getElementById('order-id');
const orderDetails = document.getElementById('order-details');
const notification = document.getElementById('notification');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initTheme();
    loadDailyMenu();
    setupEventListeners();
    updateCartDisplay();
});

// Theme toggle
function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
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

// Setup event listeners
function setupEventListeners() {
    placeOrderBtn.addEventListener('click', handlePlaceOrder);
    lookupOrderBtn.addEventListener('click', handleLookupOrder);
    customerName.addEventListener('input', updateOrderButton);
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    
    // Allow Enter key to lookup orders
    orderIdInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleLookupOrder();
        }
    });
}

// Load daily menu from API
async function loadDailyMenu() {
    try {
        const response = await fetch(`${API_BASE}/daily-menu`);
        const data = await response.json();
        
        if (data.success) {
            dailyMenu = data.data;
            renderMenu();
        } else {
            showNotification('Failed to load menu', 'error');
        }
    } catch (error) {
        console.error('Error loading menu:', error);
        showNotification('Error loading menu', 'error');
    }
}

// Render menu items
function renderMenu() {
    menuContainer.innerHTML = '';
    
    dailyMenu.forEach((item, index) => {
        const menuItemDiv = document.createElement('div');
        menuItemDiv.className = 'menu-item';
        menuItemDiv.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDMwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjhmOWZhIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2IiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCI+8J+NlSBQaXp6YSBJbWFnZTwvdGV4dD4KPC9zdmc+'">
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <div class="quantity-controls">
                <div class="quantity-selector">
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">−</button>
                    <span class="quantity-display" id="qty-${index}">${cart[item.name] || 0}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
            </div>
        `;
        menuContainer.appendChild(menuItemDiv);
    });
}

// Update item quantity in cart
function updateQuantity(itemName, change) {
    if (!cart[itemName]) {
        cart[itemName] = 0;
    }
    
    cart[itemName] += change;
    
    if (cart[itemName] <= 0) {
        delete cart[itemName];
    }
    
    updateCartDisplay();
    renderMenu(); // Re-render to update quantity displays
    updateOrderButton();
}

// Update cart display
function updateCartDisplay() {
    const cartItemsArray = Object.entries(cart);
    
    if (cartItemsArray.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        totalItems.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = cartItemsArray.map(([name, quantity]) => `
        <div class="cart-item">
            <div>
                <div class="cart-item-name">${name}</div>
                <div class="cart-item-quantity">Quantity: ${quantity}</div>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart('${name}')">Remove</button>
        </div>
    `).join('');
    
    const total = cartItemsArray.reduce((sum, [name, quantity]) => sum + quantity, 0);
    totalItems.textContent = total;
}

// Remove item from cart
function removeFromCart(itemName) {
    delete cart[itemName];
    updateCartDisplay();
    renderMenu();
    updateOrderButton();
}

// Update order button state
function updateOrderButton() {
    const hasItems = Object.keys(cart).length > 0;
    const hasName = customerName.value.trim().length > 0;
    placeOrderBtn.disabled = !(hasItems && hasName);
}

// Handle place order
async function handlePlaceOrder() {
    const name = customerName.value.trim();
    
    if (!name) {
        showNotification('Please enter your name', 'error');
        return;
    }
    
    if (Object.keys(cart).length === 0) {
        showNotification('Please add items to your cart', 'error');
        return;
    }
    
    // Convert cart to API format
    const contents = Object.entries(cart).map(([name, quantity]) => ({
        name: name,
        quantity: quantity
    }));
    
    const orderData = {
        sender: name,
        contents: contents
    };
    
    try {
        const response = await fetch(`${API_BASE}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            showNotification(`Order placed successfully! Order ID: ${data.data.id}`, 'success');
            
            // Clear the cart and form
            cart = {};
            customerName.value = '';
            updateCartDisplay();
            renderMenu();
            updateOrderButton();
            
            // Show the order details
            currentOrderId = data.data.id;
            orderIdInput.value = data.data.id;
            displayOrderDetails(data.data);
        } else {
            showNotification(`Failed to place order: ${data.message}`, 'error');
        }
    } catch (error) {
        console.error('Error placing order:', error);
        showNotification('Error placing order', 'error');
    }
}

// Handle order lookup
async function handleLookupOrder() {
    const orderId = orderIdInput.value.trim();
    
    if (!orderId) {
        showNotification('Please enter an order ID', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/orders/${orderId}`);
        const data = await response.json();
        
        if (data.success) {
            displayOrderDetails(data.data);
            showNotification('Order found', 'success');
        } else {
            orderDetails.style.display = 'none';
            showNotification(`Order not found: ${data.message}`, 'error');
        }
    } catch (error) {
        console.error('Error looking up order:', error);
        orderDetails.style.display = 'none';
        showNotification('Error looking up order', 'error');
    }
}

// Display order details
function displayOrderDetails(order) {
    const statusClass = `status-${order.status.toLowerCase()}`;
    
    orderDetails.innerHTML = `
        <div class="order-info">
            <div class="order-info-item">
                <div class="order-info-label">Order ID</div>
                <div class="order-info-value">${order.id}</div>
            </div>
            <div class="order-info-item">
                <div class="order-info-label">Customer</div>
                <div class="order-info-value">${order.sender}</div>
            </div>
            <div class="order-info-item">
                <div class="order-info-label">Status</div>
                <div class="order-info-value">
                    <span class="status-badge ${statusClass}">${order.status}</span>
                </div>
            </div>
        </div>
        
        <div class="order-contents">
            <h4>Order Items</h4>
            ${order.contents.map(item => `
                <div class="content-item">
                    <span>${item.name}</span>
                    <span><strong>×${item.quantity}</strong></span>
                </div>
            `).join('')}
        </div>
        
        ${order.status === 'RECEIVED' ? `
            <div style="margin-top: 1rem;">
                <button class="btn-secondary" onclick="updateOrderStatus('${order.id}', 'DELIVERING')">
                    Mark as Delivering
                </button>
                <button class="btn-secondary" onclick="updateOrderStatus('${order.id}', 'CANCELED')" 
                        style="background: #dc3545; margin-left: 0.5rem;">
                    Cancel Order
                </button>
            </div>
        ` : ''}
        
        ${order.status === 'DELIVERING' ? `
            <div style="margin-top: 1rem;">
                <button class="btn-secondary" onclick="updateOrderStatus('${order.id}', 'DELIVERED')" 
                        style="background: #28a745;">
                    Mark as Delivered
                </button>
            </div>
        ` : ''}
    `;
    
    orderDetails.style.display = 'block';
}

// Update order status
async function updateOrderStatus(orderId, newStatus) {
    try {
        const response = await fetch(`${API_BASE}/orders/${orderId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        const data = await response.json();
        
        if (data.success) {
            displayOrderDetails(data.data);
            showNotification(`Order status updated to ${newStatus}`, 'success');
        } else {
            showNotification(`Failed to update order: ${data.message}`, 'error');
        }
    } catch (error) {
        console.error('Error updating order:', error);
        showNotification('Error updating order status', 'error');
    }
}

// Show notification
function showNotification(message, type = 'success') {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Utility functions for global access
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.updateOrderStatus = updateOrderStatus;