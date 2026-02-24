// Main Application Logic
document.addEventListener('DOMContentLoaded', () => {
    initializeStorage();
    
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loadingScreen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loadingScreen').style.display = 'none';
        }, 500);
    }, 1500);
    
    // Check if user is logged in
    const user = Storage.get('user');
    if (user) {
        showDashboard();
    }
    
    // Apply saved theme
    const theme = Storage.get('theme') || 'dark';
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        document.getElementById('themeToggleText').textContent = 'Switch to Dark Mode';
    }
    
    // Update timer stats on load
    updateTimerStats();
});

// Modal Functions
function closeModal() {
    document.getElementById('modalOverlay').classList.add('hidden');
    document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
    
    // Reset forms
    document.querySelectorAll('.modal form').forEach(f => f.reset());
}

// Update dashboard data after changes
function updateDashboardData() {
    if (document.getElementById('dashboardHome').classList.contains('hidden')) return;
    loadDashboardData();
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape to close modals
    if (e.key === 'Escape') {
        closeModal();
    }
    
    // Ctrl/Cmd + K for quick add
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const activeSection = document.querySelector('.section-content:not(.hidden)');
        if (activeSection) {
            const sectionId = activeSection.id;
            if (sectionId === 'assignmentsPage') showAddAssignment();
            else if (sectionId === 'examsPage') showAddExam();
            else if (sectionId === 'notesPage') showAddNote();
            else if (sectionId === 'goalsPage') showAddGoal();
        }
    }
});

// Auto-save timer state
window.addEventListener('beforeunload', () => {
    if (isTimerRunning) {
        return 'Timer is running. Are you sure you want to leave?';
    }
});

console.log('🎓 Student Productivity OS loaded successfully!');
