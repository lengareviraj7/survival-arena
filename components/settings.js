// Settings Management
function toggleTheme() {
    const currentTheme = Storage.get('theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    if (newTheme === 'light') {
        document.body.classList.add('light-mode');
        document.getElementById('themeToggleText').textContent = 'Switch to Dark Mode';
    } else {
        document.body.classList.remove('light-mode');
        document.getElementById('themeToggleText').textContent = 'Switch to Light Mode';
    }
    
    Storage.set('theme', newTheme);
}

function updateName() {
    const newName = document.getElementById('settingsName').value.trim();
    if (!newName) {
        alert('Please enter a valid name');
        return;
    }
    
    const user = Storage.get('user');
    if (user) {
        user.name = newName;
        Storage.set('user', user);
        
        const users = Storage.get('users') || [];
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex].name = newName;
            Storage.set('users', users);
        }
        
        document.getElementById('userName').textContent = newName;
        document.getElementById('welcomeName').textContent = newName;
        alert('Name updated successfully!');
    }
}

function updatePassword() {
    const newPassword = document.getElementById('settingsPassword').value;
    if (!newPassword || newPassword.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    const user = Storage.get('user');
    if (user) {
        user.password = newPassword;
        Storage.set('user', user);
        
        const users = Storage.get('users') || [];
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex].password = newPassword;
            Storage.set('users', users);
        }
        
        document.getElementById('settingsPassword').value = '';
        alert('Password updated successfully!');
    }
}

function resetData() {
    if (!confirm('Are you sure? This will delete ALL your data (assignments, exams, notes, goals). This cannot be undone!')) {
        return;
    }
    
    if (!confirm('Final confirmation: Delete all data?')) {
        return;
    }
    
    Storage.set('assignments', []);
    Storage.set('exams', []);
    Storage.set('notes', []);
    Storage.set('goals', []);
    Storage.set('timerSessions', []);
    Storage.set('streak', { current: 0, longest: 0, lastDate: null });
    
    alert('All data has been reset!');
    location.reload();
}
