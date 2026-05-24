// REPORT SUBMISSION
async function submitReport(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing with AI...';

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('contactPhone', document.getElementById('contactPhone').value);
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
            // Show success message with AI classification
            const aiModel = data.aiModel || 'AI';
            const message = `✅ Report Submitted Successfully!\n\n` +
                          `🤖 ${aiModel} Classification: ${data.predictedCrimeType}\n` +
                          `📋 Report ID: ${data.complaintId}\n\n` +
                          `Your report has been received and will be reviewed by authorities.`;
            alert(message);
            window.location.href = 'index.html';
        } else {
            alert(data.error || 'Failed to submit report');
        }
    } catch (err) {
        console.error(err);
        alert('Error submitting report. Please try again.');
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Submit Report <i class="fas fa-paper-plane" style="margin-left: 0.5rem;"></i>';
    }
}
