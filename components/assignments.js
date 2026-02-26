// Assignments Management

function loadAssignments() {
    const assignments = getAssignments();
    renderAssignments(assignments);
    updateFilterOptions();
}

function renderAssignments(assignments) {
    const container = document.getElementById('assignmentsList');
    
    if (assignments.length === 0) {
        container.innerHTML = '<p class="empty-state">No assignments yet. Click "Add Assignment" to get started!</p>';
        return;
    }
    
    container.innerHTML = assignments.map(assignment => `
        <div class="assignment-card ${assignment.completed ? 'completed' : ''}" data-id="${assignment.id}">
            <div class="assignment-info">
                <div class="assignment-header">
                    <input type="checkbox" 
                           ${assignment.completed ? 'checked' : ''} 
                           onchange="toggleAssignmentComplete('${assignment.id}')"
                           class="assignment-checkbox">
                    <h3 class="assignment-title ${assignment.completed ? 'line-through' : ''}">${escapeHtml(assignment.title)}</h3>
                    <span class="subject-tag" style="background-color: ${getSubjectColor(assignment.subject)}20; color: ${getSubjectColor(assignment.subject)}">${escapeHtml(assignment.subject)}</span>
                </div>
                <p class="assignment-meta">
                    Due: ${formatDate(assignment.deadline)} • ${getTimeUntil(assignment.deadline)}
                </p>
                ${assignment.description ? `<p class="assignment-description">${escapeHtml(assignment.description)}</p>` : ''}
            </div>
            <div class="assignment-actions">
                <button class="btn-icon" onclick="editAssignment('${assignment.id}')" title="Edit">✏️</button>
                <button class="btn-icon" onclick="deleteAssignmentConfirm('${assignment.id}')" title="Delete">🗑️</button>
            </div>
        </div>
    `).join('');
    
    // Add stagger animation
    staggerAnimation('.assignment-card', 50);
}

function addAssignment(event) {
    event.preventDefault();
    
    const title = document.getElementById('assignmentTitle').value;
    const subject = document.getElementById('assignmentSubject').value;
    const deadline = document.getElementById('assignmentDeadline').value;
    const description = document.getElementById('assignmentDescription').value;
    
    const assignment = {
        title,
        subject,
        deadline: new Date(deadline).toISOString(),
        description
    };
    
    addAssignment(assignment);
    showNotification('Assignment added successfully!', 'success');
    
    closeModal();
    loadAssignments();
    loadDashboardData();
    
    // Reset form
    event.target.reset();
}

function toggleAssignmentComplete(id) {
    const assignments = getAssignments();
    const assignment = assignments.find(a => a.id === id);
    
    if (assignment) {
        assignment.completed = !assignment.completed;
        updateAssignment(id, { completed: assignment.completed });
        loadAssignments();
        loadDashboardData();
        
        if (assignment.completed) {
            showNotification('Assignment completed! 🎉', 'success');
        }
    }
}

function deleteAssignmentConfirm(id) {
    if (confirm('Are you sure you want to delete this assignment?')) {
        deleteAssignment(id);
        showNotification('Assignment deleted', 'info');
        loadAssignments();
        loadDashboardData();
    }
}

function editAssignment(id) {
    const assignment = getAssignments().find(a => a.id === id);
    if (!assignment) return;
    
    // Populate form with existing data
    document.getElementById('assignmentTitle').value = assignment.title;
    document.getElementById('assignmentSubject').value = assignment.subject;
    document.getElementById('assignmentDeadline').value = assignment.deadline.split('T')[0];
    document.getElementById('assignmentDescription').value = assignment.description || '';
    
    // Change form submit to update
    const form = document.querySelector('#addAssignmentModal form');
    form.onsubmit = (e) => {
        e.preventDefault();
        updateAssignment(id, {
            title: document.getElementById('assignmentTitle').value,
            subject: document.getElementById('assignmentSubject').value,
            deadline: new Date(document.getElementById('assignmentDeadline').value).toISOString(),
            description: document.getElementById('assignmentDescription').value
        });
        showNotification('Assignment updated!', 'success');
        closeModal();
        loadAssignments();
        form.onsubmit = addAssignment;
    };
    
    showModal('addAssignmentModal');
}

function updateFilterOptions() {
    const assignments = getAssignments();
    const subjects = [...new Set(assignments.map(a => a.subject))];
    const filterSelect = document.getElementById('assignmentFilter');
    
    filterSelect.innerHTML = '<option value="all">All Subjects</option>' +
        subjects.map(subject => `<option value="${subject}">${subject}</option>`).join('');
}

function filterAssignments() {
    const filter = document.getElementById('assignmentFilter').value;
    let assignments = getAssignments();
    
    if (filter !== 'all') {
        assignments = assignments.filter(a => a.subject === filter);
    }
    
    renderAssignments(assignments);
}

function sortAssignments() {
    const sortBy = document.getElementById('assignmentSort').value;
    let assignments = getAssignments();
    
    if (sortBy === 'deadline') {
        assignments = sortByDate(assignments, 'deadline', true);
    } else if (sortBy === 'subject') {
        assignments = sortByProperty(assignments, 'subject', true);
    } else if (sortBy === 'status') {
        assignments.sort((a, b) => a.completed - b.completed);
    }
    
    renderAssignments(assignments);
}

// Search functionality
document.getElementById('assignmentSearch')?.addEventListener('input', debounce((e) => {
    const searchTerm = e.target.value;
    let assignments = getAssignments();
    
    if (searchTerm) {
        assignments = filterBySearch(assignments, searchTerm, ['title', 'subject', 'description']);
    }
    
    renderAssignments(assignments);
}, 300));
