// Analytics and Charts

function loadAnalytics() {
    renderStudyHoursChart();
    renderAssignmentsChart();
    renderProductivityChart();
    updatePerformanceScore();
}

function renderStudyHoursChart() {
    const canvas = document.getElementById('studyHoursChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    // Sample data for the week
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = [2, 3, 1.5, 4, 2.5, 3, 2];
    
    drawBarChart(ctx, width, height, days, hours, 'Study Hours');
}

function renderAssignmentsChart() {
    const canvas = document.getElementById('assignmentsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    const assignments = getAssignments();
    const completed = assignments.filter(a => a.completed).length;
    const pending = assignments.length - completed;
    
    drawPieChart(ctx, width, height, [completed, pending], ['Completed', 'Pending']);
}

function renderProductivityChart() {
    const canvas = document.getElementById('productivityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    
    // Sample productivity trend data
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    const scores = [65, 72, 78, 85];
    
    drawLineChart(ctx, width, height, weeks, scores, 'Productivity %');
}

function updatePerformanceScore() {
    const score = calculateProductivityScore();
    const scoreElement = document.getElementById('performanceScore');
    if (scoreElement) {
        animateCounter(scoreElement, score, 2000);
    }
}

// Chart Drawing Functions
function drawBarChart(ctx, width, height, labels, data, title) {
    ctx.clearRect(0, 0, width, height);
    
    const padding = 40;
    const barWidth = (width - padding * 2) / data.length;
    const maxValue = Math.max(...data);
    const chartHeight = height - padding * 2;
    
    // Draw bars
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + index * barWidth + barWidth * 0.2;
        const y = height - padding - barHeight;
        
        // Gradient
        const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
        gradient.addColorStop(0, '#6366f1');
        gradient.addColorStop(1, '#8b5cf6');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth * 0.6, barHeight);
        
        // Labels
        ctx.fillStyle = '#a0a0b0';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(labels[index], x + barWidth * 0.3, height - padding + 20);
        ctx.fillText(value + 'h', x + barWidth * 0.3, y - 10);
    });
}

function drawPieChart(ctx, width, height, data, labels) {
    ctx.clearRect(0, 0, width, height);
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    
    const total = data.reduce((a, b) => a + b, 0);
    const colors = ['#6366f1', '#ec4899'];
    
    let currentAngle = -Math.PI / 2;
    
    data.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        
        ctx.fillStyle = colors[index];
        ctx.fill();
        
        // Label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius + 30);
        const labelY = centerY + Math.sin(labelAngle) * (radius + 30);
        
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(`${labels[index]}: ${value}`, labelX, labelY);
        
        currentAngle += sliceAngle;
    });
}

function drawLineChart(ctx, width, height, labels, data, title) {
    ctx.clearRect(0, 0, width, height);
    
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const maxValue = Math.max(...data);
    const pointSpacing = chartWidth / (data.length - 1);
    
    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 3;
    
    data.forEach((value, index) => {
        const x = padding + index * pointSpacing;
        const y = height - padding - (value / maxValue) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    // Draw points
    data.forEach((value, index) => {
        const x = padding + index * pointSpacing;
        const y = height - padding - (value / maxValue) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#6366f1';
        ctx.fill();
        
        // Labels
        ctx.fillStyle = '#a0a0b0';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(labels[index], x, height - padding + 20);
        ctx.fillText(value + '%', x, y - 15);
    });
}

// Resize charts on window resize
window.addEventListener('resize', debounce(() => {
    if (!document.getElementById('analyticsPage').classList.contains('hidden')) {
        loadAnalytics();
    }
}, 300));
