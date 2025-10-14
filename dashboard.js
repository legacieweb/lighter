// Dashboard JavaScript

let currentUser = null;
let userOrders = [];

// Check authentication on page load
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    await loadUserData();
    await loadOrders();
    setupEventListeners();
});

// Check if user is authenticated
async function checkAuth() {
    const token = getAuthToken();
    
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    try {
        const response = await apiCall(API_ENDPOINTS.getUser);
        if (response.success) {
            currentUser = response.user;
            
            // Redirect admin to admin panel
            if (currentUser.role === 'admin') {
                window.location.href = 'admin.html';
                return;
            }
        } else {
            logout();
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        logout();
    }
}

// Load user data
async function loadUserData() {
    if (!currentUser) return;

    // Display names
    document.getElementById('userFirstName').textContent = currentUser.firstName || 'Not set';
    document.getElementById('userLastName').textContent = currentUser.lastName || 'Not set';
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('userPhone').textContent = currentUser.phone || 'Not set';

    // Display shipping address
    document.getElementById('userStreet').textContent = currentUser.address?.street || 'Not set';
    document.getElementById('userCity').textContent = currentUser.address?.city || 'Not set';
    document.getElementById('userState').textContent = currentUser.address?.state || 'Not set';
    document.getElementById('userZipCode').textContent = currentUser.address?.zipCode || 'Not set';

    const memberSince = new Date(currentUser.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('memberSince').textContent = memberSince;
}

// Load user orders
async function loadOrders() {
    try {
        const response = await apiCall(API_ENDPOINTS.getMyOrders);
        
        if (response.success) {
            userOrders = response.orders;
            displayOrders(userOrders);
        }
    } catch (error) {
        console.error('Failed to load orders:', error);
        document.getElementById('ordersContainer').innerHTML = 
            '<p class="loading-text">Failed to load orders</p>';
    }
}

// Display orders
function displayOrders(orders) {
    const container = document.getElementById('ordersContainer');
    
    if (orders.length === 0) {
        container.innerHTML = '<p class="loading-text">No orders yet</p>';
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-card" onclick="viewOrderDetails('${order._id}')">
            <div class="order-header">
                <span class="order-number">#${order.orderNumber}</span>
                <span class="order-date">${new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="order-items">
                ${order.items.slice(0, 3).map(item => `
                    <div class="order-item">
                        <span>${item.emoji} ${item.name} x${item.quantity}</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
                ${order.items.length > 3 ? `<p style="color: var(--gray-text); font-size: 0.9rem;">+${order.items.length - 3} more items</p>` : ''}
            </div>
            <div class="order-footer">
                <span class="order-total">$${order.totalAmount.toFixed(2)}</span>
                <div>
                    <span class="order-status status-${order.orderStatus}">${order.orderStatus}</span>
                    <span class="payment-status payment-${order.paymentInfo.status}">${order.paymentInfo.status}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// View order details
async function viewOrderDetails(orderId) {
    try {
        const response = await apiCall(API_ENDPOINTS.getOrder(orderId));
        
        if (response.success) {
            const order = response.order;
            
            const detailsHTML = `
                <div class="order-details">
                    <div class="detail-section">
                        <h3>Order Information</h3>
                        <div class="detail-row">
                            <span class="detail-label">Order Number:</span>
                            <span class="detail-value">#${order.orderNumber}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Order Date:</span>
                            <span class="detail-value">${new Date(order.createdAt).toLocaleString()}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Order Status:</span>
                            <span class="order-status status-${order.orderStatus}">${order.orderStatus}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Payment Status:</span>
                            <span class="payment-status payment-${order.paymentInfo.status}">${order.paymentInfo.status}</span>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h3>Items</h3>
                        ${order.items.map(item => `
                            <div class="detail-row">
                                <span class="detail-label">${item.emoji} ${item.name} x${item.quantity}</span>
                                <span class="detail-value">$${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                        <div class="detail-row" style="border-top: 2px solid var(--primary-color); margin-top: 10px; padding-top: 10px;">
                            <span class="detail-label" style="font-weight: 700;">Total:</span>
                            <span class="detail-value" style="color: var(--secondary-color); font-size: 1.3rem;">$${order.totalAmount.toFixed(2)}</span>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h3>Shipping Information</h3>
                        <div class="detail-row">
                            <span class="detail-label">Name:</span>
                            <span class="detail-value">${order.shippingInfo.firstName} ${order.shippingInfo.lastName}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Email:</span>
                            <span class="detail-value">${order.shippingInfo.email}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Phone:</span>
                            <span class="detail-value">${order.shippingInfo.phone}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Address:</span>
                            <span class="detail-value">
                                ${order.shippingInfo.street}, ${order.shippingInfo.city}, 
                                ${order.shippingInfo.state} ${order.shippingInfo.zipCode}
                            </span>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h3>Payment Information</h3>
                        <div class="detail-row">
                            <span class="detail-label">Reference:</span>
                            <span class="detail-value">${order.paymentInfo.reference}</span>
                        </div>
                        ${order.paymentInfo.paidAt ? `
                            <div class="detail-row">
                                <span class="detail-label">Paid At:</span>
                                <span class="detail-value">${new Date(order.paymentInfo.paidAt).toLocaleString()}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            
            document.getElementById('orderDetailsContent').innerHTML = detailsHTML;
            openModal('orderDetailsModal');
        }
    } catch (error) {
        console.error('Failed to load order details:', error);
        showNotification('Failed to load order details', 'error');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Edit profile button - toggle inline editing
    document.getElementById('editProfileBtn').addEventListener('click', toggleEditMode);

    // Save profile button
    document.getElementById('saveProfileBtn').addEventListener('click', saveProfileChanges);

    // Cancel edit button
    document.getElementById('cancelEditBtn').addEventListener('click', cancelEditMode);

    // Close modal buttons
    document.getElementById('closeOrderDetails').addEventListener('click', () => {
        closeModal('orderDetailsModal');
    });

    // Close modals on overlay click
    document.getElementById('overlay').addEventListener('click', () => {
        closeAllModals();
    });
}

// Toggle edit mode for profile
function toggleEditMode() {
    const isEditing = document.getElementById('editActions').style.display === 'flex';

    if (isEditing) {
        cancelEditMode();
    } else {
        // Enter edit mode
        document.getElementById('editUserFirstName').value = currentUser.firstName || '';
        document.getElementById('editUserLastName').value = currentUser.lastName || '';
        document.getElementById('editUserPhone').value = currentUser.phone || '';
        document.getElementById('editUserStreet').value = currentUser.address?.street || '';
        document.getElementById('editUserCity').value = currentUser.address?.city || '';
        document.getElementById('editUserState').value = currentUser.address?.state || '';
        document.getElementById('editUserZipCode').value = currentUser.address?.zipCode || '';

        // Hide display values and show inputs
        const displayElements = ['userFirstName', 'userLastName', 'userPhone', 'userStreet', 'userCity', 'userState', 'userZipCode'];
        const inputElements = ['editUserFirstName', 'editUserLastName', 'editUserPhone', 'editUserStreet', 'editUserCity', 'editUserState', 'editUserZipCode'];

        displayElements.forEach(id => {
            document.getElementById(id).style.display = 'none';
        });

        inputElements.forEach(id => {
            document.getElementById(id).style.display = 'inline-block';
        });

        // Show edit actions
        document.getElementById('editActions').style.display = 'flex';

        // Change button text
        document.getElementById('editProfileBtn').textContent = 'Cancel Edit';
    }
}

// Save profile changes
async function saveProfileChanges() {
    const firstName = document.getElementById('editUserFirstName').value.trim();
    const lastName = document.getElementById('editUserLastName').value.trim();
    const phone = document.getElementById('editUserPhone').value.trim();
    const street = document.getElementById('editUserStreet').value.trim();
    const city = document.getElementById('editUserCity').value.trim();
    const state = document.getElementById('editUserState').value.trim();
    const zipCode = document.getElementById('editUserZipCode').value.trim();

    // Validate required fields
    if (!firstName || !lastName) {
        showNotification('Please enter your first and last name', 'error');
        return;
    }

    if (!phone) {
        showNotification('Please enter your phone number', 'error');
        return;
    }

    // Address validation (optional but if provided, must be complete)
    const hasAddressData = street || city || state;
    if (hasAddressData && (!street || !city || !state)) {
        showNotification('Please complete all address fields or leave them all empty', 'error');
        return;
    }

    try {
        const updateData = {
            firstName,
            lastName,
            phone,
            address: hasAddressData ? { street, city, state, zipCode: zipCode || '' } : {}
        };

        const response = await apiCall(API_ENDPOINTS.updateProfile, {
            method: 'PUT',
            body: JSON.stringify(updateData)
        });

        if (response.success) {
            currentUser = response.user;
            localStorage.setItem('lighterPooaUser', JSON.stringify(currentUser));
            loadUserData();
            cancelEditMode();
            showNotification('Profile updated successfully!');
        }
    } catch (error) {
        console.error('Profile update error:', error);
        showNotification(error.message || 'Failed to update profile', 'error');
    }
}

// Cancel edit mode
function cancelEditMode() {
    // Hide inputs and show display values
    const displayElements = ['userFirstName', 'userLastName', 'userPhone', 'userStreet', 'userCity', 'userState', 'userZipCode'];
    const inputElements = ['editUserFirstName', 'editUserLastName', 'editUserPhone', 'editUserStreet', 'editUserCity', 'editUserState', 'editUserZipCode'];

    displayElements.forEach(id => {
        document.getElementById(id).style.display = 'inline';
    });

    inputElements.forEach(id => {
        document.getElementById(id).style.display = 'none';
    });

    // Hide edit actions
    document.getElementById('editActions').style.display = 'none';

    // Reset button text
    document.getElementById('editProfileBtn').textContent = 'Edit Profile';
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    
    const openModals = document.querySelectorAll('.modal.active');
    if (openModals.length === 0) {
        document.getElementById('overlay').classList.remove('active');
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.getElementById('overlay').classList.remove('active');
}

// Logout function
function logout() {
    localStorage.removeItem('lighterPooaToken');
    localStorage.removeItem('lighterPooaUser');
    window.location.href = 'index.html';
}

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('successMessage');
    const text = document.getElementById('successText');
    
    text.textContent = message;
    notification.classList.add('active');
    
    if (type === 'error') {
        notification.style.background = 'var(--danger-color)';
    } else {
        notification.style.background = 'var(--success-color)';
    }
    
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}