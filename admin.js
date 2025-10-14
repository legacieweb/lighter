// ============================================
// ADMIN PANEL - LIGHTER POOA
// ============================================

// Global State
let currentUser = null;
let allOrders = [];
let allUsers = [];
let currentFilter = 'all';
let currentSection = 'dashboard';

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    await loadDashboardData();
    setupNavigation();
    setupEventListeners();
});

// ============================================
// AUTHENTICATION
// ============================================

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
            
            if (currentUser.role !== 'admin') {
                window.location.href = 'dashboard.html';
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

function logout() {
    localStorage.removeItem('lighterPooaToken');
    localStorage.removeItem('lighterPooaUser');
    window.location.href = 'index.html';
}

// ============================================
// NAVIGATION
// ============================================

function setupNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.admin-section');
    
    menuItems.forEach(item => {
        item.addEventListener('click', async () => {
            const section = item.dataset.section;
            
            // Update active states
            menuItems.forEach(mi => mi.classList.remove('active'));
            item.classList.add('active');
            
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(`${section}Section`).classList.add('active');
            
            // Update page title
            document.getElementById('pageTitle').textContent = 
                section.charAt(0).toUpperCase() + section.slice(1);
            
            // Update current section
            currentSection = section;
            
            // Load section data
            if (section === 'orders') {
                await loadOrders();
            } else if (section === 'users') {
                await loadUsers();
            }
        });
    });
    
    // Sidebar toggle
    document.getElementById('sidebarToggle').addEventListener('click', () => {
        document.querySelector('.admin-sidebar').classList.toggle('collapsed');
    });
}

// ============================================
// DASHBOARD
// ============================================

async function loadDashboardData() {
    try {
        const [orderStats, userStats, orders] = await Promise.all([
            apiCall(API_ENDPOINTS.getOrderStats),
            apiCall(API_ENDPOINTS.getUserStats),
            apiCall(API_ENDPOINTS.getAllOrders)
        ]);

        if (orderStats.success) {
            document.getElementById('totalOrders').textContent = orderStats.stats.totalOrders;
            document.getElementById('pendingOrders').textContent = orderStats.stats.pendingOrders;
            document.getElementById('deliveredOrders').textContent = orderStats.stats.deliveredOrders;
            document.getElementById('totalRevenue').textContent = `$${orderStats.stats.totalRevenue.toFixed(2)}`;
        }

        if (userStats.success) {
            document.getElementById('totalUsers').textContent = userStats.stats.totalUsers;
            document.getElementById('newUsers').textContent = userStats.stats.newUsers;
        }

        if (orders.success) {
            allOrders = orders.orders;
            displayRecentOrders(orders.orders.slice(0, 5));
        }
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        showNotification('Failed to load dashboard data', 'error');
    }
}

function displayRecentOrders(orders) {
    const container = document.getElementById('recentOrders');

    if (orders.length === 0) {
        container.innerHTML = '<p>No recent orders</p>';
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="recent-order-item">
            <div class="order-info">
                <span class="order-number">#${order.orderNumber}</span>
                <span class="order-customer">${order.userId?.name || 'N/A'}</span>
            </div>
            <div class="order-meta">
                <span class="order-amount">$${order.totalAmount.toFixed(2)}</span>
                <span class="order-status status-${order.orderStatus}">${order.orderStatus}</span>
            </div>
        </div>
    `).join('');
}

// ============================================
// ORDERS MANAGEMENT
// ============================================

async function loadOrders() {
    try {
        const response = await apiCall(API_ENDPOINTS.getAllOrders);

        if (response.success) {
            allOrders = response.orders;
            displayOrders(allOrders);
        }
    } catch (error) {
        console.error('Failed to load orders:', error);
        document.getElementById('ordersTableBody').innerHTML =
            '<tr><td colspan="7" class="loading-text">Failed to load orders</td></tr>';
    }
}

function displayOrders(orders) {
    const container = document.getElementById('ordersTilesContainer');

    // Filter orders
    let filteredOrders = orders;
    if (currentFilter !== 'all') {
        filteredOrders = orders.filter(order => order.orderStatus === currentFilter);
    }

    if (filteredOrders.length === 0) {
        container.innerHTML = '<div class="loading-text">No orders found</div>';
        return;
    }

    container.innerHTML = filteredOrders.map(order => `
        <div class="order-tile" data-order-id="${order._id}">
            <div class="tile-header">
                <div class="order-number">#${order.orderNumber}</div>
                <div class="order-date">${new Date(order.createdAt).toLocaleDateString()}</div>
            </div>

            <div class="tile-body">
                <div class="customer-info">
                    <div class="customer-name">${order.userId?.name || 'N/A'}</div>
                    <div class="customer-email">${order.userId?.email || ''}</div>
                </div>

                <div class="shipping-address">
                    <div class="address-label">Shipping Address:</div>
                    <div class="address-text">
                        ${order.shippingInfo?.address || 'N/A'}<br>
                        ${order.shippingInfo?.city || ''}, ${order.shippingInfo?.state || ''} ${order.shippingInfo?.zipCode || ''}<br>
                        ${order.shippingInfo?.country || ''}
                    </div>
                </div>

                <div class="order-items-summary">
                    ${order.items.map(item => `<div class="item-summary">${item.name} × ${item.quantity}</div>`).join('')}
                </div>

                <div class="order-total">
                    <span class="total-label">Total:</span>
                    <span class="total-amount">$${order.totalAmount.toFixed(2)}</span>
                </div>

                <div class="payment-info">
                    <span class="payment-status payment-${order.paymentInfo.status}">${order.paymentInfo.status}</span>
                </div>
            </div>

            <div class="tile-footer">
                <div class="status-section">
                    <label for="status-${order._id}">Status:</label>
                    <select id="status-${order._id}" class="status-selector" data-order-id="${order._id}">
                        <option value="pending" ${order.orderStatus === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="processing" ${order.orderStatus === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="shipped" ${order.orderStatus === 'shipped' ? 'selected' : ''}>Shipped</option>
                        <option value="delivered" ${order.orderStatus === 'delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="cancelled" ${order.orderStatus === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </div>
            </div>
        </div>
    `).join('');

    // Add event listeners to status selectors
    document.querySelectorAll('.status-selector').forEach(selector => {
        selector.addEventListener('change', async (e) => {
            const orderId = e.target.getAttribute('data-order-id');
            const newStatus = e.target.value;
            await updateOrderStatusDirect(orderId, newStatus);
        });
    });
}

// ============================================
// ORDER MODAL
// ============================================

async function openOrderModal(orderId) {
    console.log('Opening order modal for ID:', orderId);
    try {
        const response = await apiCall(API_ENDPOINTS.getOrder(orderId));
        console.log('Order data received:', response);

        if (response.success) {
            const order = response.order;
            displayOrderDetails(order);
            
            // Show modal with animation
            const modal = document.getElementById('orderModal');
            console.log('Modal element:', modal);
            console.log('Modal classes before:', modal.className);
            
            // Force reflow to ensure transition works
            modal.offsetHeight;
            modal.classList.add('active');
            
            console.log('Modal classes after:', modal.className);
            document.body.style.overflow = 'hidden';
            console.log('Modal opened successfully');
        } else {
            console.error('API response not successful:', response);
            showNotification('Failed to load order details', 'error');
        }
    } catch (error) {
        console.error('Failed to load order details:', error);
        showNotification('Failed to load order details', 'error');
    }
}

function displayOrderDetails(order) {
    const modalBody = document.getElementById('orderModalBody');

    modalBody.innerHTML = `
        <div class="order-management">
            <!-- Status Update Section -->
            <div class="status-update-section">
                <div class="status-header">
                    <h3><i class="fas fa-edit"></i> Update Order Status</h3>
                    <button type="button" class="btn-secondary print-btn" onclick="window.print()">
                        <i class="fas fa-print"></i> Print Order
                    </button>
                </div>
                <form id="statusUpdateForm" onsubmit="updateOrderStatus(event, '${order._id}')">
                    <div class="form-group">
                        <label for="orderStatus">
                            Current Status:
                            <span class="current-status status-${order.orderStatus}" id="currentStatusBadge">${order.orderStatus}</span>
                        </label>
                        <select id="orderStatus" name="status" required>
                            <option value="pending" ${order.orderStatus === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="processing" ${order.orderStatus === 'processing' ? 'selected' : ''}>Processing</option>
                            <option value="shipped" ${order.orderStatus === 'shipped' ? 'selected' : ''}>Shipped</option>
                            <option value="delivered" ${order.orderStatus === 'delivered' ? 'selected' : ''}>Delivered</option>
                            <option value="cancelled" ${order.orderStatus === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </div>
                    <button type="submit" class="btn-primary" id="updateStatusBtn">
                        <i class="fas fa-save"></i> Update Status
                    </button>
                </form>
            </div>

            <!-- Order Details Grid -->
            <div class="order-details-grid">
                <div class="detail-section order-info">
                    <h3><i class="fas fa-info-circle"></i> Order Information</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">Order Number:</span>
                            <span class="detail-value">#${order.orderNumber}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Order Date:</span>
                            <span class="detail-value">${new Date(order.createdAt).toLocaleString()}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Payment Status:</span>
                            <span class="payment-status payment-${order.paymentInfo.status}">${order.paymentInfo.status}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Last Updated:</span>
                            <span class="detail-value">${new Date(order.updatedAt).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div class="detail-section customer-info">
                    <h3><i class="fas fa-user"></i> Customer Information</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">Name:</span>
                            <span class="detail-value">${order.userId?.name || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Email:</span>
                            <span class="detail-value">${order.userId?.email || 'N/A'}</span>
                        </div>
                        <div class="detail-item">
                            <span class="detail-label">Phone:</span>
                            <span class="detail-value">${order.shippingInfo?.phone || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div class="detail-section full-width shipping-address">
                    <h3><i class="fas fa-map-marker-alt"></i> Shipping Address</h3>
                    <div class="address-card">
                        <p class="address-text">
                            ${order.shippingInfo?.address || 'N/A'}<br>
                            ${order.shippingInfo?.city || ''}, ${order.shippingInfo?.state || ''} ${order.shippingInfo?.zipCode || ''}<br>
                            ${order.shippingInfo?.country || ''}
                        </p>
                    </div>
                </div>

                <div class="detail-section full-width order-items">
                    <h3><i class="fas fa-shopping-cart"></i> Order Items</h3>
                    <div class="items-container">
                        ${order.items.map(item => `
                            <div class="item-card">
                                <div class="item-details">
                                    <div class="item-name">${item.name}</div>
                                    <div class="item-meta">Quantity: ${item.quantity} × $${item.price.toFixed(2)}</div>
                                </div>
                                <div class="item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                        `).join('')}
                        <div class="order-summary">
                            <div class="summary-row">
                                <span class="summary-label">Total Amount:</span>
                                <span class="summary-value">$${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="detail-section full-width payment-info">
                    <h3><i class="fas fa-credit-card"></i> Payment Information</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <span class="detail-label">Reference:</span>
                            <span class="detail-value">${order.paymentInfo.reference}</span>
                        </div>
                        ${order.paymentInfo.paidAt ? `
                            <div class="detail-item">
                                <span class="detail-label">Paid At:</span>
                                <span class="detail-value">${new Date(order.paymentInfo.paidAt).toLocaleString()}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function updateOrderStatus(event, orderId) {
    event.preventDefault();

    const newStatus = document.getElementById('orderStatus').value;
    const submitButton = document.getElementById('updateStatusBtn');
    const statusBadge = document.getElementById('currentStatusBadge');

    // Show loading state
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';

    try {
        const response = await apiCall(API_ENDPOINTS.updateOrderStatus(orderId), {
            method: 'PUT',
            body: JSON.stringify({ orderStatus: newStatus })
        });

        if (response.success) {
            showNotification('Order status updated successfully!');

            // Update the status badge
            statusBadge.className = `current-status status-${newStatus}`;
            statusBadge.textContent = newStatus;

            // Refresh data
            await loadDashboardData();
            if (currentSection === 'orders') {
                await loadOrders();
            }

            // Re-enable button
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    } catch (error) {
        showNotification(error.message || 'Failed to update order status', 'error');
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}

async function updateOrderStatusDirect(orderId, newStatus) {
    const selector = document.getElementById(`status-${orderId}`);
    const originalStatus = selector.getAttribute('data-original-status') || selector.value;

    // Show loading state
    selector.disabled = true;
    selector.style.opacity = '0.6';

    try {
        const response = await apiCall(API_ENDPOINTS.updateOrderStatus(orderId), {
            method: 'PUT',
            body: JSON.stringify({ orderStatus: newStatus })
        });

        if (response.success) {
            showNotification('Order status updated successfully!');
            selector.setAttribute('data-original-status', newStatus);

            // Refresh data
            await loadDashboardData();
            if (currentSection === 'orders') {
                await loadOrders();
            }
        } else {
            // Revert on failure
            selector.value = originalStatus;
            showNotification('Failed to update order status', 'error');
        }
    } catch (error) {
        // Revert on failure
        selector.value = originalStatus;
        showNotification(error.message || 'Failed to update order status', 'error');
    } finally {
        // Re-enable selector
        selector.disabled = false;
        selector.style.opacity = '1';
    }
}

function closeOrderModal() {
    console.log('Closing order modal');
    const modal = document.getElementById('orderModal');
    console.log('Modal classes before close:', modal.className);
    modal.classList.remove('active');
    console.log('Modal classes after close:', modal.className);
    document.body.style.overflow = '';
    console.log('Modal closed');
}

// ============================================
// USERS MANAGEMENT
// ============================================

async function loadUsers() {
    try {
        const response = await apiCall(API_ENDPOINTS.getAllUsers);

        if (response.success) {
            allUsers = response.users;
            displayUsers(allUsers);
        }
    } catch (error) {
        console.error('Failed to load users:', error);
        document.getElementById('usersTilesContainer').innerHTML =
            '<div class="loading-text">Failed to load users</div>';
    }
}

function displayUsers(users) {
    const container = document.getElementById('usersTilesContainer');

    if (users.length === 0) {
        container.innerHTML = '<div class="loading-text">No users found</div>';
        return;
    }

    container.innerHTML = users.map(user => `
        <div class="user-tile" data-user-id="${user._id}">
            <div class="tile-header">
                <div class="user-name">${user.name}</div>
                <div class="user-role">
                    <span class="role-badge role-${user.role}">${user.role}</span>
                </div>
            </div>

            <div class="tile-body">
                <div class="contact-info">
                    <div class="contact-item">
                        <i class="fas fa-envelope"></i>
                        <span>${user.email}</span>
                    </div>
                    <div class="contact-item">
                        <i class="fas fa-phone"></i>
                        <span>${user.phone || 'N/A'}</span>
                    </div>
                </div>

                <div class="user-address">
                    <div class="address-label">Address:</div>
                    <div class="address-text">
                        ${user.address?.street || 'N/A'}<br>
                        ${user.address?.city || ''}, ${user.address?.state || ''} ${user.address?.zipCode || ''}<br>
                        ${user.address?.country || ''}
                    </div>
                </div>

                <div class="user-stats">
                    <div class="stat-item">
                        <span class="stat-label">Orders:</span>
                        <span class="stat-value">${user.orderCount || 0}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Joined:</span>
                        <span class="stat-value">${new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// USER MODAL
// ============================================

function openUserModal(userId) {
    const user = allUsers.find(u => u._id === userId);
    if (!user) {
        showNotification('User not found', 'error');
        return;
    }

    const modalBody = document.getElementById('userModalBody');
    
    modalBody.innerHTML = `
        <div class="user-details">
            <div class="detail-section">
                <h3>User Information</h3>
                <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${user.name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${user.email}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Role:</span>
                    <span class="detail-value">${user.role}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total Orders:</span>
                    <span class="detail-value">${user.orderCount || 0}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Joined:</span>
                    <span class="detail-value">${new Date(user.createdAt).toLocaleString()}</span>
                </div>
            </div>
        </div>
    `;
    
    // Show modal with animation
    const modal = document.getElementById('userModal');
    // Force reflow to ensure transition works
    modal.offsetHeight;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeUserModal() {
    const modal = document.getElementById('userModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Order search
    document.getElementById('orderSearch').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredOrders = allOrders.filter(order =>
            order.orderNumber.toString().includes(searchTerm) ||
            order.userId?.name?.toLowerCase().includes(searchTerm) ||
            order.userId?.email?.toLowerCase().includes(searchTerm)
        );
        displayOrders(filteredOrders);
    });

    // User search
    document.getElementById('userSearch').addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredUsers = allUsers.filter(user =>
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
        displayUsers(filteredUsers);
    });

    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.status;
            displayOrders(allOrders);
        });
    });

    // Close modal buttons
    document.getElementById('closeUserModalBtn').addEventListener('click', closeUserModal);

    // Close modals on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeUserModal();
        }
    });

    // Close modals when clicking on backdrop
    document.getElementById('userModal').addEventListener('click', (e) => {
        // Only close if clicking directly on the modal wrapper, not on modal content
        if (e.target === document.getElementById('userModal')) {
            console.log('User modal backdrop clicked, closing modal');
            closeUserModal();
        }
    });

    // Prevent modal content clicks from closing modal
    document.querySelectorAll('.modal-content').forEach(content => {
        content.addEventListener('click', (e) => {
            console.log('Modal content clicked, preventing close');
            e.stopPropagation();
        });
    });
}

// ============================================
// NOTIFICATIONS
// ============================================

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const text = document.getElementById('notificationText');
    
    text.textContent = message;
    notification.classList.add('active');
    
    if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
    } else {
        notification.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
    }
    
    setTimeout(() => {
        notification.classList.remove('active');
    }, 3000);
}