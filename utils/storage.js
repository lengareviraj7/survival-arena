// Local Storage Management

const STORAGE_KEYS = {
    USER: 'studentos_user',
    ASSIGNMENTS: 'studentos_assignments',
    EXAMS: 'studentos_exams',
    NOTES: 'studentos_notes',
    GOALS: 'studentos_goals',
    TIMER_STATS: 'studentos_timer_stats',
    SETTINGS: 'studentos_settings'
};

// User Management
function getCurrentUser() {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER);
    return userStr ? JSON.parse(userStr) : null;
}

function setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem(STORAGE_KEYS.USER);
}

// Assignments
function getAssignments() {
    const data = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    return data ? JSON.parse(data) : [];
}

function saveAssignments(assignments) {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(assignments));
}

function addAssignment(assignment) {
    const assignments = getAssignments();
    assignment.id = Date.now().toString();
    assignment.createdAt = new Date().toISOString();
    assignment.completed = false;
    assignments.push(assignment);
    saveAssignments(assignments);
    return assignment;
}

function updateAssignment(id, updates) {
    const assignments = getAssignments();
    const index = assignments.findIndex(a => a.id === id);
    if (index !== -1) {
        assignments[index] = { ...assignments[index], ...updates };
        saveAssignments(assignments);
        return assignments[index];
    }
    return null;
}

function deleteAssignment(id) {
    const assignments = getAssignments();
    const filtered = assignments.filter(a => a.id !== id);
    saveAssignments(filtered);
}

// Exams
function getExams() {
    const data = localStorage.getItem(STORAGE_KEYS.EXAMS);
    return data ? JSON.parse(data) : [];
}

function saveExams(exams) {
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
}

function addExam(exam) {
    const exams = getExams();
    exam.id = Date.now().toString();
    exam.createdAt = new Date().toISOString();
    exams.push(exam);
    saveExams(exams);
    return exam;
}

function deleteExam(id) {
    const exams = getExams();
    const filtered = exams.filter(e => e.id !== id);
    saveExams(filtered);
}

// Notes
function getNotes() {
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    return data ? JSON.parse(data) : [];
}

function saveNotes(notes) {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
}

function addNote(note) {
    const notes = getNotes();
    note.id = Date.now().toString();
    note.createdAt = new Date().toISOString();
    note.updatedAt = new Date().toISOString();
    notes.push(note);
    saveNotes(notes);
    return note;
}

function updateNote(id, updates) {
    const notes = getNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index !== -1) {
        notes[index] = { ...notes[index], ...updates, updatedAt: new Date().toISOString() };
        saveNotes(notes);
        return notes[index];
    }
    return null;
}

function deleteNote(id) {
    const notes = getNotes();
    const filtered = notes.filter(n => n.id !== id);
    saveNotes(filtered);
}

// Goals
function getGoals() {
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    return data ? JSON.parse(data) : [];
}

function saveGoals(goals) {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
}

function addGoal(goal) {
    const goals = getGoals();
    goal.id = Date.now().toString();
    goal.createdAt = new Date().toISOString();
    goals.push(goal);
    saveGoals(goals);
    return goal;
}

function updateGoal(id, updates) {
    const goals = getGoals();
    const index = goals.findIndex(g => g.id === id);
    if (index !== -1) {
        goals[index] = { ...goals[index], ...updates };
        saveGoals(goals);
        return goals[index];
    }
    return null;
}

function deleteGoal(id) {
    const goals = getGoals();
    const filtered = goals.filter(g => g.id !== id);
    saveGoals(filtered);
}

// Timer Stats
function getTimerStats() {
    const data = localStorage.getItem(STORAGE_KEYS.TIMER_STATS);
    return data ? JSON.parse(data) : {
        sessionsToday: 0,
        totalMinutes: 0,
        lastSessionDate: null,
        currentStreak: 0,
        longestStreak: 0
    };
}

function saveTimerStats(stats) {
    localStorage.setItem(STORAGE_KEYS.TIMER_STATS, JSON.stringify(stats));
}

function updateTimerStats(minutes) {
    const stats = getTimerStats();
    const today = new Date().toDateString();
    
    if (stats.lastSessionDate !== today) {
        stats.sessionsToday = 0;
    }
    
    stats.sessionsToday++;
    stats.totalMinutes += minutes;
    stats.lastSessionDate = today;
    
    // Update streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (stats.lastSessionDate === yesterday.toDateString() || stats.lastSessionDate === today) {
        stats.currentStreak++;
        if (stats.currentStreak > stats.longestStreak) {
            stats.longestStreak = stats.currentStreak;
        }
    } else if (stats.lastSessionDate !== today) {
        stats.currentStreak = 1;
    }
    
    saveTimerStats(stats);
    return stats;
}

// Settings
function getSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
        theme: 'dark',
        notifications: true,
        pomodoroLength: 25
    };
}

function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// Clear all data
function clearAllData() {
    if (confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
        Object.values(STORAGE_KEYS).forEach(key => {
            if (key !== STORAGE_KEYS.USER) {
                localStorage.removeItem(key);
            }
        });
        location.reload();
    }
}

// Export data
function exportData() {
    const data = {
        assignments: getAssignments(),
        exams: getExams(),
        notes: getNotes(),
        goals: getGoals(),
        timerStats: getTimerStats(),
        settings: getSettings(),
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `studentos-backup-${Date.now()}.json`;
    link.click();
}

// Import data
function importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data.assignments) saveAssignments(data.assignments);
            if (data.exams) saveExams(data.exams);
            if (data.notes) saveNotes(data.notes);
            if (data.goals) saveGoals(data.goals);
            if (data.timerStats) saveTimerStats(data.timerStats);
            if (data.settings) saveSettings(data.settings);
            alert('Data imported successfully!');
            location.reload();
        } catch (error) {
            alert('Error importing data. Please check the file format.');
        }
    };
    reader.readAsText(file);
}
