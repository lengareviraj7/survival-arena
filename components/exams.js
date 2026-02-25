// Exams Management

function loadExams() {
    const exams = getExams();
    renderExams(exams);
}

function renderExams(exams) {
    const container = document.getElementById('examsList');
    
    if (exams.length === 0) {
        container.innerHTML = '<p class="empty-state">No exams scheduled</p>';
        return;
    }
    
    // Sort by date
    const sortedExams = sortByDate(exams, 'date', true);
    
    container.innerHTML = sortedExams.map(exam => {
        const daysUntil = getDaysUntil(exam.date);
        const isPast = daysUntil < 0;
        const progress = isPast ? 100 : Math.max(0, 100 - (daysUntil * 2));
        
        return `
            <div class="exam-card ${isPast ? 'past-exam' : ''}" data-id="${exam.id}">
                <div class="exam-header">
                    <h3>${escapeHtml(exam.title)}</h3>
                    <button class="btn-icon" onclick="deleteExamConfirm('${exam.id}')" title="Delete">🗑️</button>
                </div>
                <p class="exam-subject">${escapeHtml(exam.subject)}</p>
                <p class="exam-date">${formatDateTime(exam.date)}</p>
                ${!isPast ? `
                    <div class="exam-countdown">${Math.abs(daysUntil)} days ${daysUntil >= 0 ? 'until' : 'ago'}</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                ` : '<div class="exam-status">Completed</div>'}
                ${exam.notes ? `<p class="exam-notes">${escapeHtml(exam.notes)}</p>` : ''}
            </div>
        `;
    }).join('');
    
    staggerAnimation('.exam-card', 50);
}

function addExam(event) {
    event.preventDefault();
    
    const title = document.getElementById('examTitle').value;
    const subject = document.getElementById('examSubject').value;
    const date = document.getElementById('examDate').value;
    const notes = document.getElementById('examNotes').value;
    
    const exam = {
        title,
        subject,
        date: new Date(date).toISOString(),
        notes
    };
    
    addExam(exam);
    showNotification('Exam added successfully!', 'success');
    
    closeModal();
    loadExams();
    loadDashboardData();
    
    event.target.reset();
}

function deleteExamConfirm(id) {
    if (confirm('Are you sure you want to delete this exam?')) {
        deleteExam(id);
        showNotification('Exam deleted', 'info');
        loadExams();
        loadDashboardData();
    }
}
