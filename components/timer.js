// Study Timer (Pomodoro)

let timerInterval = null;
let timerSeconds = 25 * 60; // 25 minutes default
let timerRunning = false;

function startTimer() {
    if (timerRunning) return;
    
    timerRunning = true;
    document.getElementById('timerStart').disabled = true;
    document.getElementById('timerPause').disabled = false;
    
    timerInterval = setInterval(() => {
        timerSeconds--;
        updateTimerDisplay();
        
        if (timerSeconds <= 0) {
            completeTimer();
        }
    }, 1000);
}

function pauseTimer() {
    if (!timerRunning) return;
    
    timerRunning = false;
    clearInterval(timerInterval);
    document.getElementById('timerStart').disabled = false;
    document.getElementById('timerPause').disabled = true;
}

function resetTimer() {
    pauseTimer();
    timerSeconds = 25 * 60;
    updateTimerDisplay();
}

function completeTimer() {
    pauseTimer();
    
    // Play sound (optional)
    playTimerSound();
    
    // Update stats
    const stats = updateTimerStats(25);
    updateTimerStatsDisplay(stats);
    
    // Show notification
    showNotification('Pomodoro session completed! Great work! 🎉', 'success');
    
    // Reset timer
    timerSeconds = 25 * 60;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const display = document.getElementById('timerDisplay');
    display.textContent = formatTime(timerSeconds);
    
    // Update circle progress (optional visual enhancement)
    const progress = ((25 * 60 - timerSeconds) / (25 * 60)) * 100;
    const circle = document.querySelector('.timer-circle');
    if (circle) {
        circle.style.background = `conic-gradient(var(--accent-1) ${progress}%, var(--glass-bg) ${progress}%)`;
    }
}

function updateTimerStatsDisplay(stats) {
    document.getElementById('sessionsToday').textContent = stats.sessionsToday;
    
    const hours = Math.floor(stats.totalMinutes / 60);
    const minutes = stats.totalMinutes % 60;
    document.getElementById('totalFocusTime').textContent = `${hours}h ${minutes}m`;
}

function playTimerSound() {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Load timer stats on page load
function loadTimerStats() {
    const stats = getTimerStats();
    updateTimerStatsDisplay(stats);
}

// Initialize timer when timer page is shown
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('timerPage')) {
        loadTimerStats();
    }
});
