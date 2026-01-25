// ============================================
// MODERN ADMIN PANEL - LIGHTER POOA
// ============================================

// Global State
let currentUser = null;
let allOrders = [];
let allUsers = [];
let allProducts = [];
let currentFilter = 'all';
let currentProductCategory = 'all';
let currentSection = 'dashboard';

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
    await checkAuth();
    setupNavigation();
    setupEventListeners();
    await loadDashboardData();
});

// Authentication
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
    document.getElementById('toggleSidebar').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('active');
    });
}

async function navigateToSection(sectionId) {
    currentSection = sectionId;
    
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
    if (sectionId === 'dashboard') await loadDashboardData();
    if (sectionId === 'orders') await loadOrders();
    if (sectionId === 'products') await loadProducts();
    if (sectionId === 'users') await loadUsers();

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
    }
}

// Dashboard Data
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
            document.getElementById('totalRevenue').textContent = `Ksh ${orderStats.stats.totalRevenue.toLocaleString()}`;
        }

        if (userStats.success) {
            document.getElementById('totalUsers').textContent = userStats.stats.totalUsers;
        }

        if (orders.success) {
            allOrders = orders.orders;
            displayRecentOrders(orders.orders.slice(0, 5));
        }
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        showNotification('Failed to load dashboard stats', 'error');
    }
}

function displayRecentOrders(orders) {
    const container = document.getElementById('recentOrders');
    if (orders.length === 0) {
        container.innerHTML = '<p>No recent orders</p>';
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="notification-item" onclick="openOrderModal('${order._id}')" style="cursor: pointer;">
            <div class="notif-icon"><i class="fas fa-shopping-cart"></i></div>
            <div class="notif-content">
                <p>#${order.orderNumber} - Ksh ${order.totalAmount.toLocaleString()}</p>
                <span class="notif-time">${order.userId?.firstName || 'Guest'} - ${order.orderStatus}</span>
            </div>
        </div>
    `).join('');
}

// Orders Management
async function loadOrders() {
    try {
        const response = await apiCall(API_ENDPOINTS.getAllOrders);
        if (response.success) {
            allOrders = response.orders;
            displayOrders(allOrders);
        }
    } catch (error) {
        showNotification('Failed to load orders', 'error');
    }
}

function displayOrders(orders) {
    const container = document.getElementById('ordersTilesContainer');
    
    let filtered = orders;
    if (currentFilter !== 'all') {
        filtered = orders.filter(o => o.orderStatus === currentFilter);
    }

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No orders found</p></div>';
        return;
    }

    container.innerHTML = filtered.map(order => {
        const firstItem = order.items[0];
        const displayImage = firstItem?.image || 'https://via.placeholder.com/150?text=No+Image';
        const customerName = order.userId ? `${order.userId.firstName} ${order.userId.lastName}`.trim() || order.userId.name : 'Guest';
        
        return `
            <div class="order-card" onclick="openOrderModal('${order._id}')">
                <div class="order-card-image">
                    <img src="${displayImage}" alt="${firstItem?.name || 'Order'}">
                </div>
                <div class="order-card-content">
                    <div class="card-header">
                        <span class="order-number">#${order.orderNumber}</span>
                        <span class="status-badge status-${order.orderStatus}">${order.orderStatus}</span>
                    </div>
                    <div class="order-summary">
                        <p><strong>Customer:</strong> ${customerName}</p>
                        <p class="order-date">${new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div class="card-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                        <span class="order-total" style="font-weight: 700; color: var(--primary-color);">Ksh ${order.totalAmount.toLocaleString()}</span>
                        <select class="status-selector" onclick="event.stopPropagation()" onchange="updateOrderStatusDirect('${order._id}', this.value)">
                            <option value="pending" ${order.orderStatus === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="processing" ${order.orderStatus === 'processing' ? 'selected' : ''}>Processing</option>
                            <option value="shipped" ${order.orderStatus === 'shipped' ? 'selected' : ''}>Shipped</option>
                            <option value="delivered" ${order.orderStatus === 'delivered' ? 'selected' : ''}>Delivered</option>
                            <option value="cancelled" ${order.orderStatus === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function updateOrderStatusDirect(orderId, newStatus) {
    try {
        const response = await apiCall(API_ENDPOINTS.updateOrderStatus(orderId), {
            method: 'PUT',
            body: JSON.stringify({ orderStatus: newStatus })
        });
        if (response.success) {
            showNotification(`Order status updated to ${newStatus}`);
            if (currentSection === 'orders') await loadOrders();
            else if (currentSection === 'dashboard') await loadDashboardData();
            
            // If the order modal is open, refresh the order details
            const orderModal = document.getElementById('orderModal');
            if (orderModal && orderModal.classList.contains('active')) {
                await openOrderModal(orderId);
            }
        }
    } catch (error) {
        showNotification(error.message || 'Update failed', 'error');
    }
}

// User Management
async function loadUsers() {
    try {
        const response = await apiCall(API_ENDPOINTS.getAllUsers);
        if (response.success) {
            allUsers = response.users;
            displayUsers(allUsers);
        }
    } catch (error) {
        showNotification('Failed to load users', 'error');
    }
}

function displayUsers(users) {
    const container = document.getElementById('usersTilesContainer');
    if (users.length === 0) {
        container.innerHTML = '<p>No users found</p>';
        return;
    }

    container.innerHTML = users.map(user => {
        const initials = user.firstName && user.lastName ? 
            `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 
            (user.name ? user.name.substring(0, 2).toUpperCase() : '??');
        
        const fullName = user.firstName && user.lastName ? 
            `${user.firstName} ${user.lastName}` : 
            (user.name || 'Anonymous User');

        return `
            <div class="user-card-modern glass-card" onclick="openUserModal('${user._id}')">
                <div class="user-card-header">
                    <div class="user-avatar-modern">
                        ${initials}
                    </div>
                    <div class="user-badge-role ${user.role}">${user.role}</div>
                </div>
                <div class="user-card-body">
                    <h3 class="user-name-modern">${fullName}</h3>
                    <p class="user-email-modern"><i class="far fa-envelope"></i> ${user.email}</p>
                    <div class="user-meta-modern">
                        <div class="meta-item">
                            <span class="meta-label">Joined</span>
                            <span class="meta-value">${new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Location</span>
                            <span class="meta-value">${user.address?.city || 'Not set'}</span>
                        </div>
                    </div>
                </div>
                <div class="user-card-footer">
                    <button class="btn-user-action" onclick="event.stopPropagation(); openUserModal('${user._id}')">
                        <i class="fas fa-eye"></i> View Profile
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Product Management
async function loadProducts() {
    try {
        const response = await apiCall(API_ENDPOINTS.getAllProducts);
        if (response.success) {
            allProducts = response.products;
            displayProducts(allProducts);
        }
    } catch (error) {
        showNotification('Failed to load products', 'error');
    }
}

function displayProducts(products) {
    const container = document.getElementById('productsTilesContainer');
    
    let filtered = products;
    if (currentProductCategory !== 'all') {
        filtered = products.filter(p => p.category === currentProductCategory);
    }

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No products found</p></div>';
        return;
    }

    container.innerHTML = filtered.map(product => `
        <div class="order-card" onclick="openProductModal('${product._id}')">
            <div class="order-card-image">
                <img src="${product.images[0] || 'https://via.placeholder.com/150?text=No+Image'}" alt="${product.name}">
            </div>
            <div class="order-card-content">
                <div class="card-header">
                    <span class="order-number">${product.name}</span>
                    <span class="status-badge" style="background: rgba(255,255,255,0.1); color: var(--text-main);">${product.category}</span>
                </div>
                <div class="order-summary">
                    <p>${product.description.substring(0, 60)}${product.description.length > 60 ? '...' : ''}</p>
                    <p class="order-date">Stock: ${product.stock || 0}</p>
                </div>
                <div class="card-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                    <span class="order-total" style="font-weight: 700; color: var(--primary-color);">Ksh ${product.price.toLocaleString()}</span>
                    <button class="btn-user-action" style="padding: 5px 10px; font-size: 0.8rem;">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const title = document.getElementById('productModalTitle');
    const deleteBtn = document.getElementById('deleteProductBtn');
    
    form.reset();
    document.getElementById('productId').value = '';
    deleteBtn.style.display = 'none';
    
    if (productId) {
        const product = allProducts.find(p => p._id === productId);
        if (product) {
            title.textContent = 'Edit Product';
            document.getElementById('productId').value = product._id;
            document.getElementById('prodName').value = product.name;
            document.getElementById('prodCategory').value = product.category;
            document.getElementById('prodPrice').value = product.price;
            document.getElementById('prodEmoji').value = product.emoji || '🔥';
            document.getElementById('prodDescription').value = product.description;
            document.getElementById('prodImages').value = product.images.join('\n');
            deleteBtn.style.display = 'block';
        }
    } else {
        title.textContent = 'Add New Product';
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

async function handleProductSubmit(e) {
    e.preventDefault();
    const productId = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('prodName').value,
        category: document.getElementById('prodCategory').value,
        price: parseFloat(document.getElementById('prodPrice').value),
        emoji: document.getElementById('prodEmoji').value,
        description: document.getElementById('prodDescription').value,
        images: document.getElementById('prodImages').value.split('\n').filter(url => url.trim() !== '')
    };

    try {
        let response;
        if (productId) {
            response = await apiCall(API_ENDPOINTS.updateProduct(productId), {
                method: 'PUT',
                body: JSON.stringify(productData)
            });
        } else {
            response = await apiCall(API_ENDPOINTS.createProduct, {
                method: 'POST',
                body: JSON.stringify(productData)
            });
        }

        if (response.success) {
            showNotification(productId ? 'Product updated successfully' : 'Product created successfully');
            closeProductModal();
            await loadProducts();
        }
    } catch (error) {
        showNotification(error.message || 'Action failed', 'error');
    }
}

async function deleteProduct() {
    const productId = document.getElementById('productId').value;
    if (!productId || !confirm('Are you sure you want to delete this product?')) return;

    try {
        const response = await apiCall(API_ENDPOINTS.deleteProduct(productId), {
            method: 'DELETE'
        });
        if (response.success) {
            showNotification('Product deleted successfully');
            closeProductModal();
            await loadProducts();
        }
    } catch (error) {
        showNotification(error.message || 'Delete failed', 'error');
    }
}

async function deleteOrder(orderId) {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;

    try {
        const response = await apiCall(API_ENDPOINTS.deleteOrder(orderId), {
            method: 'DELETE'
        });
        if (response.success) {
            showNotification('Order deleted successfully');
            await loadOrders();
        }
    } catch (error) {
        showNotification(error.message || 'Delete failed', 'error');
    }
}

// Order Modal Logic
async function openOrderModal(orderId) {
    try {
        const response = await apiCall(API_ENDPOINTS.getOrder(orderId));
        if (response.success) {
            const order = response.order;
            const body = document.getElementById('orderModalBody');
            
            // Tracking steps
            const statuses = ['pending', 'processing', 'shipped', 'delivered'];
            const currentStatusIndex = statuses.indexOf(order.orderStatus);

            body.innerHTML = `
                <div class="order-details-modern">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                        <div>
                            <h3 style="color: var(--primary-color); font-family: 'Bebas Neue', cursive; font-size: 2.2rem; margin: 0;">#${order.orderNumber}</h3>
                            <p style="color: var(--text-muted); margin: 5px 0 0;">Ordered on ${new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                        <div class="status-control">
                            <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 5px;">Update Status</label>
                            <select class="status-selector" style="font-size: 1rem; padding: 10px 20px;" onchange="updateOrderStatusDirect('${order._id}', this.value)">
                                <option value="pending" ${order.orderStatus === 'pending' ? 'selected' : ''}>Pending</option>
                                <option value="processing" ${order.orderStatus === 'processing' ? 'selected' : ''}>Processing</option>
                                <option value="shipped" ${order.orderStatus === 'shipped' ? 'selected' : ''}>Shipped</option>
                                <option value="delivered" ${order.orderStatus === 'delivered' ? 'selected' : ''}>Delivered</option>
                                <option value="cancelled" ${order.orderStatus === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                            </select>
                        </div>
                    </div>

                    <div class="tracking-container" style="margin-bottom: 30px; padding: 25px; background: rgba(255,255,255,0.03); border-radius: 20px; border: 1px solid var(--glass-border);">
                        <div class="tracking-steps" style="display: flex; justify-content: space-between; position: relative;">
                            ${statuses.map((s, index) => {
                                const isActive = index <= currentStatusIndex;
                                const isCompleted = index < currentStatusIndex;
                                return `
                                    <div class="tracking-step ${isActive ? 'active' : ''}" style="display: flex; flex-direction: column; align-items: center; z-index: 1; flex: 1; position: relative;">
                                        <div class="step-icon" style="width: 40px; height: 40px; border-radius: 50%; background: ${isActive ? 'var(--primary-color)' : '#333'}; display: flex; align-items: center; justify-content: center; color: white; margin-bottom: 10px; border: 4px solid ${isActive ? 'rgba(255,107,53,0.3)' : 'transparent'};">
                                            <i class="fas ${s === 'pending' ? 'fa-clock' : s === 'processing' ? 'fa-cog' : s === 'shipped' ? 'fa-truck' : 'fa-check'}"></i>
                                        </div>
                                        <span style="font-size: 0.8rem; font-weight: 600; color: ${isActive ? 'var(--text-main)' : 'var(--text-muted)'}; text-transform: capitalize;">${s}</span>
                                        ${index < statuses.length - 1 ? `
                                            <div class="step-line" style="position: absolute; top: 20px; left: calc(50% + 25px); width: calc(100% - 50px); height: 3px; background: ${isCompleted ? 'var(--primary-color)' : '#333'}; z-index: -1;"></div>
                                        ` : ''}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                        <div class="glass-card" style="padding: 20px; background: rgba(255,255,255,0.02);">
                            <h4 style="font-family: 'Bebas Neue', cursive; font-size: 1.4rem; color: var(--primary-color); margin-bottom: 15px;">Customer Info</h4>
                            <p style="margin: 0; font-weight: 600; font-size: 1.1rem;">${order.userId?.firstName || ''} ${order.userId?.lastName || order.userId?.name || 'Guest'}</p>
                            <p style="margin: 5px 0; color: var(--text-muted);">${order.userId?.email || order.shippingInfo?.email}</p>
                            <p style="margin: 0; color: var(--text-muted);">${order.shippingInfo?.phone || 'No phone'}</p>
                        </div>
                        <div class="glass-card" style="padding: 20px; background: rgba(255,255,255,0.02);">
                            <h4 style="font-family: 'Bebas Neue', cursive; font-size: 1.4rem; color: var(--primary-color); margin-bottom: 15px;">Shipping Address</h4>
                            <p style="margin: 0; font-weight: 500;">${order.shippingInfo?.street || order.shippingInfo?.address}</p>
                            <p style="margin: 5px 0; color: var(--text-muted);">${order.shippingInfo?.city}, ${order.shippingInfo?.state} ${order.shippingInfo?.zipCode}</p>
                        </div>
                    </div>

                    <div class="items-list glass-card" style="padding: 25px; margin-bottom: 25px; background: rgba(255,255,255,0.02);">
                        <h4 style="font-family: 'Bebas Neue', cursive; font-size: 1.4rem; color: var(--primary-color); margin-bottom: 20px;">Order Items</h4>
                        <div style="display: flex; flex-direction: column; gap: 15px;">
                            ${order.items.map(item => `
                                <div style="display: flex; align-items: center; gap: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                                    <img src="${item.image || 'https://via.placeholder.com/60'}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 10px;">
                                    <div style="flex: 1;">
                                        <h5 style="margin: 0; font-size: 1.1rem;">${item.name}</h5>
                                        <p style="margin: 5px 0 0; color: var(--text-muted); font-size: 0.9rem;">Quantity: ${item.quantity} x Ksh ${item.price.toLocaleString()}</p>
                                    </div>
                                    <div style="font-weight: 700; color: var(--primary-color); font-size: 1.1rem;">Ksh ${(item.price * item.quantity).toLocaleString()}</div>
                                </div>
                            `).join('')}
                        </div>
                        <div style="display: flex; justify-content: space-between; font-weight: 700; margin-top: 25px; color: var(--primary-color); font-size: 1.5rem; background: rgba(255,107,53,0.1); padding: 15px; border-radius: 12px;">
                            <span>Total Amount</span>
                            <span>Ksh ${order.totalAmount.toLocaleString()}</span>
                        </div>
                    </div>

                    <div class="actions" style="display: flex; gap: 15px;">
                        <button class="btn-danger" onclick="deleteOrder('${order._id}')" style="flex: 1;"><i class="fas fa-trash"></i> Delete Order</button>
                        <button class="btn-primary" onclick="window.print()" style="flex: 1;"><i class="fas fa-print"></i> Print Invoice</button>
                        <button class="btn-secondary" onclick="document.getElementById('orderModal').classList.remove('active')" style="flex: 1;">Close</button>
                    </div>
                </div>
            `;
            document.getElementById('orderModal').classList.add('active');
        }
    } catch (error) {
        console.error('Failed to load order details:', error);
        showNotification('Failed to load order details', 'error');
    }
}

// User Modal Logic
async function openUserModal(userId) {
    const user = allUsers.find(u => u._id === userId);
    if (!user) return;

    const body = document.getElementById('userModalBody');
    body.innerHTML = `
        <div class="user-details-modal">
            <div style="text-align: center; margin-bottom: 20px;">
                <div class="user-avatar" style="width: 80px; height: 80px; font-size: 2.5rem; margin: 0 auto 15px;">
                    <i class="fas fa-user"></i>
                </div>
                <h3>${user.firstName} ${user.lastName}</h3>
                <span class="user-role ${user.role}">${user.role}</span>
            </div>
            <div class="glass-card" style="padding: 20px;">
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Phone:</strong> ${user.phone || 'Not set'}</p>
                <p><strong>Member Since:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
                <hr style="margin: 15px 0; opacity: 0.1;">
                <p><strong>Address:</strong><br>
                ${user.address?.street || 'Not set'}<br>
                ${user.address?.city || ''} ${user.address?.state || ''} ${user.address?.zipCode || ''}</p>
            </div>
        </div>
    `;
    document.getElementById('userModal').classList.add('active');
}

// Event Listeners
function setupEventListeners() {
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Modal Close
    document.getElementById('closeOrderModal').addEventListener('click', () => {
        document.getElementById('orderModal').classList.remove('active');
    });
    document.getElementById('closeUserModalBtn').addEventListener('click', () => {
        document.getElementById('userModal').classList.remove('active');
    });

    // Close on overlay click
    window.onclick = (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('active');
        }
    };

    // Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.status;
            displayOrders(allOrders);
        });
    });

    // Search
    document.getElementById('orderSearch').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allOrders.filter(o => 
            o.orderNumber.toLowerCase().includes(query) || 
            (o.userId?.firstName + ' ' + o.userId?.lastName).toLowerCase().includes(query)
        );
        displayOrders(filtered);
    });

    document.getElementById('userSearch').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = allUsers.filter(u => 
            (u.firstName + ' ' + u.lastName).toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query)
        );
        displayUsers(filtered);
    });
}

// Notifications
function showNotification(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'info') icon = 'fa-info-circle';

    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
