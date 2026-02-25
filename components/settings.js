// Settings Management

function loadSettings() {
    const settings = getSettings();
    const user = getCurrentUser();
    
    if (user) {
        document.getElementById('settingsName').value = user.name;
    }
    
    updateThemeToggle(settings.theme);
}

function toggleTheme() {
    const settings = getSettings();
    const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
    
    settings.theme = newTheme;
    saveSettings(settings);
    
    applyTheme(newTheme);
    updateThemeToggle(newTheme);
    
    showNotification(`Switched to ${newTheme} mode`, 'success');
}

function applyTheme(theme) {
    if (theme === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
}

function updateThemeToggle(theme) {
    const toggleText = document.getElementById('themeToggleText');
    if (toggleText) {
        toggleText.textContent = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
}

function updateName() {
    const newName = document.getElementById('settingsName').value;
    
    if (!newName || newName.length < 2) {
        showNotification('Please enter a valid name', 'error');
        return;
    }
    
    const user = getCurrentUser();
    if (user) {
        user.name = newName;
        setCurrentUser(user);
        updateUserProfile();
        showNotification('Name updated successfully!', 'success');
    }
}

function updatePassword() {
    const newPassword = document.getElementById('settingsPassword').value;
    
    if (!validatePassword(newPassword)) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
    
    // In a real app, this would update the password on the server
    showNotification('Password updated successfully!', 'success');
    document.getElementById('settingsPassword').value = '';
}

function resetData() {
    clearAllData();
}

// Load settings when settings page is shown
document.addEventListener('DOMContentLoaded', () => {
    const settings = getSettings();
    applyTheme(settings.theme);
});
