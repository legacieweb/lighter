// ============================================
// AUTHENTICATION SYSTEM - LIGHTER POOA
// Handles login, signup, and user session management
// ============================================

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔐 Authentication system initialized');
    checkAuthStatus();
    registerAuthTriggers();
});

// ============================================
// AUTHENTICATION STATUS CHECK
// ============================================
async function checkAuthStatus() {
    const token = getAuthToken();
    
    if (token) {
        try {
            console.log('🔍 Checking authentication status...');
            const response = await apiCall(API_ENDPOINTS.getUser);
            
            if (response && response.success) {
                console.log('✅ User authenticated:', response.user.email);
                updateUIForLoggedInUser(response.user);
            } else {
                console.log('⚠️ Invalid token, logging out');
                logout();
            }
        } catch (error) {
            console.error('❌ Auth check failed:', error.message);
            logout();
        }
    } else {
        updateUIForLoggedOutUser();
    }
}

// ============================================
// UI UPDATE FUNCTIONS
// ============================================
function updateUIForLoggedInUser(user) {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    
    if (authButtons) authButtons.style.display = 'none';
    if (userMenu) userMenu.style.display = 'flex';
    
    // Store user data
    localStorage.setItem('lighterPooaUser', JSON.stringify(user));
    console.log('✅ UI updated for logged in user');
}

function updateUIForLoggedOutUser() {
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    
    if (authButtons) authButtons.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';
    
    console.log('✅ UI updated for logged out user');
}

// ============================================
// MODAL MANAGEMENT
// ============================================
function getAuthModalElements() {
    const modal = document.getElementById('loginModal');
    if (!modal) return null;

    return {
        modal,
        overlay: document.getElementById('overlay'),
        tabs: modal.querySelectorAll('.auth-form'),
        tabButtons: modal.querySelectorAll('.auth-tab'),
    };
}

function openAuthModal(targetTab = 'login') {
    const elements = getAuthModalElements();
    if (!elements) return;

    const { modal, overlay } = elements;
    setActiveAuthTab(targetTab);

    modal.classList.add('active');
    overlay?.classList.add('active');

    requestAnimationFrame(() => {
        modal.classList.add('show');
    });

    const focusSelector = targetTab === 'login' ? '#loginForm input' : '#signupForm input';
    modal.querySelector(focusSelector)?.focus();
}

function setActiveAuthTab(targetTab) {
    const elements = getAuthModalElements();
    if (!elements) return;

    const { tabs, tabButtons } = elements;

    tabs.forEach(tab => {
        const isTarget = tab.id === `${targetTab}Form`;
        tab.classList.toggle('visible', isTarget);
    });

    tabButtons.forEach(button => {
        const isTarget = button.dataset.target === targetTab;
        button.classList.toggle('active', isTarget);
    });
}

// ============================================
// HERO AUTH FORM MANAGEMENT
// ============================================
function setActiveHeroAuthForm(targetForm) {
    const forms = document.querySelectorAll('.hero-auth-form');
    const buttons = document.querySelectorAll('.auth-toggle-btn');

    forms.forEach(form => {
        const isTarget = form.id === `hero${targetForm.charAt(0).toUpperCase() + targetForm.slice(1)}Form`;
        form.classList.toggle('visible', isTarget);
    });

    buttons.forEach(button => {
        const isTarget = button.dataset.form === targetForm;
        button.classList.toggle('active', isTarget);
    });
}

function closeAuthModal() {
    const elements = getAuthModalElements();
    if (!elements) return;

    const { modal, overlay } = elements;

    modal.classList.remove('show');
    setTimeout(() => {
        modal.classList.remove('active');

        const openModals = document.querySelectorAll('.modal.active');
        if (openModals.length === 0) {
            overlay?.classList.remove('active');
        }
    }, 220);
}

// ============================================
// EVENT LISTENERS REGISTRATION
// ============================================
function registerAuthTriggers() {
    // Modal auth buttons (legacy)
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const inlineLinks = document.querySelectorAll('[data-trigger]');

    loginBtn?.addEventListener('click', () => openAuthModal('login'));
    signupBtn?.addEventListener('click', () => openAuthModal('signup'));

    inlineLinks.forEach(link => {
        const triggerType = link.dataset.trigger;
        if (!triggerType) return;

        link.addEventListener('click', event => {
            const target = link.dataset.target || 'login';
            if (triggerType.startsWith('open-')) {
                event.preventDefault();
                const tabToOpen = triggerType.replace('open-', '') || target;
                openAuthModal(tabToOpen);
            } else if (triggerType === 'switch-tab') {
                event.preventDefault();
                setActiveAuthTab(target);
            }
        });
    });

    const authTabs = document.querySelectorAll('.auth-tab');
    authTabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            const target = tab.dataset.target || 'login';
            setActiveAuthTab(target);
        });
    });

    const closeLogin = document.getElementById('closeLogin');
    const closeSignup = document.getElementById('closeSignup');
    closeLogin?.addEventListener('click', closeAuthModal);
    closeSignup?.addEventListener('click', closeAuthModal);

    const overlayElement = document.getElementById('overlay');
    overlayElement?.addEventListener('click', closeAuthModal);

    // Hero auth toggle buttons
    const authToggleBtns = document.querySelectorAll('.auth-toggle-btn');
    authToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetForm = btn.dataset.form;
            setActiveHeroAuthForm(targetForm);
        });
    });

    // Hero auth toggle links
    const authToggleLinks = document.querySelectorAll('[data-toggle]');
    authToggleLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetForm = link.dataset.toggle;
            setActiveHeroAuthForm(targetForm);
        });
    });
}

// ============================================
// DASHBOARD BUTTON HANDLER
// ============================================
const dashboardBtn = document.getElementById('dashboardBtn');
if (dashboardBtn) {
    dashboardBtn.addEventListener('click', () => {
        const user = JSON.parse(localStorage.getItem('lighterPooaUser'));
        if (user && user.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    });
}

// ============================================
// LOGOUT BUTTON HANDLER
// ============================================
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}

// ============================================
// LOGIN FORM HANDLER
// ============================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = e.submitter || loginForm.querySelector('[type="submit"]');
        if (!beginButtonAction(submitButton)) return;

        const formData = new FormData(loginForm);
        const email = formData.get('email')?.trim();
        const password = formData.get('password');
        const rememberMe = document.getElementById('rememberMe')?.checked || false;

        // Validation
        if (!email || !password) {
            showNotification('Please enter both email and password', 'error');
            endButtonAction(submitButton);
            shakeForm(loginForm);
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            endButtonAction(submitButton);
            highlightFormErrors(loginForm, ['email']);
            shakeForm(loginForm);
            return;
        }

        setLoadingState(loginForm, true);

        try {
            console.log('🔐 Attempting login...');
            console.log('📧 Email:', email);
            console.log('📍 API Endpoint:', API_ENDPOINTS.login);
            
            const response = await fetch(API_ENDPOINTS.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, rememberMe })
            });

            console.log('📡 Response status:', response.status);

            const data = await response.json();
            console.log('📦 Response data:', data);

            if (response.ok && data.success) {
                // Store authentication data
                localStorage.setItem('lighterPooaToken', data.token);
                localStorage.setItem('lighterPooaUser', JSON.stringify(data.user));
                
                console.log('✅ Login successful!');
                console.log('👤 User:', data.user.name, '(' + data.user.email + ')');
                console.log('🎭 Role:', data.user.role);
                
                showNotification('Login successful! Redirecting...', 'success');
                closeAuthModal();
                updateUIForLoggedInUser(data.user);
                
                // Redirect based on user role
                setTimeout(() => {
                    if (data.user.role === 'admin') {
                        console.log('🚀 Redirecting to admin dashboard...');
                        window.location.href = 'admin.html';
                    } else {
                        console.log('🚀 Redirecting to user dashboard...');
                        window.location.href = 'dashboard.html';
                    }
                }, 1000);
            } else {
                // Handle error response
                const errorMessage = data.message || 'Login failed. Please check your credentials.';
                console.error('❌ Login failed:', errorMessage);
                showNotification(errorMessage, 'error');
                highlightFormErrors(loginForm, ['email', 'password']);
                shakeForm(loginForm);
            }
        } catch (error) {
            console.error('❌ Login error:', error);
            
            // Check if it's a network error
            if (error.message.includes('fetch') || error.message.includes('network')) {
                showNotification('Cannot connect to server. Please make sure the server is running.', 'error');
            } else {
                showNotification('Login failed. Please try again.', 'error');
            }
            
            highlightFormErrors(loginForm, ['email', 'password']);
            shakeForm(loginForm);
        } finally {
            setLoadingState(loginForm, false);
            endButtonAction(submitButton);
        }
    });
}

// ============================================
// SIGNUP FORM HANDLER
// ============================================
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = e.submitter || signupForm.querySelector('[type="submit"]');
        if (!beginButtonAction(submitButton)) return;
        
        const formData = new FormData(signupForm);
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            showNotification('Please fill in all fields', 'error');
            endButtonAction(submitButton);
            shakeForm(signupForm);
            return;
        }

        if (name.length < 2) {
            showNotification('Name must be at least 2 characters', 'error');
            endButtonAction(submitButton);
            highlightFormErrors(signupForm, ['name']);
            shakeForm(signupForm);
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            endButtonAction(submitButton);
            highlightFormErrors(signupForm, ['email']);
            shakeForm(signupForm);
            return;
        }

        if (password.length < 6) {
            showNotification('Password must be at least 6 characters', 'error');
            endButtonAction(submitButton);
            highlightFormErrors(signupForm, ['password']);
            shakeForm(signupForm);
            return;
        }

        if (password !== confirmPassword) {
            showNotification('Passwords do not match', 'error');
            endButtonAction(submitButton);
            highlightFormErrors(signupForm, ['password', 'confirmPassword']);
            shakeForm(signupForm);
            return;
        }

        setLoadingState(signupForm, true);

        try {
            console.log('📝 Attempting registration...');
            console.log('👤 Name:', name);
            console.log('📧 Email:', email);
            console.log('📍 API Endpoint:', API_ENDPOINTS.register);
            
            const response = await fetch(API_ENDPOINTS.register, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            console.log('📡 Response status:', response.status);

            const data = await response.json();
            console.log('📦 Response data:', data);

            if (response.ok && data.success) {
                // Store authentication data
                localStorage.setItem('lighterPooaToken', data.token);
                localStorage.setItem('lighterPooaUser', JSON.stringify(data.user));
                
                console.log('✅ Registration successful!');
                console.log('👤 User:', data.user.name, '(' + data.user.email + ')');
                console.log('🎭 Role:', data.user.role);
                
                showNotification('Registration successful! Redirecting...', 'success');
                closeAuthModal();
                updateUIForLoggedInUser(data.user);
                
                // Redirect based on user role
                setTimeout(() => {
                    if (data.user.role === 'admin') {
                        console.log('🚀 Redirecting to admin dashboard...');
                        window.location.href = 'admin.html';
                    } else {
                        console.log('🚀 Redirecting to user dashboard...');
                        window.location.href = 'dashboard.html';
                    }
                }, 1000);
            } else {
                // Handle error response
                const errorMessage = data.message || 'Registration failed. Please try again.';
                console.error('❌ Registration failed:', errorMessage);
                showNotification(errorMessage, 'error');
                
                // Highlight email field if it's a duplicate email error
                if (errorMessage.toLowerCase().includes('email')) {
                    highlightFormErrors(signupForm, ['email']);
                }
                
                shakeForm(signupForm);
            }
        } catch (error) {
            console.error('❌ Registration error:', error);
            
            // Check if it's a network error
            if (error.message.includes('fetch') || error.message.includes('network')) {
                showNotification('Cannot connect to server. Please make sure the server is running.', 'error');
            } else {
                showNotification('Registration failed. Please try again.', 'error');
            }
            
            shakeForm(signupForm);
        } finally {
            setLoadingState(signupForm, false);
            endButtonAction(submitButton);
        }
    });
}

// ============================================
// SWITCH BETWEEN LOGIN AND SIGNUP
// ============================================
const switchToSignup = document.getElementById('switchToSignup');
if (switchToSignup) {
    switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveAuthTab('signup');
    });
}

const switchToLogin = document.getElementById('switchToLogin');
if (switchToLogin) {
    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveAuthTab('login');
    });
}

// ============================================
// HERO LOGIN FORM HANDLER
// ============================================
const heroLoginForm = document.getElementById('heroLoginForm');
if (heroLoginForm) {
    heroLoginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = e.submitter || heroLoginForm.querySelector('[type="submit"]');
        if (!beginButtonAction(submitButton)) return;

        const formData = new FormData(heroLoginForm);
        const email = formData.get('email')?.trim();
        const password = formData.get('password');

        // Validation
        if (!email || !password) {
            showNotification('Please enter both email and password', 'error');
            endButtonAction(submitButton);
            shakeForm(heroLoginForm);
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            endButtonAction(submitButton);
            highlightFormErrors(heroLoginForm, ['email']);
            shakeForm(heroLoginForm);
            return;
        }

        setLoadingState(heroLoginForm, true);

        try {
            console.log('🔐 Attempting hero login...');
            const response = await fetch(API_ENDPOINTS.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('lighterPooaToken', data.token);
                localStorage.setItem('lighterPooaUser', JSON.stringify(data.user));

                console.log('✅ Hero login successful!');
                showNotification('Login successful! Redirecting...', 'success');
                updateUIForLoggedInUser(data.user);

                setTimeout(() => {
                    if (data.user.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'dashboard.html';
                    }
                }, 1000);
            } else {
                const errorMessage = data.message || 'Login failed. Please check your credentials.';
                console.error('❌ Hero login failed:', errorMessage);
                showNotification(errorMessage, 'error');
                highlightFormErrors(heroLoginForm, ['email', 'password']);
                shakeForm(heroLoginForm);
            }
        } catch (error) {
            console.error('❌ Hero login error:', error);
            if (error.message.includes('fetch') || error.message.includes('network')) {
                showNotification('Cannot connect to server. Please make sure the server is running.', 'error');
            } else {
                showNotification('Login failed. Please try again.', 'error');
            }
            highlightFormErrors(heroLoginForm, ['email', 'password']);
            shakeForm(heroLoginForm);
        } finally {
            setLoadingState(heroLoginForm, false);
            endButtonAction(submitButton);
        }
    });
}

// ============================================
// HERO SIGNUP FORM HANDLER
// ============================================
const heroSignupForm = document.getElementById('heroSignupForm');
if (heroSignupForm) {
    heroSignupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitButton = e.submitter || heroSignupForm.querySelector('[type="submit"]');
        if (!beginButtonAction(submitButton)) return;

        const formData = new FormData(heroSignupForm);
        const name = formData.get('name')?.trim();
        const email = formData.get('email')?.trim();
        const password = formData.get('password');

        // Validation
        if (!name || !email || !password) {
            showNotification('Please fill in all fields', 'error');
            endButtonAction(submitButton);
            shakeForm(heroSignupForm);
            return;
        }

        if (name.length < 2) {
            showNotification('Name must be at least 2 characters', 'error');
            endButtonAction(submitButton);
            highlightFormErrors(heroSignupForm, ['name']);
            shakeForm(heroSignupForm);
            return;
        }

        if (!isValidEmail(email)) {
            showNotification('Please enter a valid email address', 'error');
            endButtonAction(submitButton);
            highlightFormErrors(heroSignupForm, ['email']);
            shakeForm(heroSignupForm);
            return;
        }

        if (password.length < 6) {
            showNotification('Password must be at least 6 characters', 'error');
            endButtonAction(submitButton);
            highlightFormErrors(heroSignupForm, ['password']);
            shakeForm(heroSignupForm);
            return;
        }

        setLoadingState(heroSignupForm, true);

        try {
            console.log('📝 Attempting hero registration...');
            const response = await fetch(API_ENDPOINTS.register, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('lighterPooaToken', data.token);
                localStorage.setItem('lighterPooaUser', JSON.stringify(data.user));

                console.log('✅ Hero registration successful!');
                showNotification('Registration successful! Redirecting...', 'success');
                updateUIForLoggedInUser(data.user);

                setTimeout(() => {
                    if (data.user.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'dashboard.html';
                    }
                }, 1000);
            } else {
                const errorMessage = data.message || 'Registration failed. Please try again.';
                console.error('❌ Hero registration failed:', errorMessage);
                showNotification(errorMessage, 'error');

                if (errorMessage.toLowerCase().includes('email')) {
                    highlightFormErrors(heroSignupForm, ['email']);
                }

                shakeForm(heroSignupForm);
            }
        } catch (error) {
            console.error('❌ Hero registration error:', error);
            if (error.message.includes('fetch') || error.message.includes('network')) {
                showNotification('Cannot connect to server. Please make sure the server is running.', 'error');
            } else {
                showNotification('Registration failed. Please try again.', 'error');
            }
            shakeForm(heroSignupForm);
        } finally {
            setLoadingState(heroSignupForm, false);
            endButtonAction(submitButton);
        }
    });
}

// ============================================
// BUTTON LOADING STATE MANAGEMENT
// ============================================
function beginButtonAction(eventOrButton) {
    const trigger = eventOrButton?.target || eventOrButton;
    const button = trigger instanceof HTMLButtonElement
        ? trigger
        : trigger?.closest('button, [type="submit"], .btn, .btn-auth, .add-to-cart-btn, .quantity-btn, .remove-item-btn, .cart-btn');

    if (!button || button.dataset.busy === 'true') {
        return false;
    }

    if (!window.loadingButtons) {
        window.loadingButtons = new WeakSet();
    }

    if (!window.loadingButtons.has(button)) {
        window.loadingButtons.add(button);
    }

    button.dataset.busy = 'true';

    if (!button.dataset.originalText) {
        button.dataset.originalText = button.innerHTML;
    }

    button.classList.add('is-loading');
    button.innerHTML = '<span class="spinner"></span>';

    return true;
}

function endButtonAction(eventOrButton, delay = 400) {
    const trigger = eventOrButton?.target || eventOrButton;
    const button = trigger instanceof HTMLButtonElement
        ? trigger
        : trigger?.closest('button, [type="submit"], .btn, .btn-auth, .add-to-cart-btn, .quantity-btn, .remove-item-btn, .cart-btn');

    if (!button) return;

    const resetButton = () => {
        button.dataset.busy = 'false';
        button.classList.remove('is-loading');
        if (button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
        }
    };

    if (delay > 0) {
        setTimeout(resetButton, delay);
    } else {
        resetButton();
    }
}

// ============================================
// LOGOUT FUNCTION
// ============================================
function logout() {
    console.log('🚪 Logging out...');
    localStorage.removeItem('lighterPooaToken');
    localStorage.removeItem('lighterPooaUser');
    updateUIForLoggedOutUser();
    showNotification('Logged out successfully');
    
    if (window.location.pathname.includes('dashboard') || window.location.pathname.includes('admin')) {
        window.location.href = 'index.html';
    }
}

// ============================================
// VALIDATION HELPERS
// ============================================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============================================
// MODAL HELPER FUNCTIONS
// ============================================
function openModal(modalId) {
    if (modalId === 'loginModal') {
        openAuthModal('login');
        return;
    }

    const modal = document.getElementById(modalId);
    const overlayElement = document.getElementById('overlay');
    
    if (modal) {
        modal.classList.add('active');
        overlayElement.classList.add('active');
        requestAnimationFrame(() => modal.classList.add('show'));
    }
}

function closeModal(modalId) {
    if (modalId === 'loginModal') {
        closeAuthModal();
        return;
    }

    const modal = document.getElementById(modalId);
    const overlayElement = document.getElementById('overlay');
    
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.classList.remove('active');
            const openModals = document.querySelectorAll('.modal.active');
            if (openModals.length === 0) {
                overlayElement.classList.remove('active');
            }
        }, 220);
    }
}

// ============================================
// FORM STATE HELPERS
// ============================================
function setLoadingState(form, isLoading) {
    const inputs = form.querySelectorAll('input, button, select, textarea');
    inputs.forEach(input => {
        input.disabled = isLoading;
    });
}

function highlightFormErrors(form, fieldNames) {
    // Remove existing error highlights
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    
    // Add error highlights to specified fields
    fieldNames.forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.classList.add('error');
            setTimeout(() => field.classList.remove('error'), 3000);
        }
    });
}

function shakeForm(form) {
    form.classList.add('shake');
    setTimeout(() => form.classList.remove('shake'), 500);
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type = 'success') {
    console.log(`📢 Notification (${type}):`, message);
    
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 10);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}