// ===== PRODUCT DATA =====
const products = [
    {
        id: 1,
        name: "Classic Zippo Lighter",
        category: "lighters",
        price: 3899,
        description: "Iconic windproof lighter with lifetime guarantee",
        images: ["https://www.hansonellis.com/mm5/graphics/00000001/engraved-silver-polished-classic-zippo-lighter.jpg", "https://www.zippo.com/cdn/shop/products/zau89ndsgta0yvs3nprh.jpg?v=1744725583&width=1445", "https://assets.katogroup.eu/i/katogroup/ZP250-023085_01_zippo"],
        video: "flames.mp4",
        emoji: "🔥"
    },
    {
        id: 2,
        name: "Torch Lighter Pro",
        category: "lighters",
        price: 5199,
        description: "Professional grade torch lighter with adjustable flame",
        images: ["https://www.greenlion.net/web/image/315624-38c1bc5d/Green%20Lion%20Jet%20Flame%20Pro%20Windproof%20Lighter%20-%20Black%20%282%29.webp", "https://sc04.alicdn.com/kf/H406dd289a52a4ba2b8a62ce58fd9a2fbv.jpg"],
        video: "flames.mp4",
        emoji: "🔥"
    },
    {
        id: 3,
        name: "Electric Arc Lighter",
        category: "lighters",
        price: 3249,
        description: "USB rechargeable plasma arc lighter",
        images: ["https://m.media-amazon.com/images/I/519Yri1MxPL._UF1000,1000_QL80_.jpg", "https://m.media-amazon.com/images/I/61QTYr-g2HL.jpg"],
        video: "flames.mp4",
        emoji: "⚡"
    },
    {
        id: 4,
        name: "Premium Rolling Papers",
        category: "accessories",
        price: 649,
        description: "Ultra-thin slow-burn rolling papers (50 pack)",
        images: ["https://image.made-in-china.com/202f0j00cNzQCRpaaZrK/14GSM-Make-Your-Own-Brand-Classic-Type-Unbleached-Cigarette-Rolling-Paper-with-Filter-Tips-Package.webp", "https://image.made-in-china.com/202f0j00aosiNztnEOkI/Premium-Cigarette-Rolling-Papers-with-Tips-single-1-1-4-kingslim-size-.webp"],
        video: "flames.mp4",
        emoji: "📄"
    },
    {
        id: 5,
        name: "Grinder Deluxe",
        category: "accessories",
        price: 2599,
        description: "4-piece aluminum grinder with pollen catcher",
        images: ["https://powerhouseexpress.com.pk/cdn/shop/files/anex-ag-639-deluxe-grinder-1.webp?v=1747308208&width=1445", "https://nazarjanssupermarket.com/cdn/shop/files/anex-deluxe-grinder-ag-632-nazar-jan-s-supermarket-2.jpg?v=1715281294"],
        video: "flames.mp4",
        emoji: "⚙️"
    },
    {
        id: 6,
        name: "Glass Ashtray",
        category: "accessories",
        price: 1949,
        description: "Heavy-duty crystal glass ashtray",
        images: ["https://m.media-amazon.com/images/I/51xIA3As5ZL._UF1000,1000_QL80_.jpg", "https://m.media-amazon.com/images/I/61XiEbe55sL._UF1000,1000_QL80_.jpg"],
        video: "flames.mp4",
        emoji: "🚬"
    },
    {
        id: 7,
        name: "Portable Vaporizer",
        category: "gadgets",
        price: 11699,
        description: "Compact dry herb vaporizer with temperature control",
        images: ["https://www.vapor.com/cdn/shop/files/9284486_ef9b251a-d168-42dd-b53c-cc4a67a2f938.png?v=1689910145&width=533", "https://cdn.shopify.com/s/files/1/0083/3817/8111/collections/shop-portable-vaporizers.jpg?v=1739396445"],
        video: "flames.mp4",
        emoji: "💨"
    },
    {
        id: 8,
        name: "LED Lighter Display",
        category: "gadgets",
        price: 4549,
        description: "Rechargeable lighter with LED display",
        images: ["https://www.awelled.com/wp-content/uploads/sites/8/2021/10/LED-Revolving-Ligh-for-jewelry-display-t-AW-RL1120-3-smaller-600x600.jpg", "https://i.ytimg.com/vi/VFALE_lYEyQ/sddefault.jpg"],
        video: "flames.mp4",
        emoji: "💡"
    },
    {
        id: 9,
        name: "Smoking Pipe Set",
        category: "accessories",
        price: 5849,
        description: "Premium wooden pipe with cleaning kit",
        images: ["https://i.ebayimg.com/images/g/TDYAAOSw3EFjQZ4i/s-l1200.png", "https://i.ebayimg.com/images/g/lj4AAeSwbaln~Pl4/s-l1200.jpg"],
        video: "flames.mp4",
        emoji: " 🚬"
    },
    {
        id: 10,
        name: "Butane Refill Pack",
        category: "accessories",
        price: 1689,
        description: "Premium butane fuel (3 pack)",
        images: ["https://image.made-in-china.com/2f0j00fsVhJtdnZTGl/150ml-Butane-Gas-Can-96-Pack-Universal-Gas-Lighter-Refill-Can-Refillable-Butane-Gas.webp", "https://images-na.ssl-images-amazon.com/images/I/81tnULKtwpL._AC_UL495_SR435,495_.jpg"],
        video: "flames.mp4",
        emoji: "⛽"
    },
    {
        id: 11,
        name: "Gold Plated Lighter",
        category: "lighters",
        price: 10399,
        description: "Luxury gold-plated lighter with engraving",
        images: ["https://i.redd.it/q36ksr30m27c1.jpeg", "https://lightersdirect.com/cdn/shop/files/DU24RRR5101710TU-3_1400x.jpg?v=1708963033"],
        video: "flames.mp4",
        emoji: "✨"
    },
    {
        id: 12,
        name: "Smart Lighter Case",
        category: "gadgets",
        price: 3899,
        description: "Protective case with built-in tracker",
        images: ["https://img.drz.lazcdn.com/static/bd/p/d6383feb5b2ac5ab19f157159d61c405.jpg_720x720q80.jpg", "https://m.media-amazon.com/images/I/51jV7M4vUIL.jpg"],
        video: "flames.mp4",
        emoji: "📱"
    }
];

// ===== CART STATE =====
let cart = JSON.parse(localStorage.getItem('lighterPooaCart')) || [];

// ===== DOM ELEMENTS =====
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartCount = document.getElementById('cartCount');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const totalPrice = document.getElementById('totalPrice');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const overlay = window.overlay || document.getElementById('overlay');
const loadingButtons = window.loadingButtons || new WeakSet();
window.loadingButtons = loadingButtons;
window.overlay = overlay;
const checkoutForm = document.getElementById('checkoutForm');
const summaryItems = document.getElementById('summaryItems');
const checkoutTotal = document.getElementById('checkoutTotal');
const successMessage = document.getElementById('successMessage');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const contactForm = document.getElementById('contactForm');

// Mobile menu elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileAuthButtons = document.getElementById('mobileAuthButtons');
const mobileUserMenu = document.getElementById('mobileUserMenu');
const mobileUserGreeting = document.getElementById('mobileUserGreeting');
const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
const mobileCartBtn = document.getElementById('mobileCartBtn');
const mobileCartCount = document.getElementById('mobileCartCount');

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', () => {
    renderProducts('all');
    updateCartUI();
    setupEventListeners();
    setupSmoothScroll();
    hydrateButtonStates();
    updateAuthUI();
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    // Initialize video playback
    initializeVideoPlayback();

    // Header scroll behavior
    let lastScrollTop = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            header.classList.add('hidden');
        } else {
            // Scrolling up or at top
            header.classList.remove('hidden');
        }

        lastScrollTop = scrollTop;
    });
});

function hydrateButtonStates() {
    // Ensure previously saved button loading states are cleared
    if (!window.loadingButtons) {
        window.loadingButtons = new WeakSet();
    }

    // Clear any lingering loading styles on primary action buttons
    const buttons = document.querySelectorAll('[data-loading-state], .is-loading');
    buttons.forEach(button => {
        button.classList.remove('is-loading');
        button.removeAttribute('data-loading-state');
        button.removeAttribute('disabled');

        const originalText = button.getAttribute('data-original-text');
        if (originalText) {
            button.textContent = originalText;
        }
    });
}

// ===== RENDER PRODUCTS =====
function renderProducts(filter) {
    const filteredProducts = filter === 'all'
        ? products
        : products.filter(p => p.category === filter);

    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-category="${product.category}">
            <div class="product-image-container">
                <div class="image-carousel" data-product-id="${product.id}">
                    <div class="carousel-images">
                        ${product.images.map((img, index) => `
                            <img src="${img}" alt="${product.name}" class="carousel-image ${index === 0 ? 'active' : ''}" data-index="${index}">
                        `).join('')}
                    </div>
                    <button class="carousel-arrow carousel-prev" data-product-id="${product.id}">&#8249;</button>
                    <button class="carousel-arrow carousel-next" data-product-id="${product.id}">&#8250;</button>
                    <div class="carousel-indicators">
                        ${product.images.map((_, index) => `
                            <span class="indicator ${index === 0 ? 'active' : ''}" data-index="${index}" data-product-id="${product.id}"></span>
                        `).join('')}
                    </div>
                </div>
                <button class="play-video-btn" data-product-id="${product.id}" data-video="${product.video}">
                    <span class="play-icon">▶</span> Play Video
                </button>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">Ksh ${product.price.toLocaleString()}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Animate cards
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card, index) => {
        card.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s backwards`;
    });

    // Initialize carousels
    initializeCarousels();
}

// ===== FILTER PRODUCTS =====
const filterButtons = document.querySelectorAll('.filter-btn');
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        renderProducts(filter);
    });
});

// ===== ADD TO CART =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showNotification('Item added to cart!', 'success', true);
}

// ===== UPDATE CART UI =====
function updateCartUI() {
    const cartTotal = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = cartTotal;
    if (mobileCartCount) mobileCartCount.textContent = cartTotal;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        totalPrice.textContent = 'Ksh 0';
        return;
    }

    // Ensure cart items have all necessary properties by matching with products array
    const validatedCart = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (product) {
            // If product is found, merge with cart item (preserve quantity)
            return {
                ...product,
                quantity: item.quantity
            };
        }
        // If product not found, keep the item but set defaults
        return {
            ...item,
            name: item.name || 'Unidentified Product',
            price: item.price || 0,
            emoji: item.emoji || '📦'
        };
    });

    cartItems.innerHTML = validatedCart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.images && item.images[0] ? item.images[0] : 'https://via.placeholder.com/80?text=No+Image'}" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">Ksh ${item.price.toLocaleString()}</div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="cart-item-quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button class="remove-item-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        </div>
    `).join('');

    const total = validatedCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPrice.textContent = `Ksh ${total.toLocaleString()}`;
}

// ===== UPDATE QUANTITY =====
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// ===== REMOVE FROM CART =====
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

// ===== SAVE CART =====
function saveCart() {
    localStorage.setItem('lighterPooaCart', JSON.stringify(cart));
}

// ===== CART SIDEBAR TOGGLE =====
function toggleCart() {
    cartSidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// ===== CHECKOUT =====
function openCheckout() {
    // Check if user is logged in
    const token = getAuthToken();
    if (!token) {
        showNotification('Please login to checkout');
        toggleCart();
        setTimeout(() => {
            document.getElementById('loginBtn').click();
        }, 500);
        return;
    }

    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    // Close cart sidebar and redirect to checkout page
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');

    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

function closeCheckoutModal() {
    checkoutModal.classList.remove('active');
    overlay.classList.remove('active');
}

// ===== PROCESS CHECKOUT WITH PAYSTACK =====
checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!beginButtonAction(e)) return;
    
    const formData = new FormData(checkoutForm);
    const shippingInfo = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        street: formData.get('street'),
        city: formData.get('city'),
        state: formData.get('state'),
        zipCode: formData.get('zipCode')
    };

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Prepare order data
    const orderData = {
        items: cart.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.images && item.images[0] ? item.images[0] : 'https://via.placeholder.com/150?text=No+Image',
            emoji: item.emoji || '📦'
        })),
        totalAmount: total,
        shippingInfo: shippingInfo
    };

    try {
        // Initialize Paystack payment
        const response = await apiCall(API_ENDPOINTS.initializePayment, {
            method: 'POST',
            body: JSON.stringify({
                email: shippingInfo.email,
                amount: total,
                orderData: orderData
            })
        });

        if (response.success) {
            // Close checkout modal
            closeCheckoutModal();
            
            // Initialize Paystack popup
            const handler = PaystackPop.setup({
                key: PAYSTACK_PUBLIC_KEY,
                email: shippingInfo.email,
                amount: Math.round(total * 100), // Convert to kobo
                currency: 'NGN',
                ref: response.data.reference,
                callback: async function(paystackResponse) {
                    // Payment successful
                    await handlePaymentSuccess(paystackResponse.reference, orderData);
                },
                onClose: function() {
                    showNotification('Payment cancelled', 'error');
                }
            });
            
            handler.openIframe();
        }
    } catch (error) {
        console.error('Payment initialization error:', error);
        showNotification(error.message || 'Payment initialization failed', 'error');
    }
});

// Handle successful payment
async function handlePaymentSuccess(reference, orderData) {
    try {
        // Verify payment
        const verifyResponse = await apiCall(API_ENDPOINTS.verifyPayment(reference));
        
        if (verifyResponse.success && verifyResponse.data.status === 'success') {
            // Create order in database
            const orderResponse = await apiCall(API_ENDPOINTS.createOrder, {
                method: 'POST',
                body: JSON.stringify({
                    ...orderData,
                    paymentReference: reference
                })
            });

            if (orderResponse.success) {
                // Update order payment status
                await apiCall(API_ENDPOINTS.updatePayment(orderResponse.order._id), {
                    method: 'PUT',
                    body: JSON.stringify({
                        status: 'success',
                        paidAt: new Date().toISOString()
                    })
                });

                // Clear cart
                cart = [];
                saveCart();
                updateCartUI();
                
                // Reset form
                checkoutForm.reset();
                
                // Show success message
                showSuccessMessage();
                
                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            }
        } else {
            showNotification('Payment verification failed', 'error');
        }
    } catch (error) {
        console.error('Order creation error:', error);
        showNotification('Failed to create order. Please contact support.', 'error');
    }
}

// ===== SHOW SUCCESS MESSAGE =====
function showSuccessMessage() {
    successMessage.classList.add('active');
    setTimeout(() => {
        successMessage.classList.remove('active');
    }, 3000);
}

// ===== SHOW NOTIFICATION =====
function showNotification(message, type = 'success', showCartButton = false) {
    const notification = document.createElement('div');
    const icon = type === 'error' ? '✗' : '✓';
    const bgColor = type === 'error' ? 'var(--danger-color)' : 'var(--success-color)';
    
    notification.className = 'success-message active';
    notification.style.background = bgColor;
    
    let notificationContent = `
        <div class="success-content">
            <span class="success-icon">${icon}</span>
            <p>${message}</p>
    `;
    
    if (showCartButton && type !== 'error') {
        notificationContent += `
            <button class="notification-cart-btn" onclick="openCartFromNotification()">
                <i class="fas fa-shopping-cart"></i> Proceed to Cart
            </button>
        `;
    }
    
    notificationContent += `
        </div>
    `;
    
    notification.innerHTML = notificationContent;
    document.body.appendChild(notification);
    
    // Adjust timeout if cart button is shown
    const timeout = showCartButton ? 5000 : 3000;
    setTimeout(() => {
        notification.remove();
    }, timeout);
}

// Function to open cart from notification
function openCartFromNotification() {
    // Remove all notifications
    document.querySelectorAll('.success-message').forEach(notif => notif.remove());
    // Open cart
    toggleCart();
}

// ===== SETUP EVENT LISTENERS =====
function setupEventListeners() {
    cartBtn.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    checkoutBtn.addEventListener('click', openCheckout);
    closeCheckout.addEventListener('click', closeCheckoutModal);
    
    overlay.addEventListener('click', () => {
        cartSidebar.classList.remove('active');
        checkoutModal.classList.remove('active');
        overlay.classList.remove('active');
    });

    // Mobile navigation toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Mobile menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }
    if (mobileLogoutBtn) {
        mobileLogoutBtn.addEventListener('click', logout);
    }
    if (mobileCartBtn) {
        mobileCartBtn.addEventListener('click', () => {
            closeMobileMenu();
            toggleCart();
        });
    }

    // Contact form
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Message sent successfully!');
        contactForm.reset();
    });
}

// ===== SMOOTH SCROLL =====
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
                
                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for scroll animations
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
});

// ===== KEYBOARD SHORTCUTS =====
document.addEventListener('keydown', (e) => {
    // ESC to close modals
    if (e.key === 'Escape') {
        cartSidebar.classList.remove('active');
        checkoutModal.classList.remove('active');
        overlay.classList.remove('active');
    }
});

// ===== PREVENT CART SIDEBAR CLOSE ON CLICK INSIDE =====
cartSidebar.addEventListener('click', (e) => {
    e.stopPropagation();
});

checkoutModal.addEventListener('click', (e) => {
    e.stopPropagation();
});

// ===== MOBILE MENU FUNCTIONS =====
function toggleMobileMenu() {
    if (mobileMenuOverlay) {
        mobileMenuOverlay.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
    }
}

function closeMobileMenu() {
    if (mobileMenuOverlay) {
        mobileMenuOverlay.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close mobile menu when clicking on nav links
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('mobile-nav-link')) {
        closeMobileMenu();
    }
});

// ===== AUTH UI MANAGEMENT =====
function updateAuthUI() {
    const token = getAuthToken();
    const user = token ? JSON.parse(localStorage.getItem('lighterPooaUser')) : null;

    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userGreeting = document.getElementById('userGreeting');

    // Mobile elements
    const mobileAuthButtons = document.getElementById('mobileAuthButtons');
    const mobileUserMenu = document.getElementById('mobileUserMenu');
    const mobileUserGreeting = document.getElementById('mobileUserGreeting');

    if (token && user) {
        // User is logged in
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
        if (userGreeting) userGreeting.textContent = `Welcome, ${user.name || 'User'}!`;

        // Mobile
        if (mobileAuthButtons) mobileAuthButtons.style.display = 'none';
        if (mobileUserMenu) mobileUserMenu.style.display = 'flex';
        if (mobileUserGreeting) mobileUserGreeting.textContent = `Welcome, ${user.name || 'User'}!`;
    } else {
        // User is not logged in
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';

        // Mobile
        if (mobileAuthButtons) mobileAuthButtons.style.display = 'flex';
        if (mobileUserMenu) mobileUserMenu.style.display = 'none';
    }
}

// ===== LOGOUT FUNCTION =====
function logout() {
    // Clear stored auth data
    localStorage.removeItem('lighterPooaToken');
    localStorage.removeItem('lighterPooaUser');

    // Update UI
    updateAuthUI();

    // Show notification
    showNotification('Logged out successfully');

    // Redirect to home if on dashboard
    if (window.location.pathname.includes('dashboard.html')) {
        window.location.href = 'index.html';
    }
}

// ===== CAROUSEL FUNCTIONALITY =====
function initializeCarousels() {
    // Arrow navigation
    document.querySelectorAll('.carousel-arrow').forEach(arrow => {
        arrow.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-product-id');
            const direction = e.target.classList.contains('carousel-next') ? 1 : -1;
            navigateCarousel(productId, direction);
        });
    });

    // Indicator navigation
    document.querySelectorAll('.indicator').forEach(indicator => {
        indicator.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-product-id');
            const index = parseInt(e.target.getAttribute('data-index'));
            setCarouselImage(productId, index);
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const activeCarousel = document.querySelector('.image-carousel:focus-within');
            if (activeCarousel) {
                const productId = activeCarousel.getAttribute('data-product-id');
                const direction = e.key === 'ArrowRight' ? 1 : -1;
                navigateCarousel(productId, direction);
                e.preventDefault();
            }
        }
    });

    // Make carousels focusable for keyboard navigation
    document.querySelectorAll('.image-carousel').forEach(carousel => {
        carousel.setAttribute('tabindex', '0');
    });
}

function navigateCarousel(productId, direction) {
    const carousel = document.querySelector(`.image-carousel[data-product-id="${productId}"]`);
    if (!carousel) return;

    const images = carousel.querySelectorAll('.carousel-image');
    const indicators = carousel.querySelectorAll('.indicator');
    let currentIndex = Array.from(images).findIndex(img => img.classList.contains('active'));

    currentIndex = (currentIndex + direction + images.length) % images.length;
    setCarouselImage(productId, currentIndex);
}

function setCarouselImage(productId, index) {
    const carousel = document.querySelector(`.image-carousel[data-product-id="${productId}"]`);
    if (!carousel) return;

    const images = carousel.querySelectorAll('.carousel-image');
    const indicators = carousel.querySelectorAll('.indicator');

    images.forEach((img, i) => {
        img.classList.toggle('active', i === index);
    });

    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === index);
    });
}

// ===== VIDEO PLAYBACK =====
function initializeVideoPlayback() {
    document.querySelectorAll('.play-video-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.closest('.play-video-btn').getAttribute('data-product-id');
            const videoUrl = e.target.closest('.play-video-btn').getAttribute('data-video');
            playProductVideo(productId, videoUrl);
        });
    });
}

function playProductVideo(productId, videoUrl) {
    const carousel = document.querySelector(`.image-carousel[data-product-id="${productId}"]`);
    if (!carousel) return;

    const carouselImages = carousel.querySelector('.carousel-images');
    const imageContainer = carousel.closest('.product-image-container');
    const playBtn = imageContainer.querySelector('.play-video-btn');

    // Hide carousel images and play button
    carouselImages.style.display = 'none';
    playBtn.style.display = 'none';

    // Create video element
    const video = document.createElement('video');
    video.className = 'product-video-inline';
    video.controls = true;
    video.autoplay = true;
    video.muted = true; // Allow autoplay
    video.innerHTML = `<source src="${videoUrl}" type="video/mp4">Your browser does not support the video tag.`;

    // Insert video in place of carousel images
    carousel.insertBefore(video, carouselImages);

    // When video ends, restore carousel images
    video.addEventListener('ended', () => {
        video.remove();
        carouselImages.style.display = 'flex';
        playBtn.style.display = 'block';
    });

    // Optional: Add close button for manual stop
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-video-inline';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
        video.pause();
        video.remove();
        carouselImages.style.display = 'flex';
        playBtn.style.display = 'block';
    });
    carousel.appendChild(closeBtn);
}



