// ============================================
// USER DASHBOARD - LIGHTER POOA
// ============================================

// Global State
let currentUser = null;
let userOrders = [];
let currentSection = 'overview';

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
    console.log('📊 Dashboard initializing...');
    await checkAuth();
    setupNavigation();
    setupEventListeners();
    
    // Check URL hash for initial section
    const hash = window.location.hash.replace('#', '');
    const validSections = ['overview', 'profile', 'orders', 'inbox'];
    if (hash && validSections.includes(hash)) {
        navigateToSection(hash);
    } else {
        await loadDashboardData();
    }
});

// Authentication Check
async function checkAuth() {
    const token = getAuthToken();
    if (!token) {
        console.warn('⚠️ No token found, redirecting to login');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await apiCall(API_ENDPOINTS.getUser);
        if (response && response.success) {
            currentUser = response.user;
            
            // Redirect admin to admin panel
            if (currentUser.role === 'admin') {
                window.location.href = 'admin.html';
                return;
            }
            
            updateWelcomeUI();
        } else {
            console.error('❌ Auth check failed, logging out');
            logout();
        }
    } catch (error) {
        console.error('❌ Auth check error:', error);
        logout();
    }
}

function logout() {
    localStorage.removeItem('lighterPooaToken');
    localStorage.removeItem('lighterPooaUser');
    window.location.href = 'index.html';
}

function updateWelcomeUI() {
    const welcomeName = document.getElementById('welcomeName');
    if (welcomeName && currentUser) {
        welcomeName.textContent = currentUser.firstName || currentUser.name || 'User';
    }
}

// Navigation Logic
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-section]');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const section = item.getAttribute('data-section');
            navigateToSection(section);
        });
    });

    // Mobile Sidebar Toggle
    const toggleSidebar = document.getElementById('toggleSidebar');
    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('active');
        });
    }
}

async function navigateToSection(sectionId) {
    if (!sectionId) return;
    
    currentSection = sectionId;
    window.location.hash = sectionId;
    
    // Update active nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === sectionId) {
            item.classList.add('active');
        }
    });

    // Update sections visibility
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(`${sectionId}Section`);
    if (targetSection) targetSection.classList.add('active');

    // Load section specific data
    if (sectionId === 'overview') await loadDashboardData();
    if (sectionId === 'profile') loadUserProfile();
    if (sectionId === 'orders') await loadOrders();
    if (sectionId === 'inbox') loadInbox();

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) sidebar.classList.remove('active');
    }
}

// Dashboard Data (Overview)
async function loadDashboardData() {
    try {
        const response = await apiCall(API_ENDPOINTS.getMyOrders);
        if (response && response.success) {
            userOrders = response.orders;
            
            // Update stats
            const statOrders = document.getElementById('statOrders');
            if (statOrders) statOrders.textContent = userOrders.length;
            
            const pendingOrders = userOrders.filter(o => o.orderStatus === 'pending').length;
            const statPending = document.getElementById('statPending');
            if (statPending) statPending.textContent = pendingOrders;
            
            updateBadges();
            displayRecentOrders(userOrders.slice(0, 3));
        }
    } catch (error) {
        console.error('❌ Failed to load dashboard data:', error);
    }
}

function updateBadges() {
    // Inbox badge (simulated for now)
    const inboxBadge = document.getElementById('inboxBadge');
    if (inboxBadge && currentSection !== 'inbox') {
        inboxBadge.textContent = '2';
        inboxBadge.style.display = 'flex';
    }

    // Update Overview stat card for Inbox
    const statInbox = document.getElementById('statInbox');
    if (statInbox) {
        statInbox.textContent = '2';
    }
}

function displayRecentOrders(orders) {
    const container = document.getElementById('recentOrdersList');
    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = '<p class="empty-text">No orders yet.</p>';
        return;
    }

    container.innerHTML = orders.map(order => {
        const firstItem = order.items[0];
        const displayImage = firstItem?.image || 'https://via.placeholder.com/150?text=No+Image';
        
        return `
            <div class="list-item" onclick="viewOrderDetails('${order._id}')">
                <div class="item-img-container">
                    <img src="${displayImage}" alt="Order #${order.orderNumber}" class="item-mini-img">
                </div>
                <div class="item-info">
                    <p class="item-title">Order #${order.orderNumber}</p>
                    <p class="item-subtitle">${new Date(order.createdAt).toLocaleDateString()} • Ksh ${order.totalAmount.toLocaleString()}</p>
                </div>
                <span class="status-pill status-${order.orderStatus}">${order.orderStatus}</span>
            </div>
        `;
    }).join('');
}

// Profile Management
function loadUserProfile() {
    if (!currentUser) return;

    document.getElementById('profileFullName').textContent = `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || currentUser.name || 'User';
    document.getElementById('profileEmail').textContent = currentUser.email;
    
    document.getElementById('userFirstName').textContent = currentUser.firstName || 'Not set';
    document.getElementById('userLastName').textContent = currentUser.lastName || 'Not set';
    document.getElementById('userPhone').textContent = currentUser.phone || 'Not set';
    
    if (currentUser.address) {
        document.getElementById('userStreet').textContent = currentUser.address.street || 'Not set';
        document.getElementById('userCity').textContent = currentUser.address.city || 'Not set';
        document.getElementById('userState').textContent = currentUser.address.state || 'Not set';
        document.getElementById('userZipCode').textContent = currentUser.address.zipCode || 'Not set';
    }
}

function getOrderHTML(order) {
    const firstItem = order.items[0];
    const displayImage = firstItem?.image || 'https://via.placeholder.com/150?text=No+Image';
    
    return `
        <div class="order-card" onclick="viewOrderDetails('${order._id}')">
            <div class="order-card-image">
                <img src="${displayImage}" alt="Order ${order.orderNumber}">
            </div>
            <div class="order-card-content" style="padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="font-weight: 700; color: var(--primary-color);">#${order.orderNumber}</span>
                    <span class="status-badge status-${order.orderStatus}">${order.orderStatus}</span>
                </div>
                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 15px;">
                    ${new Date(order.createdAt).toLocaleDateString()} • ${order.items.length} item(s)
                </p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 700; font-size: 1.1rem;">Ksh ${order.totalAmount.toLocaleString()}</span>
                    <button class="btn-outline" style="padding: 5px 12px; font-size: 0.8rem;">Details</button>
                </div>
            </div>
        </div>
    `;
}

// Orders Section
async function loadOrders() {
    const container = document.getElementById('ordersContainer');
    if (!container) return;

    try {
        container.innerHTML = '<p class="loading-text">Loading orders...</p>';
        const response = await apiCall(API_ENDPOINTS.getMyOrders);
        
        if (response && response.success) {
            userOrders = response.orders;
            if (userOrders.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-box-open"></i>
                        <p>You haven't placed any orders yet.</p>
                        <a href="index.html" class="btn-primary">Start Shopping</a>
                    </div>
                `;
                return;
            }

            container.innerHTML = userOrders.map(order => getOrderHTML(order)).join('');
        }
    } catch (error) {
        console.error('❌ Failed to load orders:', error);
        container.innerHTML = '<p class="error-text">Failed to load orders. Please try again.</p>';
    }
}

// Order Details Modal
async function viewOrderDetails(orderId) {
    const modal = document.getElementById('orderDetailsModal');
    const content = document.getElementById('orderDetailsContent');
    if (!modal || !content) return;

    modal.classList.add('active');
    content.innerHTML = '<p class="loading-text">Loading order details...</p>';

    try {
        const response = await apiCall(API_ENDPOINTS.getOrder(orderId));
        if (response && response.success) {
            const order = response.order;
            
            content.innerHTML = `
                <div class="order-details-modern">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <div>
                            <p style="color: #a0a0a0; font-size: 0.9rem;">Order Number</p>
                            <h3 style="color: #ff6b35; font-family: 'Bebas Neue', cursive; font-size: 2rem;">#${order.orderNumber}</h3>
                            <p style="color: #a0a0a0; font-size: 0.8rem;">Ordered on ${new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div style="text-align: right;">
                            <span class="status-badge status-${order.orderStatus}" style="font-size: 1rem; padding: 8px 15px;">${order.orderStatus}</span>
                            <div style="margin-top: 10px;">
                                <button class="btn-primary" onclick="reorderItems('${order._id}')" style="padding: 8px 15px; font-size: 0.9rem;">
                                    <i class="fas fa-redo"></i> Re-order
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="order-items-list" style="margin-bottom: 30px;">
                        <h4 style="margin-bottom: 15px; font-family: 'Bebas Neue', cursive; font-size: 1.5rem;">Items</h4>
                        ${order.items.map(item => `
                            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px; padding: 10px; background: rgba(255,255,255,0.02); border-radius: 10px;">
                                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                                <div style="flex: 1;">
                                    <p style="font-weight: 600;">${item.name}</p>
                                    <p style="font-size: 0.85rem; color: #a0a0a0;">Qty: ${item.quantity} × Ksh ${item.price.toLocaleString()}</p>
                                </div>
                                <p style="font-weight: 700;">Ksh ${(item.quantity * item.price).toLocaleString()}</p>
                            </div>
                        `).join('')}
                    </div>

                    <div style="background: rgba(255,107,53,0.05); padding: 20px; border-radius: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span>Subtotal</span>
                            <span>Ksh ${order.totalAmount.toLocaleString()}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                            <span>Shipping</span>
                            <span style="color: #2ecc71;">FREE</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1); font-weight: 700; font-size: 1.2rem;">
                            <span>Total</span>
                            <span style="color: #ff6b35;">Ksh ${order.totalAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    <div style="margin-top: 30px;">
                        <h4 style="margin-bottom: 15px; font-family: 'Bebas Neue', cursive; font-size: 1.5rem;">Shipping Address</h4>
                        <div style="color: #a0a0a0; line-height: 1.6;">
                            <p style="color: #fff; font-weight: 600;">${order.shippingInfo.firstName} ${order.shippingInfo.lastName}</p>
                            <p>${order.shippingInfo.street}</p>
                            <p>${order.shippingInfo.city}, ${order.shippingInfo.state} ${order.shippingInfo.zipCode}</p>
                            <p>${order.shippingInfo.phone}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('❌ Failed to load order details:', error);
        content.innerHTML = '<p class="error-text">Failed to load order details.</p>';
    }
}

// Event Listeners
function setupEventListeners() {
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }

    // Modal Close
    const closeOrderDetails = document.getElementById('closeOrderDetails');
    if (closeOrderDetails) {
        closeOrderDetails.addEventListener('click', () => {
            document.getElementById('orderDetailsModal').classList.remove('active');
        });
    }

    // Profile Editing
    const editProfileBtn = document.getElementById('editProfileBtn');
    const saveProfileBtn = document.getElementById('saveProfileBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', toggleProfileEdit);
    }
    
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', toggleProfileEdit);
    }
    
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', handleProfileUpdate);
    }

    // Search Orders
    const orderSearch = document.getElementById('orderSearch');
    if (orderSearch) {
        orderSearch.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredOrders = userOrders.filter(o => 
                o.orderNumber.toLowerCase().includes(searchTerm)
            );
            displayFilteredOrders(filteredOrders);
        });
    }
}

function displayFilteredOrders(orders) {
    const container = document.getElementById('ordersContainer');
    if (!container) return;

    if (orders.length === 0) {
        container.innerHTML = '<p class="empty-text">No matching orders found.</p>';
        return;
    }

    container.innerHTML = orders.map(order => getOrderHTML(order)).join('');
}

async function reorderItems(orderId) {
    try {
        const response = await apiCall(API_ENDPOINTS.getOrder(orderId));
        if (response && response.success) {
            const order = response.order;
            let cart = JSON.parse(localStorage.getItem('lighterPooaCart')) || [];
            
            order.items.forEach(orderItem => {
                const existingItem = cart.find(item => item.id === orderItem.productId || item.name === orderItem.name);
                if (existingItem) {
                    existingItem.quantity += orderItem.quantity;
                } else {
                    cart.push({
                        id: orderItem.productId,
                        name: orderItem.name,
                        price: orderItem.price,
                        image: orderItem.image,
                        quantity: orderItem.quantity
                    });
                }
            });
            
            localStorage.setItem('lighterPooaCart', JSON.stringify(cart));
            showNotification('Order items added to your cart!', 'success');
            
            // Redirect to cart after a short delay
            setTimeout(() => {
                window.location.href = 'index.html#cart';
            }, 1500);
        }
    } catch (error) {
        console.error('❌ Reorder failed:', error);
        showNotification('Failed to re-order items', 'error');
    }
}

function loadInbox() {
    const inboxBadge = document.getElementById('inboxBadge');
    if (inboxBadge) {
        inboxBadge.style.display = 'none'; // Clear badge when viewing inbox
    }
}

function toggleProfileEdit() {
    const isEditing = document.getElementById('editActions').style.display !== 'none';
    
    const displayFields = ['userFirstName', 'userLastName', 'userPhone', 'userStreet', 'userCity', 'userState', 'userZipCode'];
    const editFields = ['editUserFirstName', 'editUserLastName', 'editUserPhone', 'editUserStreet', 'editUserCity', 'editUserState', 'editUserZipCode'];
    
    if (!isEditing) {
        // Switch to edit mode
        displayFields.forEach(id => document.getElementById(id).style.display = 'none');
        editFields.forEach(id => {
            const el = document.getElementById(id);
            el.style.display = 'block';
            // Set value from current text
            const displayId = id.replace('edit', '').charAt(0).toLowerCase() + id.replace('edit', '').slice(1);
            const text = document.getElementById(displayId).textContent;
            el.value = text === 'Not set' ? '' : text;
        });
        document.getElementById('editActions').style.display = 'flex';
        document.getElementById('editProfileBtn').style.display = 'none';
    } else {
        // Switch to view mode
        displayFields.forEach(id => document.getElementById(id).style.display = 'block');
        editFields.forEach(id => document.getElementById(id).style.display = 'none');
        document.getElementById('editActions').style.display = 'none';
        document.getElementById('editProfileBtn').style.display = 'block';
    }
}

async function handleProfileUpdate() {
    const updateData = {
        firstName: document.getElementById('editUserFirstName').value,
        lastName: document.getElementById('editUserLastName').value,
        phone: document.getElementById('editUserPhone').value,
        address: {
            street: document.getElementById('editUserStreet').value,
            city: document.getElementById('editUserCity').value,
            state: document.getElementById('editUserState').value,
            zipCode: document.getElementById('editUserZipCode').value
        }
    };

    try {
        const saveBtn = document.getElementById('saveProfileBtn');
        saveBtn.textContent = 'Saving...';
        saveBtn.disabled = true;

        const response = await apiCall(API_ENDPOINTS.updateProfile, {
            method: 'PUT',
            body: JSON.stringify(updateData)
        });

        if (response && response.success) {
            currentUser = response.user;
            localStorage.setItem('lighterPooaUser', JSON.stringify(currentUser));
            loadUserProfile();
            toggleProfileEdit();
            showNotification('Profile updated successfully!', 'success');
        }
    } catch (error) {
        console.error('❌ Profile update failed:', error);
        showNotification(error.message || 'Failed to update profile', 'error');
    } finally {
        const saveBtn = document.getElementById('saveProfileBtn');
        saveBtn.textContent = 'Save Changes';
        saveBtn.disabled = false;
    }
}

// Global helper for showing notifications (matches main script)
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#2ecc71' : '#e74c3c'};
        color: white;
        border-radius: 10px;
        z-index: 9999;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation keyframes for notifications if they don't exist
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
