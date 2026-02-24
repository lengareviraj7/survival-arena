// Local Storage Management
const Storage = {
    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Error reading from storage:', e);
            return null;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error writing to storage:', e);
            return false;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from storage:', e);
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            console.error('Error clearing storage:', e);
            return false;
        }
    }
};

// Initialize default data structure
function initializeStorage() {
    if (!Storage.get('user')) {
        Storage.set('user', null);
    }
    if (!Storage.get('assignments')) {
        Storage.set('assignments', []);
    }
    if (!Storage.get('exams')) {
        Storage.set('exams', []);
    }
    if (!Storage.get('notes')) {
        Storage.set('notes', []);
    }
    if (!Storage.get('goals')) {
        Storage.set('goals', []);
    }
    if (!Storage.get('timerSessions')) {
        Storage.set('timerSessions', []);
    }
    if (!Storage.get('streak')) {
        Storage.set('streak', { current: 0, longest: 0, lastDate: null });
    }
    if (!Storage.get('theme')) {
        Storage.set('theme', 'dark');
    }
}
