// Main Application Controller

// Initialize app on load
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Show loading animation
    showLoadingAnimation();
    
    // Check if user is logged in
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        // User is logged in, show dashboard
        showDashboard();
    } else {
        // Show landing page
        showLanding();
    }
    
    // Initialize animations after a short delay
    setTimeout(() => {
        initAnimations();
        init3DScenes();
        new ParticleSystem('particleContainer');
    }, 100);
}

// Navigation Functions
function showLanding() {
    document.getElementById('landingPage').classList.remove('hidden');
    document.getElementById('authPage').classList.add('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

function showAuth(type) {
    if (window.pageTransition) {
        window.pageTransition.transition(() => {
            document.getElementById('landingPage').classList.add('hidden');
            document.getElementById('authPage').classList.remove('hidden');
            document.getElementById('dashboard').classList.add('hidden');
            
            // Show correct form
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('signupForm').classList.add('hidden');
            document.getElementById('forgotForm').classList.add('hidden');
            
            if (type === 'login') {
                document.getElementById('loginForm').classList.remove('hidden');
            } else if (type === 'signup') {
                document.getElementById('signupForm').classList.remove('hidden');
            }
        });
    }
}

function showForgotPassword() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('forgotForm').classList.remove('hidden');
}

function showDashboard() {
    if (window.pageTransition) {
        window.pageTransition.transition(() => {
            document.getElementById('landingPage').classList.add('hidden');
            document.getElementById('authPage').classList.add('hidden');
            document.getElementById('dashboard').classList.remove('hidden');
            
            // Load dashboard data
            loadDashboardData();
            updateUserProfile();
        });
    }
}

// Section Navigation
function showSection(sectionName) {
    // Update page title
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
    
    document.getElementById('pageTitle').textContent = titles[sectionName] || sectionName;
    
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Show selected section
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
    
    document.getElementById(sectionMap[sectionName]).classList.remove('hidden');
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // Load section-specific data
    if (sectionName === 'dashboard') {
        loadDashboardData();
    } else if (sectionName === 'assignments') {
        loadAssignments();
    } else if (sectionName === 'exams') {
        loadExams();
    } else if (sectionName === 'notes') {
        loadNotes();
    } else if (sectionName === 'goals') {
        loadGoals();
    } else if (sectionName === 'analytics') {
        loadAnalytics();
    }
}

// Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('collapsed');
    sidebar.classList.toggle('active');
}

// Modal Functions
function closeModal() {
    document.getElementById('modalOverlay').classList.add('hidden');
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.add('hidden');
    });
}

function showModal(modalId) {
    document.getElementById('modalOverlay').classList.remove('hidden');
    document.getElementById(modalId).classList.remove('hidden');
}

function showAddAssignment() {
    showModal('addAssignmentModal');
}

function showAddExam() {
    showModal('addExamModal');
}

function showAddNote() {
    showModal('addNoteModal');
}

function showAddGoal() {
    showModal('addGoalModal');
}

// Update user profile display
function updateUserProfile() {
    const user = getCurrentUser();
    if (user) {
        document.getElementById('userName').textContent = user.name;
        document.getElementById('welcomeName').textContent = user.name;
    }
}

// Motivational quotes
const quotes = [
    "Success is the sum of small efforts repeated day in and day out.",
    "The expert in anything was once a beginner.",
    "Education is the passport to the future.",
    "The beautiful thing about learning is that no one can take it away from you.",
    "Don't watch the clock; do what it does. Keep going.",
    "The secret of getting ahead is getting started.",
    "Study while others are sleeping; work while others are loafing."
];

function updateMotivationalQuote() {
    const quoteElement = document.getElementById('motivationalQuote');
    if (quoteElement) {
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteElement.textContent = randomQuote;
    }
}

// Update quote every 30 seconds
setInterval(updateMotivationalQuote, 30000);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-input:not(.hidden)');
        if (searchInput) searchInput.focus();
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Auto-save functionality
let autoSaveTimer;
function triggerAutoSave() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        console.log('Auto-saving data...');
        // Data is saved via localStorage in individual components
    }, 1000);
}

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`Page loaded in ${pageLoadTime}ms`);
    });
}

// Service Worker for offline support (future enhancement)
if ('serviceWorker' in navigator) {
    // Uncomment when service worker is ready
    // navigator.serviceWorker.register('/sw.js');
}
