// Study Timer (Pomodoro)
let timerInterval = null;
let timerSeconds = 25 * 60;
let isTimerRunning = false;

function startTimer() {
    if (isTimerRunning) return;
    
    isTimerRunning = true;
    document.getElementById('timerStart').disabled = true;
    document.getElementById('timerPause').disabled = false;
    
    timerInterval = setInterval(() => {
        timerSeconds--;
        updateTimerDisplay();
        
        if (timerSeconds <= 0) {
            completeSession();
        }
    }, 1000);
}

function pauseTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
    document.getElementById('timerStart').disabled = false;
    document.getElementById('timerPause').disabled = true;
}

function resetTimer() {
    pauseTimer();
    timerSeconds = 25 * 60;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    document.getElementById('timerDisplay').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function completeSession() {
    pauseTimer();
    
    // Play sound (browser notification)
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Study Session Complete!', {
            body: 'Great job! Take a short break.',
            icon: '🎯'
        });
    }
    
    // Save session
    const sessions = Storage.get('timerSessions') || [];
    sessions.push({
        id: generateId(),
        duration: 25,
        date: new Date().toISOString()
    });
    Storage.set('timerSessions', sessions);
    
    // Update streak
    updateStudyStreak();
    
    // Update display
    updateTimerStats();
    updateDashboardData();
    
    alert('🎉 Session complete! Great work!');
    resetTimer();
}

function updateTimerStats() {
    const sessions = Storage.get('timerSessions') || [];
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(s => new Date(s.date).toDateString() === today);
    
    document.getElementById('sessionsToday').textContent = todaySessions.length;
    
    const totalMinutes = todaySessions.reduce((sum, s) => sum + s.duration, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    document.getElementById('totalFocusTime').textContent = `${hours}h ${minutes}m`;
}

function updateStudyStreak() {
    const streak = Storage.get('streak') || { current: 0, longest: 0, lastDate: null };
    const today = new Date().toDateString();
    
    if (streak.lastDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (streak.lastDate === yesterday.toDateString()) {
            streak.current++;
        } else {
            streak.current = 1;
        }
        
        streak.lastDate = today;
        streak.longest = Math.max(streak.longest, streak.current);
        Storage.set('streak', streak);
    }
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}
