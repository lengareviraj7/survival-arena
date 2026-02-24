// Exams Management
function loadExams() {
    const exams = Storage.get('exams') || [];
    renderExams(exams);
}

function renderExams(exams) {
    const container = document.getElementById('examsList');
    
    if (exams.length === 0) {
        container.innerHTML = '<p class="empty-state">No exams scheduled</p>';
        return;
    }
    
    const upcoming = exams.filter(e => new Date(e.date) > new Date());
    const past = exams.filter(e => new Date(e.date) <= new Date());
    
    container.innerHTML = `
        ${upcoming.length > 0 ? '<h3>Upcoming Exams</h3>' : ''}
        ${upcoming.map(e => createExamCard(e)).join('')}
        ${past.length > 0 ? '<h3 style="margin-top: 2rem;">Past Exams</h3>' : ''}
        ${past.map(e => createExamCard(e, true)).join('')}
    `;
}

function createExamCard(exam, isPast = false) {
    const daysLeft = getDaysUntil(exam.date);
    const progress = isPast ? 100 : Math.max(0, 100 - (daysLeft * 2));
    
    return `
        <div class="exam-card">
            <h3>${exam.title}</h3>
            <p>${exam.subject}</p>
            <p class="exam-countdown">${isPast ? 'Completed' : daysLeft + ' days left'}</p>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">
                ${new Date(exam.date).toLocaleString()}
            </p>
            ${exam.notes ? `<p style="margin-top: 1rem; color: var(--text-secondary);">${exam.notes}</p>` : ''}
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="assignment-actions" style="margin-top: 1rem;">
                <button class="btn-icon" onclick="editExam('${exam.id}')">✏️</button>
                <button class="btn-icon" onclick="deleteExam('${exam.id}')">🗑️</button>
            </div>
        </div>
    `;
}

function showAddExam() {
    document.getElementById('modalOverlay').classList.remove('hidden');
    document.getElementById('addExamModal').classList.remove('hidden');
}

function addExam(event) {
    event.preventDefault();
    
    const exam = {
        id: generateId(),
        title: document.getElementById('examTitle').value,
        subject: document.getElementById('examSubject').value,
        date: document.getElementById('examDate').value,
        notes: document.getElementById('examNotes').value,
        createdAt: new Date().toISOString()
    };
    
    const exams = Storage.get('exams') || [];
    exams.push(exam);
    Storage.set('exams', exams);
    
    closeModal();
    loadExams();
    updateDashboardData();
}

function editExam(id) {
    const exams = Storage.get('exams') || [];
    const exam = exams.find(e => e.id === id);
    if (!exam) return;
    
    document.getElementById('examTitle').value = exam.title;
    document.getElementById('examSubject').value = exam.subject;
    document.getElementById('examDate').value = exam.date;
    document.getElementById('examNotes').value = exam.notes || '';
    
    showAddExam();
    
    const form = document.querySelector('#addExamModal form');
    form.onsubmit = (e) => {
        e.preventDefault();
        exam.title = document.getElementById('examTitle').value;
        exam.subject = document.getElementById('examSubject').value;
        exam.date = document.getElementById('examDate').value;
        exam.notes = document.getElementById('examNotes').value;
        Storage.set('exams', exams);
        closeModal();
        loadExams();
        updateDashboardData();
        form.onsubmit = addExam;
    };
}

function deleteExam(id) {
    if (!confirm('Delete this exam?')) return;
    
    let exams = Storage.get('exams') || [];
    exams = exams.filter(e => e.id !== id);
    Storage.set('exams', exams);
    loadExams();
    updateDashboardData();
}
