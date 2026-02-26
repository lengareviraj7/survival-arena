// Goals Management

function loadGoals() {
    const goals = getGoals();
    renderGoals(goals);
}

function renderGoals(goals) {
    const container = document.getElementById('goalsList');
    
    if (goals.length === 0) {
        container.innerHTML = '<p class="empty-state">No goals set yet</p>';
        return;
    }
    
    container.innerHTML = goals.map(goal => {
        const progress = goal.progress || 0;
        const status = getGoalStatus(goal);
        
        return `
            <div class="goal-card" data-id="${goal.id}">
                <div class="goal-header">
                    <div>
                        <h3>${escapeHtml(goal.title)}</h3>
                        <span class="goal-type">${goal.type === 'academic' ? '🎓 Academic' : '💡 Skill'}</span>
                    </div>
                    <button class="btn-icon" onclick="deleteGoalConfirm('${goal.id}')" title="Delete">🗑️</button>
                </div>
                <p class="goal-target">Target: ${formatDate(goal.targetDate)}</p>
                <div class="goal-progress">
                    <div class="goal-progress-text">
                        <span>Progress</span>
                        <span class="goal-status status-${status.toLowerCase().replace(' ', '-')}">${status}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="goal-progress-controls">
                        <input type="range" min="0" max="100" value="${progress}" 
                               onchange="updateGoalProgress('${goal.id}', this.value)"
                               class="progress-slider">
                        <span class="progress-value">${progress}%</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    staggerAnimation('.goal-card', 50);
}

function getGoalStatus(goal) {
    const progress = goal.progress || 0;
    const daysUntil = getDaysUntil(goal.targetDate);
    
    if (progress >= 100) return 'Completed';
    if (daysUntil < 0) return 'Overdue';
    
    const expectedProgress = Math.max(0, 100 - (daysUntil * 2));
    
    if (progress >= expectedProgress) return 'On Track';
    if (progress >= expectedProgress * 0.7) return 'Behind';
    return 'At Risk';
}

function addGoal(event) {
    event.preventDefault();
    
    const title = document.getElementById('goalTitle').value;
    const type = document.getElementById('goalType').value;
    const targetDate = document.getElementById('goalTarget').value;
    const progress = parseInt(document.getElementById('goalProgress').value) || 0;
    
    const goal = {
        title,
        type,
        targetDate,
        progress
    };
    
    addGoal(goal);
    showNotification('Goal added successfully!', 'success');
    
    closeModal();
    loadGoals();
    loadDashboardData();
    
    event.target.reset();
}

function updateGoalProgress(id, progress) {
    updateGoal(id, { progress: parseInt(progress) });
    loadGoals();
    loadDashboardData();
    
    if (parseInt(progress) === 100) {
        showNotification('Goal completed! 🎉', 'success');
    }
}

function deleteGoalConfirm(id) {
    if (confirm('Are you sure you want to delete this goal?')) {
        deleteGoal(id);
        showNotification('Goal deleted', 'info');
        loadGoals();
        loadDashboardData();
    }
}
