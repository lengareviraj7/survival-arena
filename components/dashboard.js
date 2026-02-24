// Dashboard Functions
function loadDashboardData() {
    updateOverviewCards();
    updateUpcomingDeadlines();
    updateExamCountdown();
    updateStreak();
    updateBadges();
    document.getElementById('motivationalQuote').textContent = getRandomQuote();
}

function updateOverviewCards() {
    const assignments = Storage.get('assignments') || [];
    const exams = Storage.get('exams') || [];
    const sessions = Storage.get('timerSessions') || [];
    
    const totalAssignments = assignments.length;
    const upcomingExams = exams.filter(e => new Date(e.date) > new Date()).length;
    
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekSessions = sessions.filter(s => new Date(s.date) > weekAgo);
    const studyMinutes = weekSessions.reduce((sum, s) => sum + s.duration, 0);
    const studyHours = Math.floor(studyMinutes / 60);
    
    const completedAssignments = assignments.filter(a => a.completed).length;
    const productivityScore = totalAssignments > 0 
        ? Math.round((completedAssignments / totalAssignments) * 100) 
        : 0;
    
    animateNumber(document.getElementById('totalAssignments'), totalAssignments);
    animateNumber(document.getElementById('upcomingExams'), upcomingExams);
    document.getElementById('studyHours').textContent = studyHours + 'h';
    animateNumber(document.getElementById('productivityScore'), productivityScore);
    document.getElementById('productivityScore').textContent += '%';
}

function updateUpcomingDeadlines() {
    const assignments = Storage.get('assignments') || [];
    const container = document.getElementById('upcomingDeadlines');
    
    const upcoming = assignments
        .filter(a => !a.completed && new Date(a.deadline) > new Date())
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 5);
    
    if (upcoming.length === 0) {
        container.innerHTML = '<p class="empty-state">No upcoming deadlines</p>';
        return;
    }
    
    container.innerHTML = upcoming.map(a => `
        <div class="deadline-item">
            <div class="deadline-info">
                <h4>${a.title}</h4>
                <p>${a.subject} • Due ${formatDate(a.deadline)}</p>
            </div>
            <span class="deadline-badge badge-pending">${getDaysUntil(a.deadline)}d left</span>
        </div>
    `).join('');
}

function updateExamCountdown() {
    const exams = Storage.get('exams') || [];
    const container = document.getElementById('examCountdown');
    
    const upcoming = exams
        .filter(e => new Date(e.date) > new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);
    
    if (upcoming.length === 0) {
        container.innerHTML = '<p class="empty-state">No upcoming exams</p>';
        return;
    }
    
    container.innerHTML = upcoming.map(e => {
        const daysLeft = getDaysUntil(e.date);
        const progress = Math.max(0, 100 - (daysLeft * 2));
        return `
            <div class="exam-item">
                <div class="exam-info">
                    <h4>${e.title}</h4>
                    <p>${e.subject}</p>
                    <p class="exam-countdown">${daysLeft} days left</p>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

function updateStreak() {
    const streak = Storage.get('streak') || { current: 0, longest: 0 };
    document.getElementById('currentStreak').textContent = `${streak.current} days 🔥`;
    document.getElementById('longestStreak').textContent = `${streak.longest} days 🏆`;
}

function updateBadges() {
    const assignments = Storage.get('assignments') || [];
    const sessions = Storage.get('timerSessions') || [];
    const streak = Storage.get('streak') || { current: 0 };
    
    const badges = ['🌟 Beginner'];
    
    if (assignments.filter(a => a.completed).length >= 5) badges.push('📚 Achiever');
    if (assignments.filter(a => a.completed).length >= 20) badges.push('🏆 Master');
    if (sessions.length >= 10) badges.push('⏱️ Focused');
    if (streak.current >= 7) badges.push('🔥 Consistent');
    if (streak.current >= 30) badges.push('💎 Dedicated');
    
    document.getElementById('badgesContainer').innerHTML = badges.map(b => 
        `<div class="badge">${b}</div>`
    ).join('');
}

function showSection(section) {
    document.querySelectorAll('.section-content').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    const sectionMap = {
        'dashboard': 'dashboardHome',
        'assignments': 'assignmentsPage',
        'exams': 'examsPage',
        'notes': 'notesPage',
        'goals': 'goalsPage',
        'timer': 'timerPage',
        'analytics': 'analyticsPage',
        'settings': 'settingsPage'
    };
    
    document.getElementById(sectionMap[section]).classList.remove('hidden');
    event.target.closest('.nav-item').classList.add('active');
    
    const titles = {
        'dashboard': 'Dashboard',
        'assignments': 'Assignments',
        'exams': 'Exams',
        'notes': 'Notes',
        'goals': 'Goals',
        'timer': 'Study Timer',
        'analytics': 'Analytics',
        'settings': 'Settings'
    };
    document.getElementById('pageTitle').textContent = titles[section];
    
    if (section === 'assignments') loadAssignments();
    if (section === 'exams') loadExams();
    if (section === 'notes') loadNotes();
    if (section === 'goals') loadGoals();
    if (section === 'analytics') loadAnalytics();
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
    sidebar.classList.toggle('active');
}
