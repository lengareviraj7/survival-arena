// Assignments Management
function loadAssignments() {
    const assignments = Storage.get('assignments') || [];
    renderAssignments(assignments);
    populateSubjectFilter();
}

function renderAssignments(assignments) {
    const container = document.getElementById('assignmentsList');
    
    if (assignments.length === 0) {
        container.innerHTML = '<p class="empty-state">No assignments yet. Click "Add Assignment" to get started!</p>';
        return;
    }
    
    container.innerHTML = assignments.map(a => `
        <div class="assignment-card ${a.completed ? 'completed' : ''}">
            <div class="assignment-info">
                <div class="assignment-header">
                    <h3 class="assignment-title">${a.title}</h3>
                    <span class="subject-tag">${a.subject}</span>
                </div>
                <p class="assignment-meta">Due: ${formatDate(a.deadline)} • ${getDaysUntil(a.deadline)} days left</p>
                ${a.description ? `<p class="assignment-description">${a.description}</p>` : ''}
            </div>
            <div class="assignment-actions">
                <button class="btn-icon" onclick="toggleAssignment('${a.id}')" title="${a.completed ? 'Mark Incomplete' : 'Mark Complete'}">
                    ${a.completed ? '✓' : '○'}
                </button>
                <button class="btn-icon" onclick="editAssignment('${a.id}')" title="Edit">✏️</button>
                <button class="btn-icon" onclick="deleteAssignment('${a.id}')" title="Delete">🗑️</button>
            </div>
        </div>
    `).join('');
}

function showAddAssignment() {
    document.getElementById('modalOverlay').classList.remove('hidden');
    document.getElementById('addAssignmentModal').classList.remove('hidden');
}

function addAssignment(event) {
    event.preventDefault();
    
    const assignment = {
        id: generateId(),
        title: document.getElementById('assignmentTitle').value,
        subject: document.getElementById('assignmentSubject').value,
        deadline: document.getElementById('assignmentDeadline').value,
        description: document.getElementById('assignmentDescription').value,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    const assignments = Storage.get('assignments') || [];
    assignments.push(assignment);
    Storage.set('assignments', assignments);
    
    closeModal();
    loadAssignments();
    updateDashboardData();
}

function toggleAssignment(id) {
    const assignments = Storage.get('assignments') || [];
    const assignment = assignments.find(a => a.id === id);
    if (assignment) {
        assignment.completed = !assignment.completed;
        Storage.set('assignments', assignments);
        loadAssignments();
        updateDashboardData();
    }
}

function editAssignment(id) {
    const assignments = Storage.get('assignments') || [];
    const assignment = assignments.find(a => a.id === id);
    if (!assignment) return;
    
    document.getElementById('assignmentTitle').value = assignment.title;
    document.getElementById('assignmentSubject').value = assignment.subject;
    document.getElementById('assignmentDeadline').value = assignment.deadline;
    document.getElementById('assignmentDescription').value = assignment.description || '';
    
    showAddAssignment();
    
    const form = document.querySelector('#addAssignmentModal form');
    form.onsubmit = (e) => {
        e.preventDefault();
        assignment.title = document.getElementById('assignmentTitle').value;
        assignment.subject = document.getElementById('assignmentSubject').value;
        assignment.deadline = document.getElementById('assignmentDeadline').value;
        assignment.description = document.getElementById('assignmentDescription').value;
        Storage.set('assignments', assignments);
        closeModal();
        loadAssignments();
        updateDashboardData();
        form.onsubmit = addAssignment;
    };
}

function deleteAssignment(id) {
    if (!confirm('Delete this assignment?')) return;
    
    let assignments = Storage.get('assignments') || [];
    assignments = assignments.filter(a => a.id !== id);
    Storage.set('assignments', assignments);
    loadAssignments();
    updateDashboardData();
}

function populateSubjectFilter() {
    const assignments = Storage.get('assignments') || [];
    const subjects = [...new Set(assignments.map(a => a.subject))];
    const filter = document.getElementById('assignmentFilter');
    
    filter.innerHTML = '<option value="all">All Subjects</option>' +
        subjects.map(s => `<option value="${s}">${s}</option>`).join('');
}

function filterAssignments() {
    const filter = document.getElementById('assignmentFilter').value;
    const search = document.getElementById('assignmentSearch').value.toLowerCase();
    let assignments = Storage.get('assignments') || [];
    
    if (filter !== 'all') {
        assignments = assignments.filter(a => a.subject === filter);
    }
    
    if (search) {
        assignments = assignments.filter(a => 
            a.title.toLowerCase().includes(search) || 
            a.subject.toLowerCase().includes(search)
        );
    }
    
    renderAssignments(assignments);
}

function sortAssignments() {
    const sort = document.getElementById('assignmentSort').value;
    let assignments = Storage.get('assignments') || [];
    
    if (sort === 'deadline') {
        assignments.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (sort === 'subject') {
        assignments.sort((a, b) => a.subject.localeCompare(b.subject));
    } else if (sort === 'status') {
        assignments.sort((a, b) => a.completed - b.completed);
    }
    
    renderAssignments(assignments);
}

document.getElementById('assignmentSearch')?.addEventListener('input', filterAssignments);
