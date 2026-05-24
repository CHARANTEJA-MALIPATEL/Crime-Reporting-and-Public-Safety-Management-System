const API_URL = 'http://localhost:3000/api';

// Utility: Get Header with Token
function getHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Utility: Check Auth
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
}

// Utility: Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// REGISTER
async function register(e) {
    e.preventDefault();
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;
    const role = document.getElementById('role') ? document.getElementById('role').value : 'citizen';

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password, phone, role })
        });
        const data = await res.json();
        if (res.ok) {
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred');
    }
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
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = 'dashboard.html';
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
        alert('An error occurred');
    }
}

// DASHBOARD LOAD
async function loadDashboard() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return logout();

    const user = JSON.parse(userStr);
    document.getElementById('userName').textContent = user.name;

    if (user.role === 'admin') {
        document.getElementById('citizen-controls').style.display = 'none';
        document.getElementById('admin-controls').style.display = 'block';
        loadAllReports();
    } else {
        document.getElementById('citizen-controls').style.display = 'block';
        document.getElementById('admin-controls').style.display = 'none';
        loadMyReports();
    }
}

// REPORT SUBMISSION
async function submitReport(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('location', document.getElementById('location').value);

    const evidenceFile = document.getElementById('evidence').files[0];
    if (evidenceFile) {
        formData.append('evidence', evidenceFile);
    }

    try {
        const res = await fetch(`${API_URL}/reports/submit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });
        const data = await res.json();
        if (res.ok) {
            alert(`Report Submitted! ID: ${data.reportId}. Predicted Type: ${data.predictedCrimeType}`);
            loadMyReports(); // Refresh list
            e.target.reset(); // Clear form
        } else {
            alert(data.error);
        }
    } catch (err) {
        console.error(err);
        alert('Error submitting report');
    }
}

// LOAD MY REPORTS (Citizen)
async function loadMyReports() {
    try {
        const res = await fetch(`${API_URL}/reports/my-reports`, { headers: getHeaders() });
        const reports = await res.json();
        renderReports(reports, 'my-reports-list');
    } catch (err) {
        console.error(err);
    }
}

// LOAD ALL REPORTS (Admin)
async function loadAllReports() {
    try {
        const res = await fetch(`${API_URL}/reports/all`, { headers: getHeaders() });
        const reports = await res.json();
        renderReports(reports, 'all-reports-list', true);
    } catch (err) {
        console.error(err);
    }
}

// RENDER REPORTS
function renderReports(reports, elementId, isAdmin = false) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';

    reports.forEach(report => {
        const div = document.createElement('div');
        div.className = 'report-card';
        div.innerHTML = `
            <div class="report-header">
                <div>
                    <h3 class="report-title">${report.title}</h3>
                    <div class="report-meta">
                        <span>ID: #${report.report_id}</span>
                        <span>Date: ${new Date(report.created_at).toLocaleDateString()}</span>
                        <span>Location: ${report.location}</span>
                        <span>Type: ${report.crime_type}</span>
                        ${isAdmin ? `<span>Reported By: ${report.reported_by || 'Unknown'}</span>` : ''}
                    </div>
                </div>
                <span class="badge badge-${report.status}">${report.status}</span>
            </div>
            <p>${report.description}</p>
            ${isAdmin ? `
                <div style="margin-top: 1rem;">
                    <form onsubmit="updateStatus(event, ${report.report_id})">
                        <select id="status-${report.report_id}" class="form-control" style="display:inline-block; width:auto;">
                            <option value="pending" ${report.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="verified" ${report.status === 'verified' ? 'selected' : ''}>Verified</option>
                            <option value="investigation" ${report.status === 'investigation' ? 'selected' : ''}>Investigation</option>
                            <option value="resolved" ${report.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                            <option value="rejected" ${report.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                        </select>
                        <input type="text" id="remark-${report.report_id}" placeholder="Add remark..." class="form-control" style="display:inline-block; width:auto;">
                        <button type="submit" class="btn btn-primary">Update</button>
                    </form>
                </div>
            ` : ''}
        `;
        container.appendChild(div);
    });
}

// UPDATE STATUS (Admin)
async function updateStatus(e, reportId) {
    e.preventDefault();
    const status = document.getElementById(`status-${reportId}`).value;
    const remark = document.getElementById(`remark-${reportId}`).value;

    try {
        const res = await fetch(`${API_URL}/reports/update-status`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ reportId, status, remark })
        });
        if (res.ok) {
            alert('Status updated');
            loadAllReports();
        } else {
            alert('Failed to update');
        }
    } catch (err) {
        console.error(err);
    }
}
