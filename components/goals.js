// Goals Management
function loadGoals() {
    const goals = Storage.get('goals') || [];
    renderGoals(goals);
}

function renderGoals(goals) {
    const container = document.getElementById('goalsList');
    
    if (goals.length === 0) {
        container.innerHTML = '<p class="empty-state">No goals set yet</p>';
        return;
    }
    
    container.innerHTML = goals.map(g => {
        const status = getGoalStatus(g);
        return `
            <div class="goal-card">
                <div class="goal-header">
                    <h3>${g.title}</h3>
                    <span class="goal-type">${g.type === 'academic' ? '🎓 Academic' : '💡 Skill'}</span>
                </div>
                <p style="color: var(--text-secondary); margin-bottom: 0.5rem;">
                    Target: ${formatDate(g.targetDate)}
                </p>
                <div class="goal-progress">
                    <div class="goal-progress-text">
                        <span>Progress</span>
                        <span class="goal-status status-${status.class}">${status.text}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${g.progress}%"></div>
                    </div>
                    <p style="text-align: center; margin-top: 0.5rem; font-weight: 600;">${g.progress}%</p>
                </div>
                <div class="assignment-actions" style="margin-top: 1rem;">
                    <button class="btn-icon" onclick="updateGoalProgress('${g.id}')">📈</button>
                    <button class="btn-icon" onclick="editGoal('${g.id}')">✏️</button>
                    <button class="btn-icon" onclick="deleteGoal('${g.id}')">🗑️</button>
                </div>
            </div>
        `;
    }).join('');
}

function getGoalStatus(goal) {
    if (goal.progress >= 100) return { text: 'Completed', class: 'completed' };
    
    const daysLeft = getDaysUntil(goal.targetDate);
    const expectedProgress = Math.max(0, 100 - daysLeft);
    
    if (goal.progress >= expectedProgress) return { text: 'On Track', class: 'on-track' };
    return { text: 'Behind', class: 'behind' };
}

function showAddGoal() {
    document.getElementById('modalOverlay').classList.remove('hidden');
    document.getElementById('addGoalModal').classList.remove('hidden');
}

function addGoal(event) {
    event.preventDefault();
    
    const goal = {
        id: generateId(),
        title: document.getElementById('goalTitle').value,
        type: document.getElementById('goalType').value,
        targetDate: document.getElementById('goalTarget').value,
        progress: parseInt(document.getElementById('goalProgress').value),
        createdAt: new Date().toISOString()
    };
    
    const goals = Storage.get('goals') || [];
    goals.push(goal);
    Storage.set('goals', goals);
    
    closeModal();
    loadGoals();
}

function updateGoalProgress(id) {
    const goals = Storage.get('goals') || [];
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    
    const newProgress = prompt(`Update progress for "${goal.title}" (0-100):`, goal.progress);
    if (newProgress !== null) {
        goal.progress = Math.min(100, Math.max(0, parseInt(newProgress) || 0));
        Storage.set('goals', goals);
        loadGoals();
    }
}

function editGoal(id) {
    const goals = Storage.get('goals') || [];
    const goal = goals.find(g => g.id === id);
    if (!goal) return;
    
    document.getElementById('goalTitle').value = goal.title;
    document.getElementById('goalType').value = goal.type;
    document.getElementById('goalTarget').value = goal.targetDate;
    document.getElementById('goalProgress').value = goal.progress;
    
    showAddGoal();
    
    const form = document.querySelector('#addGoalModal form');
    form.onsubmit = (e) => {
        e.preventDefault();
        goal.title = document.getElementById('goalTitle').value;
        goal.type = document.getElementById('goalType').value;
        goal.targetDate = document.getElementById('goalTarget').value;
        goal.progress = parseInt(document.getElementById('goalProgress').value);
        Storage.set('goals', goals);
        closeModal();
        loadGoals();
        form.onsubmit = addGoal;
    };
}

function deleteGoal(id) {
    if (!confirm('Delete this goal?')) return;
    
    let goals = Storage.get('goals') || [];
    goals = goals.filter(g => g.id !== id);
    Storage.set('goals', goals);
    loadGoals();
}
