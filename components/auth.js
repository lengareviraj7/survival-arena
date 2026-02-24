// Authentication Functions
function showAuth(type) {
    document.getElementById('landingPage').classList.add('hidden');
    document.getElementById('authPage').classList.remove('hidden');
    
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('forgotForm').classList.add('hidden');
    
    if (type === 'login') {
        document.getElementById('loginForm').classList.remove('hidden');
    } else if (type === 'signup') {
        document.getElementById('signupForm').classList.remove('hidden');
    }
}

function showLanding() {
    document.getElementById('authPage').classList.add('hidden');
    document.getElementById('landingPage').classList.remove('hidden');
}

function showForgotPassword() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('signupForm').classList.add('hidden');
    document.getElementById('forgotForm').classList.remove('hidden');
}

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simple validation (in production, this would be server-side)
    const users = Storage.get('users') || [];
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        Storage.set('user', user);
        showDashboard();
    } else {
        alert('Invalid credentials. For demo, just create an account!');
    }
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    const users = Storage.get('users') || [];
    
    if (users.find(u => u.email === email)) {
        alert('Email already exists!');
        return;
    }
    
    const newUser = { id: generateId(), name, email, password };
    users.push(newUser);
    Storage.set('users', users);
    Storage.set('user', newUser);
    
    showDashboard();
}

function handleForgotPassword(event) {
    event.preventDefault();
    alert('Password reset link sent! (Demo mode)');
    showAuth('login');
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        Storage.set('user', null);
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('landingPage').classList.remove('hidden');
    }
}

function showDashboard() {
    const user = Storage.get('user');
    if (!user) return;
    
    document.getElementById('authPage').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    
    document.getElementById('userName').textContent = user.name;
    document.getElementById('welcomeName').textContent = user.name;
    document.getElementById('settingsName').value = user.name;
    
    loadDashboardData();
}
