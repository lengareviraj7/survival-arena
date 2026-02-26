// Dashboard Functions

function loadDashboardData() {
    updateOverviewCards();
    updateUpcomingDeadlines();
    updateExamCountdown();
    updateStreakWidget();
    updateBadges();
    updateMotivationalQuote();
}

function updateOverviewCards() {
    const assignments = getAssignments();
    const exams = getExams();
    const timerStats = getTimerStats();
    const productivityScore = calculateProductivityScore();
    
    // Total Assignments
    const totalAssignments = assignments.length;
    document.getElementById('totalAssignments').textContent = totalAssignments;
    animateCounter(document.getElementById('totalAssignments'), totalAssignments, 1000);
    
    // Upcoming Exams
    const upcomingExams = exams.filter(e => new Date(e.date) > new Date()).length;
    document.getElementById('upcomingExams').textContent = upcomingExams;
    animateCounter(document.getElementById('upcomingExams'), upcomingExams, 1000);
    
    // Study Hours This Week
    const weeklyHours = Math.floor(timerStats.totalMinutes / 60);
    document.getElementById('studyHours').textContent = weeklyHours + 'h';
    
    // Productivity Score
    document.getElementById('productivityScore').textContent = productivityScore + '%';
    animateCounter(document.getElementById('productivityScore'), productivityScore, 1500);
}

function updateUpcomingDeadlines() {
    const assignments = getAssignments();
    const container = document.getElementById('upcomingDeadlines');
    
    // Filter upcoming and not completed
    const upcoming = assignments
        .filter(a => !a.completed && new Date(a.deadline) > new Date())
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 5);
    
    if (upcoming.length === 0) {
        container.innerHTML = '<p class="empty-state">No upcoming deadlines</p>';
        return;
    }
    
    container.innerHTML = upcoming.map(assignment => `
        <div class="deadline-item">
            <div class="deadline-info">
                <h4>${escapeHtml(assignment.title)}</h4>
                <p>${escapeHtml(assignment.subject)} • ${getTimeUntil(assignment.deadline)}</p>
            </div>
            <span class="deadline-badge badge-pending">${formatDate(assignment.deadline)}</span>
        </div>
    `).join('');
}

function updateExamCountdown() {
    const exams = getExams();
    const container = document.getElementById('examCountdown');
    
    const upcoming = exams
        .filter(e => new Date(e.date) > new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);
    
    if (upcoming.length === 0) {
        container.innerHTML = '<p class="empty-state">No upcoming exams</p>';
        return;
    }
    
    container.innerHTML = upcoming.map(exam => {
        const daysUntil = getDaysUntil(exam.date);
        const progress = Math.max(0, 100 - (daysUntil * 5));
        
        return `
            <div class="exam-item">
                <div class="exam-info">
                    <h4>${escapeHtml(exam.title)}</h4>
                    <p>${escapeHtml(exam.subject)}</p>
                    <div class="exam-countdown">${daysUntil} days</div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

function updateStreakWidget() {
    const stats = getTimerStats();
    document.getElementById('currentStreak').textContent = `${stats.currentStreak} days 🔥`;
    document.getElementById('longestStreak').textContent = `${stats.longestStreak} days 🏆`;
}

function updateBadges() {
    const assignments = getAssignments();
    const timerStats = getTimerStats();
    const container = document.getElementById('badgesContainer');
    
    const badges = [];
    
    // Beginner badge
    badges.push('🌟 Beginner');
    
    // Assignment badges
    const completedCount = assignments.filter(a => a.completed).length;
    if (completedCount >= 5) badges.push('📚 Task Master');
    if (completedCount >= 20) badges.push('🏆 Achiever');
    
    // Study time badges
    const totalHours = Math.floor(timerStats.totalMinutes / 60);
    if (totalHours >= 10) badges.push('⏱️ Focused');
    if (totalHours >= 50) badges.push('🔥 Dedicated');
    
    // Streak badges
    if (timerStats.currentStreak >= 7) badges.push('📅 Week Warrior');
    if (timerStats.currentStreak >= 30) badges.push('💪 Month Master');
    
    container.innerHTML = badges.map(badge => `<div class="badge">${badge}</div>`).join('');
}
