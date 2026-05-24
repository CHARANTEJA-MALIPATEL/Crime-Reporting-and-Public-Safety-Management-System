// DASHBOARD LOAD
async function loadDashboard() {
    checkAuth();
    const user = getUser();
    if (user.role === 'admin') {
        window.location.href = 'admin.html';
        return;
    }

    document.getElementById('userName').textContent = user.name;
    loadMyReports();
}

// LOAD MY REPORTS (Citizen)
async function loadMyReports() {
    const listElement = document.getElementById('my-reports-list');
    listElement.innerHTML = '<p>Loading...</p>';

    try {
        const res = await fetch(`${API_URL}/reports/my-reports`, { headers: getHeaders() });
        const reports = await res.json();
        renderReports(reports, listElement);
    } catch (err) {
        console.error(err);
        listElement.innerHTML = '<p>Error loading reports.</p>';
    }
}

// RENDER REPORTS
function renderReports(reports, container) {
    container.innerHTML = '';

    if (reports.length === 0) {
        container.innerHTML = '<p>No reports found.</p>';
        return;
    }

    reports.forEach(report => {
        const div = document.createElement('div');
        div.className = 'card';
        div.style.borderLeft = `5px solid ${getStatusColor(report.status)}`;
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
                <div>
                    <h3 style="margin:0; color:#1e3a8a;">${report.title}</h3>
                    <div style="font-size:0.8rem; color:#6b7280; margin-top:0.25rem;">
                        Case ID: <strong>#${report.report_id}</strong> | Reference: ${report.complaint_id}
                    </div>
                </div>
                <span class="badge badge-${report.status}" style="padding: 0.4rem 0.8rem; border-radius: 20px; text-transform: uppercase; font-weight: 700; font-size: 0.7rem;">
                    ${report.status}
                </span>
            </div>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap:1rem; font-size:0.85rem; background:#f8fafc; padding:1rem; border-radius:8px; margin-bottom:1rem;">
                <div><i class="fas fa-tag" style="color:#64748b; width:1.2rem;"></i> <strong>Category:</strong> ${report.crime_type}</div>
                <div><i class="fas fa-map-marker-alt" style="color:#64748b; width:1.2rem;"></i> <strong>Location:</strong> ${report.location}</div>
                <div><i class="fas fa-calendar-alt" style="color:#64748b; width:1.2rem;"></i> <strong>Reported:</strong> ${new Date(report.created_at).toLocaleDateString()}</div>
            </div>
            <p style="color:#4b5563; line-height:1.6; margin-bottom:1.5rem;">${report.description}</p>
            <div style="text-align:right;">
                <button class="btn btn-outline" onclick="viewTracking('${report.complaint_id}')" style="box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <i class="fas fa-search-location"></i> View Full History
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

function getStatusColor(status) {
    switch (status) {
        case 'pending': return '#f59e0b';
        case 'verified': return '#10b981';
        case 'investigation': return '#6366f1';
        case 'resolved': return '#22c55e';
        case 'rejected': return '#ef4444';
        default: return '#94a3b8';
    }
}

async function viewTracking(complaintId) {
    const listElement = document.getElementById('tracking-status');
    listElement.innerHTML = '<p class="loading">Fetching records...</p>';

    try {
        const res = await fetch(`${API_URL}/reports/${complaintId}`, { headers: getHeaders() });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        if (!data.tracking || data.tracking.length === 0) {
            listElement.innerHTML = `
                <div class="tracking-item">
                    <span class="status-time">Present</span>
                    <strong>Status: ${data.report.status.toUpperCase()}</strong>
                    <p>No additional tracking records found yet.</p>
                </div>
            `;
            return;
        }

        listElement.innerHTML = '';
        data.tracking.forEach(item => {
            const div = document.createElement('div');
            div.className = 'tracking-item';
            div.innerHTML = `
                <span class="status-time">${new Date(item.updated_at).toLocaleString()}</span>
                <strong>Status: ${item.status.toUpperCase()}</strong>
                <p>${item.remarks || 'No remarks provided.'}</p>
            `;
            listElement.appendChild(div);
        });
    } catch (err) {
        console.error(err);
        listElement.innerHTML = '<p class="error">Error loading tracking history.</p>';
    }
}
