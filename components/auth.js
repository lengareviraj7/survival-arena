// Authentication Functions

function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email', 'error');
        return;
    }
    
    if (!validatePassword(password)) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // For demo purposes, accept any valid email/password
    const user = {
        name: email.split('@')[0],
        email: email,
        joinedDate: new Date().toISOString()
    };
    
    setCurrentUser(user);
    showNotification('Login successful!', 'success');
    
    setTimeout(() => {
        showDashboard();
    }, 500);
}

function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    if (!name || name.length < 2) {
        showNotification('Please enter your full name', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email', 'error');
        return;
    }
    
    if (!validatePassword(password)) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    const user = {
        name: name,
        email: email,
        joinedDate: new Date().toISOString()
    };
    
    setCurrentUser(user);
    showNotification('Account created successfully!', 'success');
    
    // Add welcome data
    addWelcomeData();
    
    setTimeout(() => {
        showDashboard();
    }, 500);
}

function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    
    if (!validateEmail(email)) {
        showNotification('Please enter a valid email', 'error');
        return;
    }
    
    showNotification('Password reset link sent to your email!', 'success');
    
    setTimeout(() => {
        showAuth('login');
    }, 2000);
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        clearCurrentUser();
        showNotification('Logged out successfully', 'success');
        setTimeout(() => {
            showLanding();
        }, 500);
    }
}

// Add welcome data for new users
function addWelcomeData() {
    // Add sample assignment
    addAssignment({
        title: 'Welcome to Student Productivity OS!',
        subject: 'Getting Started',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Explore the features and customize your dashboard'
    });
    
    // Add sample goal
    addGoal({
        title: 'Complete First Week',
        type: 'academic',
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: 0
    });
    
    // Add sample note
    addNote({
        title: 'Quick Tips',
        subject: 'Getting Started',
        content: '1. Add your assignments and exams\n2. Use the study timer for focused work\n3. Track your goals and progress\n4. Check analytics to see your productivity trends'
    });
}
