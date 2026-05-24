// ADMIN DASHBOARD LOAD
let allReportsData = []; // Store all reports for filtering

async function loadAdminDashboard() {
    // --- Guard Clause: Check for Administrative Role ---
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    if (!isLoggedIn || role !== 'ADMIN') {
        console.warn('Unauthorized access attempt to Admin Portal.');
        window.location.href = 'index.html';
        return;
    }

    // Set Welcome Name in Navbar
    var nameEl = document.getElementById('userName');
    if (nameEl) {
        nameEl.textContent = username || 'Officer';
    }

    loadAllReports();
}

// Helper: Get color for crime type
function getCrimeTypeColor(crimeType) {
    const colors = {
        'Theft': '#f59e0b',
        'Burglary': '#ef4444',
        'Robbery': '#dc2626',
        'Assault': '#b91c1c',
        'Harassment': '#ea580c',
        'Cybercrime': '#8b5cf6',
        'Fraud': '#ec4899',
        'Vandalism': '#f97316',
        'Drug-related': '#84cc16',
        'Domestic Violence': '#dc2626',
        'Sexual Offense': '#991b1b',
        'Murder/Homicide': '#7f1d1d',
        'Kidnapping': '#9f1239',
        'Arson': '#c2410c',
        'Traffic Violation': '#0891b2',
        'Public Disturbance': '#0d9488',
        'Trespassing': '#059669',
        'Other': '#6b7280',
        'Unclassified': '#9ca3af'
    };
    return colors[crimeType] || '#6b7280';
}

// Helper: Get icon for crime type
function getCrimeTypeIcon(crimeType) {
    const icons = {
        'Theft': 'fas fa-hand-holding',
        'Burglary': 'fas fa-door-open',
        'Robbery': 'fas fa-mask',
        'Assault': 'fas fa-fist-raised',
        'Harassment': 'fas fa-user-slash',
        'Cybercrime': 'fas fa-laptop-code',
        'Fraud': 'fas fa-credit-card',
        'Vandalism': 'fas fa-spray-can',
        'Drug-related': 'fas fa-pills',
        'Domestic Violence': 'fas fa-home',
        'Sexual Offense': 'fas fa-exclamation-triangle',
        'Murder/Homicide': 'fas fa-skull-crossbones',
        'Kidnapping': 'fas fa-user-lock',
        'Arson': 'fas fa-fire',
        'Traffic Violation': 'fas fa-car-crash',
        'Public Disturbance': 'fas fa-bullhorn',
        'Trespassing': 'fas fa-ban',
        'Other': 'fas fa-question-circle',
        'Unclassified': 'fas fa-question'
    };
    return icons[crimeType] || 'fas fa-file-alt';
}

// LOAD ALL REPORTS
async function loadAllReports() {
    const listElement = document.getElementById('all-reports-list');
    listElement.innerHTML = '<p style="text-align: center; padding: 2rem;">Loading reports...</p>';

    try {
        const res = await fetch(`${API_URL}/reports/all`, { headers: getHeaders() });
        
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const reports = await res.json();
        console.log('Reports loaded:', reports.length);
        console.log('Sample report data:', reports[0]); // Debug: show first report structure
        
        // Store all reports globally for filtering
        allReportsData = reports;
        
        // Populate category filter dropdown
        populateCategoryFilter(reports);
        
        // Render all reports initially
        renderAdminReports(reports, listElement);
        
        // Update filter stats
        updateFilterStats(reports, reports);
    } catch (err) {
        console.error('Error loading reports:', err);
        listElement.innerHTML = '<p style="text-align: center; color: #ef4444; padding: 2rem;">Error loading reports. Please check console for details.</p>';
    }
}

// POPULATE CATEGORY FILTER
function populateCategoryFilter(reports) {
    const categorySelect = document.getElementById('filterCategory');
    if (!categorySelect) return;
    
    // Get unique categories
    const categories = new Set();
    reports.forEach(report => {
        const crimeType = report.crime_type || report.ml_predicted_type || 'Unclassified';
        categories.add(crimeType);
    });
    
    // Clear existing options except first one
    categorySelect.innerHTML = '<option value="">Filter by Category: All</option>';
    
    // Add category options sorted alphabetically
    Array.from(categories).sort().forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// APPLY FILTERS
function applyFilters() {
    const statusFilter = document.getElementById('filterStatus').value;
    const categoryFilter = document.getElementById('filterCategory').value;
    
    let filteredReports = allReportsData;
    
    // Apply status filter
    if (statusFilter) {
        filteredReports = filteredReports.filter(report => report.status === statusFilter);
    }
    
    // Apply category filter
    if (categoryFilter) {
        filteredReports = filteredReports.filter(report => {
            const crimeType = report.crime_type || report.ml_predicted_type || 'Unclassified';
            return crimeType === categoryFilter;
        });
    }
    
    // Render filtered reports
    const listElement = document.getElementById('all-reports-list');
    renderAdminReports(filteredReports, listElement);
    
    // Update filter stats
    updateFilterStats(filteredReports, allReportsData);
}

// CLEAR FILTERS
function clearFilters() {
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterCategory').value = '';
    applyFilters();
}

// UPDATE FILTER STATS
function updateFilterStats(filteredReports, allReports) {
    const statsElement = document.getElementById('filterStats');
    if (!statsElement) return;
    
    const statusFilter = document.getElementById('filterStatus').value;
    const categoryFilter = document.getElementById('filterCategory').value;
    
    if (!statusFilter && !categoryFilter) {
        statsElement.innerHTML = `<i class="fas fa-info-circle"></i> Showing all ${allReports.length} reports`;
    } else {
        const filters = [];
        if (statusFilter) filters.push(`Status: <strong>${statusFilter}</strong>`);
        if (categoryFilter) filters.push(`Category: <strong>${categoryFilter}</strong>`);
        
        statsElement.innerHTML = `
            <i class="fas fa-filter"></i> 
            Showing ${filteredReports.length} of ${allReports.length} reports 
            (Filtered by ${filters.join(' and ')})
        `;
    }
}

// RENDER ADMIN RESULTS
function renderAdminReports(reports, container) {
    container.innerHTML = '';

    if (!reports || reports.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No reports found.</p>';
        return;
    }

    reports.forEach(report => {
        // Debug: Log evidence data for each report
        if (report.evidence_files) {
            console.log(`Report ${report.complaint_id} has evidence:`, report.evidence_files);
        }
        
        // Get crime type with fallback
        const crimeType = report.crime_type || report.ml_predicted_type || 'Unclassified';
        const crimeTypeColor = getCrimeTypeColor(crimeType);
        const crimeTypeIcon = getCrimeTypeIcon(crimeType);
        
        // User contact information
        const userEmail = report.user_email || 'Not provided';
        const userPhone = report.user_phone || 'Not provided';
        const contactPhone = report.contact_phone || 'Not provided';
        const reportedBy = report.reported_by || 'Unknown User';
        
        // Check if contact info is actually available
        const hasContactInfo = report.user_email && report.user_phone && report.user_phone.trim() !== '';
        const contactInfoClass = hasContactInfo ? '' : ' style="opacity: 0.7;"';
        const contactWarning = !hasContactInfo ? '<div style="color: #92400e; font-size: 0.8rem; margin-top: 0.5rem;"><i class="fas fa-exclamation-circle"></i> User did not provide complete contact information during registration</div>' : '';
        
        const div = document.createElement('div');
        div.className = 'card';
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem; flex-wrap: wrap; gap: 1rem;">
                <div style="flex: 1; min-width: 250px;">
                    <h3>${report.title} <span class="badge badge-${report.status}" style="font-size:0.7rem; vertical-align:middle;">${report.status}</span></h3>
                    <div style="font-size:0.85rem; color:#6b7280; margin-top: 0.5rem;">
                        <span><i class="fas fa-hashtag"></i> ID: ${report.complaint_id || report.report_id}</span> • 
                        <span><i class="fas fa-calendar"></i> ${new Date(report.created_at).toLocaleDateString()}</span> • 
                        <span><i class="fas fa-user"></i> ${reportedBy}</span>
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="background: ${crimeTypeColor}; color: white; padding: 0.75rem 1.25rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <div style="font-size: 0.75rem; opacity: 0.9; margin-bottom: 0.25rem;">Category</div>
                        <div style="font-weight: 700; font-size: 1rem;">
                            <i class="${crimeTypeIcon}"></i> ${crimeType}
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="background: #f8fafc; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; border-left: 4px solid ${crimeTypeColor};">
                <p style="margin: 0; color: #4b5563; line-height: 1.6;">${report.description}</p>
            </div>
            
            <div style="background: #f0f9ff; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; border: 1px solid #bae6fd;">
                <div style="display: flex; gap: 1rem; flex-wrap: wrap; font-size: 0.85rem;">
                    <div><i class="fas fa-map-marker-alt" style="color: #0284c7;"></i> <strong>Location:</strong> ${report.location}</div>
                    <div><i class="fas fa-calendar-plus" style="color: #0284c7;"></i> <strong>Reported:</strong> ${new Date(report.created_at).toLocaleString()}</div>
                </div>
            </div>
            
            ${report.evidence_files && report.evidence_files.trim() !== '' ? `
            <div class="card" style="background: #f0fdf4; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; border: 1px solid #bbf7d0;">
                <div style="font-size: 0.85rem; color: #166534; margin-bottom: 0.75rem;">
                    <strong><i class="fas fa-paperclip"></i> Evidence Attached:</strong>
                </div>
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                    ${report.evidence_files.split(',').map((file, index) => {
                        const fileType = report.evidence_types ? report.evidence_types.split(',')[index] : 'document';
                        const icon = fileType === 'image' ? 'fa-image' : fileType === 'video' ? 'fa-video' : 'fa-file';
                        const fileUrl = `http://localhost:3000/uploads/${file.trim()}`;
                        return `
                            <a href="${fileUrl}" target="_blank" 
                               class="btn btn-outline" 
                               style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; border-color: #16a34a; color: #16a34a; text-decoration: none;">
                                <i class="fas ${icon}"></i>
                                <span>View Evidence ${index + 1}</span>
                                <i class="fas fa-external-link-alt" style="font-size: 0.75rem;"></i>
                            </a>
                        `;
                    }).join('')}
                </div>
            </div>
            ` : ''}
            
            <div class="card" style="background: #fef3c7; padding: 0.75rem; border-radius: 6px; margin-bottom: 1rem; border: 1px solid #fde68a;">
                <div style="font-size: 0.85rem; color: #92400e;">
                    <strong><i class="fas fa-address-book"></i> Contact Information:</strong>
                </div>
                <div style="margin-top: 0.75rem;">
                    <div style="background: rgba(255, 255, 255, 0.5); padding: 0.75rem; border-radius: 6px; margin-bottom: 0.75rem; border-left: 3px solid #d97706;">
                        <div style="font-size: 0.8rem; color: #92400e; font-weight: 600; margin-bottom: 0.5rem;">
                            <i class="fas fa-user"></i> Account Information:
                        </div>
                        <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; font-size: 0.85rem; color: #78350f;">
                            <div><i class="fas fa-envelope" style="color: #d97706;"></i> <strong>Email:</strong> ${userEmail}</div>
                            <div><i class="fas fa-phone" style="color: #d97706;"></i> <strong>Phone:</strong> ${userPhone}</div>
                        </div>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.5); padding: 0.75rem; border-radius: 6px; border-left: 3px solid #059669;">
                        <div style="font-size: 0.8rem; color: #065f46; font-weight: 600; margin-bottom: 0.5rem;">
                            <i class="fas fa-mobile-alt"></i> Report Contact Number:
                        </div>
                        <div style="font-size: 0.85rem; color: #065f46;">
                            <i class="fas fa-phone-alt" style="color: #059669;"></i> <strong>Contact:</strong> ${contactPhone}
                        </div>
                        <div style="font-size: 0.75rem; color: #059669; margin-top: 0.25rem;">
                            <i class="fas fa-info-circle"></i> Number provided during report submission
                        </div>
                    </div>
                </div>
                ${contactWarning}
            </div>
            
            <form onsubmit="updateStatus(event, ${report.report_id})" style="background:#f9fafb; padding:1rem; border-radius:4px; border:1px solid #e5e7eb;">
                <h4 style="font-size:0.9rem; margin-bottom:0.5rem;"><i class="fas fa-edit"></i> Update Case Status</h4>
                <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                    <select id="status-${report.report_id}" class="form-control" style="width: auto; flex:1;">
                        <option value="pending" ${report.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="verified" ${report.status === 'verified' ? 'selected' : ''}>Verified</option>
                        <option value="investigation" ${report.status === 'investigation' ? 'selected' : ''}>Under Investigation</option>
                        <option value="resolved" ${report.status === 'resolved' ? 'selected' : ''}>Resolved</option>
                        <option value="rejected" ${report.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                    </select>
                    <input type="text" id="remark-${report.report_id}" placeholder="Add official remarks..." class="form-control" style="flex:2;">
                    <button type="submit" class="btn btn-primary">Update</button>
                </div>
            </form>
        `;
        container.appendChild(div);
    });
}

// UPDATE STATUS
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
            alert('Status updated successfully');
            // Reload all reports and reapply filters
            await loadAllReports();
            applyFilters();
        } else {
            alert('Failed to update');
        }
    } catch (err) {
        console.error(err);
        alert('Error updating status');
    }
}
