// Helper Functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getDaysUntil(date) {
    const now = new Date();
    const target = new Date(date);
    const diff = target - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getTimeUntil(date) {
    const now = new Date();
    const target = new Date(date);
    const diff = target - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

function animateNumber(element, target, duration = 1000) {
    const start = parseInt(element.textContent) || 0;
    const increment = (target - start) / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

const motivationalQuotes = [
    "Success is the sum of small efforts repeated day in and day out.",
    "The expert in anything was once a beginner.",
    "Education is the passport to the future.",
    "The beautiful thing about learning is that no one can take it away from you.",
    "Don't watch the clock; do what it does. Keep going.",
    "The secret of getting ahead is getting started.",
    "Study while others are sleeping; work while others are loafing.",
    "Your limitation—it's only your imagination."
];

function getRandomQuote() {
    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}
