// Homepage UI Logic
// Standardized cross-browser initialization
document.addEventListener('DOMContentLoaded', () => {
    // 1. Synchronize Navbar state across all pages
    syncNavbar();

    // 2. Initialize page-specific logic
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    if (currentPage === 'index.html') {
        initHome();
    }
    
    // 3. Initialize mobile menu toggle
    initMobileMenu();
});

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    // Add mobile menu toggle button if not exists
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    
    if (navbar && navLinks && !document.querySelector('.mobile-menu-toggle')) {
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'mobile-menu-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
        toggleBtn.setAttribute('aria-label', 'Toggle navigation menu');
        
        toggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('mobile-active');
            const icon = toggleBtn.querySelector('i');
            if (navLinks.classList.contains('mobile-active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        // Insert before nav-links
        navbar.insertBefore(toggleBtn, navLinks);
    }
}

/**
 * Synchronizes the navbar to show "Login/Register" for guests
 * or "Welcome [User] | [Logout]" for authenticated users.
 */
function syncNavbar() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    const navLinks = document.querySelector('.nav-links');

    if (isLoggedIn && navLinks) {
        // Get current page to set active state
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Build navigation based on role
        let navHTML = '';
        
        if (role === 'ADMIN') {
            navHTML = `
                <a href="admin.html" class="nav-link ${currentPage === 'admin.html' ? 'active' : ''}">
                    <i class="fas fa-tachometer-alt"></i> Dashboard
                </a>
                <a href="index.html#about" class="nav-link"><i class="fas fa-info-circle"></i> About</a>
                <a href="index.html#contact" class="nav-link"><i class="fas fa-phone"></i> Contact</a>
            `;
        } else {
            navHTML = `
                <a href="index.html" class="nav-link ${currentPage === 'index.html' ? 'active' : ''}">
                    <i class="fas fa-home"></i> Home
                </a>
                <a href="report.html" class="nav-link ${currentPage === 'report.html' ? 'active' : ''}">
                    <i class="fas fa-file-alt"></i> Report Crime
                </a>
                <a href="index.html#about" class="nav-link"><i class="fas fa-info-circle"></i> About</a>
                <a href="index.html#contact" class="nav-link"><i class="fas fa-phone"></i> Contact</a>
            `;
        }
        
        navHTML += `
            <span class="user-welcome" style="font-size: 0.9rem; color: #4b5563;">
                <i class="fas fa-user-circle"></i> <strong>${username || 'User'}</strong>
            </span>
            <button onclick="logout()" class="btn btn-outline small">
                <i class="fas fa-sign-out-alt"></i> Logout
            </button>
        `;
        
        navLinks.innerHTML = navHTML;
    }
}

function initHome() {
    // Standardized localStorage keys (Browser-independent)
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('role');

    const dashboardSection = document.getElementById('dashboard-section');

    // --- Home-Specific State Routing Logic ---
    if (isLoggedIn) {
        // Show user profile sidebar for logged-in users
        showUserProfileSidebar();
        
        // Admin Redirect from Home
        if (role === 'ADMIN') {
            console.log('Admin detected, redirecting to admin portal...');
            window.location.href = 'admin.html';
            return;
        }

        // Populate Dashboard for Users but keep it hidden for the "Focus" flow
        if (role === 'USER' && dashboardSection) {
            dashboardSection.style.display = 'none'; // Ensure hidden on load
            if (typeof loadMyReports === 'function') {
                loadMyReports();
            }
        }
    } else {
        // Guest State: Ensure dashboard is hidden if not logged in
        if (dashboardSection) dashboardSection.style.display = 'none';
        hideUserProfileSidebar();
    }
}

/**
 * Show and populate user profile sidebar
 */
function showUserProfileSidebar() {
    const sidebar = document.getElementById('user-profile-sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebar) {
        sidebar.style.display = 'block';
        if (mainContent) {
            mainContent.classList.add('with-sidebar');
        }
        
        // Load user profile data
        loadUserProfile();
        
        // Load recent cases
        loadRecentCases();
    }
}

/**
 * Hide user profile sidebar
 */
function hideUserProfileSidebar() {
    const sidebar = document.getElementById('user-profile-sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (sidebar) {
        sidebar.style.display = 'none';
        if (mainContent) {
            mainContent.classList.remove('with-sidebar');
        }
    }
}

/**
 * Load user profile data from API
 */
async function loadUserProfile() {
    try {
        // Fetch user profile from API
        const res = await fetch(`${API_URL}/users/profile`, { 
            headers: getHeaders() 
        });
        
        if (!res.ok) {
            throw new Error('Failed to fetch profile');
        }
        
        const userData = await res.json();
        
        // Update profile header
        document.getElementById('profileName').textContent = userData.name || 'User';
        document.getElementById('profileEmail').textContent = userData.email || 'No email';
        document.getElementById('profileRole').textContent = userData.role.toUpperCase();
        
        // Update profile details
        document.getElementById('detailName').textContent = userData.name || 'User';
        document.getElementById('detailEmail').textContent = userData.email || 'No email';
        document.getElementById('detailPhone').textContent = userData.phone || 'Not provided';
        
        // Format the join date
        const joinDate = userData.created_at ? new Date(userData.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : 'Unknown';
        document.getElementById('detailJoined').textContent = joinDate;
        
        // Store in localStorage for quick access
        localStorage.setItem('userEmail', userData.email);
        localStorage.setItem('userPhone', userData.phone || 'Not provided');
        
    } catch (err) {
        console.error('Error loading user profile:', err);
        
        // Fallback to localStorage data
        const username = localStorage.getItem('username');
        const email = localStorage.getItem('userEmail') || 'user@example.com';
        const phone = localStorage.getItem('userPhone') || 'Not provided';
        const role = localStorage.getItem('role') || 'USER';
        
        document.getElementById('profileName').textContent = username || 'User';
        document.getElementById('profileEmail').textContent = email;
        document.getElementById('profileRole').textContent = role;
        
        document.getElementById('detailName').textContent = username || 'User';
        document.getElementById('detailEmail').textContent = email;
        document.getElementById('detailPhone').textContent = phone;
        document.getElementById('detailJoined').textContent = new Date().toLocaleDateString();
    }
}

/**
 * Toggle profile details visibility
 */
function toggleProfileDetails() {
    const details = document.getElementById('profileDetails');
    const toggleBtn = document.querySelector('.profile-toggle-btn');
    const icon = document.getElementById('toggleIcon');
    
    if (details.style.display === 'none') {
        details.style.display = 'block';
        toggleBtn.classList.add('active');
    } else {
        details.style.display = 'none';
        toggleBtn.classList.remove('active');
    }
}

/**
 * Load recent 3 cases
 */
async function loadRecentCases() {
    const casesList = document.getElementById('recentCasesList');
    
    if (!casesList) {
        console.error('recentCasesList element not found');
        return;
    }
    
    casesList.innerHTML = '<p class="loading-text"><i class="fas fa-spinner fa-spin"></i> Loading...</p>';
    
    try {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('No token found - user not logged in');
            casesList.innerHTML = `
                <div class="no-cases-text">
                    <i class="fas fa-sign-in-alt"></i>
                    <p>Please log in to view cases</p>
                </div>
            `;
            return;
        }
        
        console.log('Fetching reports from:', `${API_URL}/reports/my-reports`);
        const res = await fetch(`${API_URL}/reports/my-reports`, { headers: getHeaders() });
        
        console.log('Response status:', res.status);
        
        if (!res.ok) {
            if (res.status === 401 || res.status === 403) {
                console.error('Authentication failed - token may be invalid');
                casesList.innerHTML = `
                    <div class="no-cases-text">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Session expired. Please log in again.</p>
                    </div>
                `;
                return;
            }
            throw new Error(`Server returned ${res.status}: ${res.statusText}`);
        }
        
        const reports = await res.json();
        console.log('Loaded reports:', reports.length);
        
        if (reports.length === 0) {
            casesList.innerHTML = `
                <div class="no-cases-text">
                    <i class="fas fa-inbox"></i>
                    <p>No cases reported yet</p>
                </div>
            `;
            return;
        }
        
        // Get last 3 cases
        const recentCases = reports.slice(0, 3);
        
        casesList.innerHTML = '';
        recentCases.forEach(report => {
            const caseCard = document.createElement('div');
            caseCard.className = 'case-card';
            caseCard.style.borderLeftColor = getStatusColor(report.status);
            caseCard.onclick = () => handleCheckStatus();
            
            caseCard.innerHTML = `
                <div class="case-card-header">
                    <h5 class="case-card-title">${report.title}</h5>
                    <span class="case-card-status badge-${report.status}">${report.status}</span>
                </div>
                <div class="case-card-info">
                    <span><i class="fas fa-hashtag"></i> #${report.complaint_id || report.report_id}</span>
                    <span><i class="fas fa-tag"></i> ${report.crime_type || 'Unclassified'}</span>
                    <span><i class="fas fa-calendar"></i> ${new Date(report.created_at).toLocaleDateString()}</span>
                </div>
            `;
            
            casesList.appendChild(caseCard);
        });
        
        console.log('Successfully loaded and displayed recent cases');
        
    } catch (err) {
        console.error('Error loading recent cases:', err);
        casesList.innerHTML = `
            <p class="loading-text" style="color: #ef4444;">
                <i class="fas fa-exclamation-triangle"></i><br>
                ${err.message || 'Error loading cases'}<br>
                <small style="font-size: 0.75rem;">Check console for details</small>
            </p>
        `;
    }
}

/**
 * Open edit profile modal/page
 */
function openEditProfile() {
    alert('Edit Profile feature coming soon!\n\nYou will be able to update:\n- Name\n- Email\n- Phone\n- Password');
    // TODO: Implement edit profile functionality
}

/**
 * Toggle mobile sidebar
 */
function toggleMobileSidebar() {
    const sidebar = document.getElementById('user-profile-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('mobile-active');
    }
}

/**
 * Helper function to get status color
 */
function getStatusColor(status) {
    const colors = {
        'pending': '#f59e0b',
        'verified': '#10b981',
        'investigation': '#6366f1',
        'resolved': '#22c55e',
        'rejected': '#ef4444'
    };
    return colors[status] || '#94a3b8';
}

/**
 * Handles the "Check Case Status" card click.
 * Restructured for "Fixed Overlay" experience (Static, no scroll).
 */
function handleCheckStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const dashboardSection = document.getElementById('dashboard-section');
    const overlay = document.getElementById('dashboard-overlay');

    if (!isLoggedIn) {
        window.location.href = 'login.html';
    } else if (dashboardSection && overlay) {
        // 1. Lock scrolling on body
        document.body.style.overflow = 'hidden';

        // 2. Clear any existing display: none from inline styles
        dashboardSection.style.display = 'block';

        // 3. Trigger Data Load (Explicit refresh for fresh data)
        if (typeof loadMyReports === 'function') {
            loadMyReports();
        }

        // 4. Show Overlay & Focus Dashboard
        overlay.classList.add('active');

        // Use a tiny timeout for transition effects
        setTimeout(() => {
            dashboardSection.classList.add('focused');
        }, 50);
    }
}

/**
 * Exits the focused dashboard view and restores the main page.
 */
function exitDashboardFocus() {
    const dashboardSection = document.getElementById('dashboard-section');
    const overlay = document.getElementById('dashboard-overlay');

    if (dashboardSection && overlay) {
        // 1. Remove Focus & Blur
        dashboardSection.classList.remove('focused');
        overlay.classList.remove('active');

        // 2. Unlock scrolling
        document.body.style.overflow = 'auto';

        // 3. Hide after transition
        setTimeout(() => {
            dashboardSection.style.display = 'none';
        }, 400);
    }
}

function toggleSidebar() {
    // This function is now deprecated for index.html but kept for compatibility with other pages if needed
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}
