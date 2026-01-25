// ============================================
// API CONFIGURATION - LIGHTER POOA
// ============================================

// API Base URL - Change this if your backend runs on a different port
const API_BASE_URL = 'http://localhost:5000/api';

// Paystack Public Key (Replace with your actual public key)
const PAYSTACK_PUBLIC_KEY = 'pk_test_232531a5c927ef2cc67ed1b85af3f26e3b8ed2f2';

// ============================================
// API ENDPOINTS
// ============================================
const API_ENDPOINTS = {
    // Auth
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    getUser: `${API_BASE_URL}/auth/me`,
    updateProfile: `${API_BASE_URL}/auth/profile`,
    
    // Orders
    createOrder: `${API_BASE_URL}/orders`,
    getMyOrders: `${API_BASE_URL}/orders/my-orders`,
    getOrder: (id) => `${API_BASE_URL}/orders/${id}`,
    updatePayment: (id) => `${API_BASE_URL}/orders/${id}/payment`,
    
    // Admin
    getAllOrders: `${API_BASE_URL}/orders/admin/all`,
    updateOrderStatus: (id) => `${API_BASE_URL}/orders/admin/${id}/status`,
    deleteOrder: (id) => `${API_BASE_URL}/orders/admin/${id}`,
    getOrderStats: `${API_BASE_URL}/orders/admin/stats`,
    getAllUsers: `${API_BASE_URL}/users/admin/all`,
    getUserStats: `${API_BASE_URL}/users/admin/stats`,
    
    // Products
    getAllProducts: `${API_BASE_URL}/products`,
    createProduct: `${API_BASE_URL}/products`,
    updateProduct: (id) => `${API_BASE_URL}/products/${id}`,
    deleteProduct: (id) => `${API_BASE_URL}/products/${id}`,
    seedProducts: `${API_BASE_URL}/products/seed`,
    
    // Payment
    initializePayment: `${API_BASE_URL}/payment/initialize`,
    verifyPayment: (ref) => `${API_BASE_URL}/payment/verify/${ref}`
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get authentication token from localStorage
 * @returns {string|null} JWT token or null
 */
function getAuthToken() {
    return localStorage.getItem('lighterPooaToken');
}

/**
 * Get authentication headers for API requests
 * @returns {Object} Headers object with Content-Type and Authorization
 */
function getAuthHeaders() {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
}

/**
 * Make API call with proper error handling
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<Object>} Response data
 * @throws {Error} If request fails
 */
async function apiCall(url, options = {}) {
    const requestOptions = {
        method: options.method || 'GET',
        headers: {
            ...getAuthHeaders(),
            ...options.headers
        }
    };

    // Add body if provided
    if (options.body) {
        requestOptions.body = options.body;
    }

    try {
        console.log('🌐 API Call:', requestOptions.method, url);
        
        const response = await fetch(url, requestOptions);
        
        console.log('📡 Response Status:', response.status, response.statusText);
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        const isJson = contentType && contentType.includes('application/json');
        
        if (!isJson) {
            console.error('❌ Response is not JSON:', contentType);
            throw new Error('Server returned invalid response format');
        }
        
        const data = await response.json();
        console.log('📦 Response Data:', data);

        // Check if response is successful
        if (!response.ok) {
            const errorMessage = data?.message || data?.error || response.statusText || 'API request failed';
            console.error('❌ API Error:', errorMessage);
            throw new Error(errorMessage);
        }

        return data;
    } catch (error) {
        console.error('❌ API Call Failed:', error.message);
        
        // Check for network errors
        if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
            throw new Error('Cannot connect to server. Please make sure the server is running on https://lighter-s6lv.onrender.com');
        }
        
        // Check for CORS errors
        if (error.message.includes('CORS')) {
            throw new Error('CORS error. Please check server configuration.');
        }
        
        throw error;
    }
}

/**
 * Check if server is running
 * @returns {Promise<boolean>} True if server is running
 */
async function checkServerStatus() {
    try {
        const response = await fetch(`${API_BASE_URL.replace('/api', '')}/`, {
            method: 'GET',
            cache: 'no-cache'
        });
        return response.ok;
    } catch (error) {
        console.error('❌ Server is not running:', error.message);
        return false;
    }
}

// ============================================
// EXPORT FOR NODE.JS (if needed)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_BASE_URL,
        API_ENDPOINTS,
        PAYSTACK_PUBLIC_KEY,
        getAuthToken,
        getAuthHeaders,
        apiCall,
        checkServerStatus
    };
}