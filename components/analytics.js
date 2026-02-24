// Analytics and Charts
function loadAnalytics() {
    createStudyHoursChart();
    createAssignmentsChart();
    createProductivityChart();
    updatePerformanceScore();
}

function createStudyHoursChart() {
    const canvas = document.getElementById('studyHoursChart');
    const ctx = canvas.getContext('2d');
    
    const sessions = Storage.get('timerSessions') || [];
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = new Array(7).fill(0);
    
    sessions.forEach(s => {
        const day = new Date(s.date).getDay();
        data[day === 0 ? 6 : day - 1] += s.duration / 60;
    });
    
    drawBarChart(ctx, canvas, days, data, '#6366f1');
}

function createAssignmentsChart() {
    const canvas = document.getElementById('assignmentsChart');
    const ctx = canvas.getContext('2d');
    
    const assignments = Storage.get('assignments') || [];
    const completed = assignments.filter(a => a.completed).length;
    const pending = assignments.length - completed;
    
    drawPieChart(ctx, canvas, ['Completed', 'Pending'], [completed, pending], ['#22c55e', '#f59e0b']);
}

function createProductivityChart() {
    const canvas = document.getElementById('productivityChart');
    const ctx = canvas.getContext('2d');
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = [65, 72, 68, 80, 75, 85, 90];
    
    drawLineChart(ctx, canvas, days, data, '#8b5cf6');
}

function updatePerformanceScore() {
    const assignments = Storage.get('assignments') || [];
    const sessions = Storage.get('timerSessions') || [];
    const streak = Storage.get('streak') || { current: 0 };
    
    let score = 0;
    
    if (assignments.length > 0) {
        const completionRate = assignments.filter(a => a.completed).length / assignments.length;
        score += completionRate * 40;
    }
    
    score += Math.min(sessions.length * 2, 30);
    score += Math.min(streak.current * 3, 30);
    
    document.getElementById('performanceScore').textContent = Math.round(score);
}

function drawBarChart(ctx, canvas, labels, data, color) {
    const width = canvas.width = canvas.offsetWidth * 2;
    const height = canvas.height = canvas.offsetHeight * 2;
    ctx.clearRect(0, 0, width, height);
    
    const padding = 40;
    const barWidth = (width - padding * 2) / labels.length;
    const maxValue = Math.max(...data, 1);
    
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-secondary');
    ctx.font = '24px Inter';
    
    data.forEach((value, i) => {
        const barHeight = (value / maxValue) * (height - padding * 2);
        const x = padding + i * barWidth + barWidth * 0.2;
        const y = height - padding - barHeight;
        
        ctx.fillStyle = color;
        ctx.fillRect(x, y, barWidth * 0.6, barHeight);
        
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-secondary');
        ctx.fillText(labels[i], x, height - 10);
    });
}

function drawPieChart(ctx, canvas, labels, data, colors) {
    const width = canvas.width = canvas.offsetWidth * 2;
    const height = canvas.height = canvas.offsetHeight * 2;
    ctx.clearRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    
    const total = data.reduce((sum, val) => sum + val, 0);
    if (total === 0) return;
    
    let currentAngle = -Math.PI / 2;
    
    data.forEach((value, i) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = colors[i];
        ctx.fill();
        
        currentAngle += sliceAngle;
    });
    
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-primary');
    ctx.font = '28px Inter';
    ctx.textAlign = 'center';
    labels.forEach((label, i) => {
        ctx.fillStyle = colors[i];
        ctx.fillText(`${label}: ${data[i]}`, centerX, height - 40 - i * 35);
    });
}

function drawLineChart(ctx, canvas, labels, data, color) {
    const width = canvas.width = canvas.offsetWidth * 2;
    const height = canvas.height = canvas.offsetHeight * 2;
    ctx.clearRect(0, 0, width, height);
    
    const padding = 40;
    const stepX = (width - padding * 2) / (labels.length - 1);
    const maxValue = Math.max(...data, 1);
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    
    data.forEach((value, i) => {
        const x = padding + i * stepX;
        const y = height - padding - (value / maxValue) * (height - padding * 2);
        
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    
    ctx.stroke();
    
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-secondary');
    ctx.font = '24px Inter';
    labels.forEach((label, i) => {
        const x = padding + i * stepX;
        ctx.fillText(label, x - 20, height - 10);
    });
}
