// REGISTER FLOW (Two-Step with OTP)
let registrationData = {};

async function handleSendEmailOTP(e) {
    e.preventDefault();
    const name = document.getElementById('fullName').value;
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value.trim();
    const role = document.getElementById('role') ? document.getElementById('role').value : 'citizen';

    if (!email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }

    registrationData = { name, email, password, phone, role };

    const btn = document.getElementById('btnSendOTP');
    btn.disabled = true;
    btn.innerText = 'Sending...';

    try {
        const res = await fetch(`${API_URL}/send-email-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await res.json();

        if (res.ok) {
            document.getElementById('step1').style.display = 'none';
            document.getElementById('step2').style.display = 'block';
            document.getElementById('displayEmail').innerText = email;
        } else {
            const errorMsg = res.status === 429 ? data.error : (data.error || 'Failed to send email code.');
            alert(errorMsg);
            btn.disabled = false;
            btn.innerText = 'Send Verification Code';
        }
    } catch (err) {
        console.error(err);
        alert('Server error. Please try again later.');
        btn.disabled = false;
        btn.innerText = 'Send Verification Code';
    }
}

async function handleVerifyEmailOTP(e) {
    e.preventDefault();
    const otp = document.getElementById('emailOtp').value;
    if (!otp) return alert('Enter the 6-digit email code.');

    const btn = document.getElementById('btnVerifyEmail');
    btn.disabled = true;
    btn.innerText = 'Verifying & Registering...';

    try {
        const res = await fetch(`${API_URL}/verify-email-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...registrationData, otp })
        });
        const data = await res.json();

        if (res.ok) {
            alert('Registration and Verification successful!');
            window.location.href = 'login.html';
        } else {
            alert(data.error || 'Invalid email code');
            btn.disabled = false;
            btn.innerText = 'Verify Email';
        }
    } catch (err) {
        console.error(err);
        alert('Error during registration.');
        btn.disabled = false;
        btn.innerText = 'Verify Email';
    }
}

function showStep1() {
    document.getElementById('step1').style.display = 'block';
    document.getElementById('step2').style.display = 'none';
}

async function register(e) {
    handleSendEmailOTP(e);
}

// LOGIN
async function login(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
            // --- Standardized Login Storage ---
            // We use browser-independent localStorage keys for academic consistency
            localStorage.setItem('token', data.token);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', data.user.name);
            localStorage.setItem('role', data.user.role.toUpperCase()); // Store as USER or ADMIN
            localStorage.setItem('userEmail', email); // Store email for profile

            // Keep original user object for specialized components if needed
            localStorage.setItem('user', JSON.stringify(data.user));

            // MANDATORY: Always redirect to index.html after login
            // The homeostasis of the app is managed by index.html initialization
            window.location.href = 'index.html';
        } else {
            alert(data.error || 'Invalid credentials');
        }
    } catch (err) {
        console.error('Login Error:', err);
        alert('An error occurred during login. Please try again.');
    }
}
