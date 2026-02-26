// Helper Functions

// Date Formatting
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options);
}

function getTimeUntil(dateString) {
    const now = new Date();
    const target = new Date(dateString);
    const diff = target - now;
    
    if (diff < 0) return 'Overdue';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} left`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} left`;
    } else {
        return 'Due soon';
    }
}

function getDaysUntil(dateString) {
    const now = new Date();
    const target = new Date(dateString);
    const diff = target - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// String Utilities
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Color Utilities
function getSubjectColor(subject) {
    const colors = {
        'math': '#6366f1',
        'science': '#8b5cf6',
        'english': '#ec4899',
        'history': '#f59e0b',
        'computer': '#10b981',
        'art': '#f43f5e',
        'music': '#8b5cf6',
        'physics': '#3b82f6',
        'chemistry': '#06b6d4',
        'biology': '#10b981'
    };
    
    const subjectLower = subject.toLowerCase();
    for (const [key, color] of Object.entries(colors)) {
        if (subjectLower.includes(key)) {
            return color;
        }
    }
    
    // Default color
    return '#6366f1';
}

// Progress Calculation
function calculateProgress(current, total) {
    if (total === 0) return 0;
    return Math.round((current / total) * 100);
}

function getProgressStatus(progress) {
    if (progress >= 80) return 'On Track';
    if (progress >= 50) return 'Behind';
    return 'At Risk';
}

// Sorting
function sortByDate(items, dateField, ascending = true) {
    return items.sort((a, b) => {
        const dateA = new Date(a[dateField]);
        const dateB = new Date(b[dateField]);
        return ascending ? dateA - dateB : dateB - dateA;
    });
}

function sortByProperty(items, property, ascending = true) {
    return items.sort((a, b) => {
        if (ascending) {
            return a[property] > b[property] ? 1 : -1;
        } else {
            return a[property] < b[property] ? 1 : -1;
        }
    });
}

// Filtering
function filterBySearch(items, searchTerm, fields) {
    const term = searchTerm.toLowerCase();
    return items.filter(item => {
        return fields.some(field => {
            const value = item[field];
            return value && value.toString().toLowerCase().includes(term);
        });
    });
}

// Statistics
function calculateAverage(numbers) {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((a, b) => a + b, 0);
    return Math.round(sum / numbers.length);
}

function calculateProductivityScore() {
    const assignments = getAssignments();
    const goals = getGoals();
    const timerStats = getTimerStats();
    
    let score = 0;
    
    // Completed assignments (40%)
    const completedAssignments = assignments.filter(a => a.completed).length;
    const totalAssignments = assignments.length;
    if (totalAssignments > 0) {
        score += (completedAssignments / totalAssignments) * 40;
    }
    
    // Goals progress (30%)
    if (goals.length > 0) {
        const avgGoalProgress = goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length;
        score += (avgGoalProgress / 100) * 30;
    }
    
    // Study time (30%)
    const weeklyMinutes = timerStats.totalMinutes || 0;
    const targetMinutes = 7 * 60; // 1 hour per day
    score += Math.min((weeklyMinutes / targetMinutes) * 30, 30);
    
    return Math.round(score);
}

// Notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        padding: 1rem 2rem;
        background: var(--glass-bg);
        border: 1px solid var(--glass-border);
        border-radius: 12px;
        backdrop-filter: blur(10px);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Generate ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Format time for timer
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Get greeting based on time
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
}

// Check if date is today
function isToday(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
}

// Check if date is this week
function isThisWeek(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return date >= weekAgo && date <= today;
}

// Get week number
function getWeekNumber(date = new Date()) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Random color generator
function getRandomColor() {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Copy to clipboard
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showNotification('Copied to clipboard!', 'success');
    } catch (err) {
        showNotification('Failed to copy', 'error');
    }
}

// Download as file
function downloadAsFile(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
