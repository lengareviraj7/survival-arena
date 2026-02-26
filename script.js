// ===================================
// CONFIGURATION
// ===================================
const CONFIG = {
    totalFrames: 120,
    frameWidth: 1920,
    frameHeight: 1080,
    phases: [
        { start: 0, end: 0.15, overlay: 1 },
        { start: 0.15, end: 0.40, overlay: 2 },
        { start: 0.40, end: 0.65, overlay: 3 },
        { start: 0.65, end: 0.85, overlay: 4 },
        { start: 0.85, end: 1.0, overlay: 5 }
    ]
};

// ===================================
// UTILITY FUNCTIONS
// ===================================
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function lerp(start, end, t) {
    return start + (end - start) * t;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// ===================================
// CANVAS CONTROLLER
// ===================================
class CanvasController {
    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.frames = [];
        this.currentFrame = 0;
        this.targetFrame = 0;
        
        this.setupCanvas();
        this.generateFrames();
        this.render();
    }
    
    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    generateFrames() {
        // Generate procedural frames representing arena disassembly
        for (let i = 0; i < CONFIG.totalFrames; i++) {
            this.frames.push(i);
        }
    }
    
    setFrame(progress) {
        const easedProgress = easeInOutCubic(progress);
        this.targetFrame = easedProgress * (CONFIG.totalFrames - 1);
    }
    
    render() {
        // Smooth interpolation
        this.currentFrame = lerp(this.currentFrame, this.targetFrame, 0.1);
        
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        
        // Clear canvas
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, w, h);
        
        // Calculate animation progress
        const progress = this.currentFrame / (CONFIG.totalFrames - 1);
        
        // Draw arena visualization
        this.drawArena(ctx, w, h, progress);
        
        requestAnimationFrame(() => this.render());
    }
    
    drawArena(ctx, w, h, progress) {
        const centerX = w / 2;
        const centerY = h / 2;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        
        // Phase 1: Assembled (0-0.15)
        if (progress <= 0.15) {
            this.drawAssembledArena(ctx, w, h, progress / 0.15);
        }
        // Phase 2: Disassembling (0.15-0.40)
        else if (progress <= 0.40) {
            const phaseProgress = (progress - 0.15) / 0.25;
            this.drawDisassemblingArena(ctx, w, h, phaseProgress);
        }
        // Phase 3: Exposed internals (0.40-0.65)
        else if (progress <= 0.65) {
            const phaseProgress = (progress - 0.40) / 0.25;
            this.drawExposedInternals(ctx, w, h, phaseProgress);
        }
        // Phase 4: Exploded view (0.65-0.85)
        else if (progress <= 0.85) {
            const phaseProgress = (progress - 0.65) / 0.20;
            this.drawExplodedView(ctx, w, h, phaseProgress);
        }
        // Phase 5: Reassembling (0.85-1.0)
        else {
            const phaseProgress = (progress - 0.85) / 0.15;
            this.drawReassembling(ctx, w, h, phaseProgress);
        }
        
        ctx.restore();
    }
    
    drawAssembledArena(ctx, w, h, progress) {
        const size = Math.min(w, h) * 0.3;
        const opacity = Math.min(1, progress * 2);
        
        // Main structure
        ctx.strokeStyle = `rgba(8, 217, 214, ${opacity * 0.6})`;
        ctx.lineWidth = 2;
        
        // Outer ring
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner hexagon
        this.drawHexagon(ctx, 0, 0, size * 0.7, opacity);
        
        // Core
        ctx.fillStyle = `rgba(255, 46, 99, ${opacity * 0.3})`;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        gradient.addColorStop(0, `rgba(8, 217, 214, ${opacity * 0.2})`);
        gradient.addColorStop(1, 'rgba(8, 217, 214, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(-size, -size, size * 2, size * 2);
    }
    
    drawDisassemblingArena(ctx, w, h, progress) {
        const size = Math.min(w, h) * 0.3;
        const separation = progress * 100;
        
        // Outer panels separating
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i;
            const x = Math.cos(angle) * separation;
            const y = Math.sin(angle) * separation;
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            
            ctx.strokeStyle = `rgba(8, 217, 214, ${1 - progress * 0.3})`;
            ctx.lineWidth = 2;
            ctx.strokeRect(-size * 0.15, -size * 0.3, size * 0.3, size * 0.6);
            
            // Neon lines
            ctx.strokeStyle = `rgba(255, 46, 99, ${progress})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, -size * 0.2);
            ctx.lineTo(0, size * 0.2);
            ctx.stroke();
            
            ctx.restore();
        }
        
        // Core remains
        this.drawHexagon(ctx, 0, 0, size * 0.7, 1 - progress * 0.3);
    }
    
    drawExposedInternals(ctx, w, h, progress) {
        const size = Math.min(w, h) * 0.3;
        
        // Internal grid
        ctx.strokeStyle = `rgba(8, 217, 214, ${0.4 + progress * 0.4})`;
        ctx.lineWidth = 1;
        
        const gridSize = 8;
        for (let i = -gridSize; i <= gridSize; i++) {
            const offset = (i * size * 0.1);
            
            // Vertical lines
            ctx.beginPath();
            ctx.moveTo(offset, -size);
            ctx.lineTo(offset, size);
            ctx.stroke();
            
            // Horizontal lines
            ctx.beginPath();
            ctx.moveTo(-size, offset);
            ctx.lineTo(size, offset);
            ctx.stroke();
        }
        
        // Tracking modules
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 / 12) * i + progress * Math.PI * 0.1;
            const radius = size * 0.5;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            ctx.fillStyle = `rgba(255, 46, 99, ${0.6 + Math.sin(progress * Math.PI * 2 + i) * 0.4})`;
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
            
            // Connection lines
            ctx.strokeStyle = `rgba(255, 46, 99, 0.3)`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    }
    
    drawExplodedView(ctx, w, h, progress) {
        const size = Math.min(w, h) * 0.3;
        const maxSeparation = 150;
        const separation = progress * maxSeparation;
        
        // All components fully separated
        const components = [
            { x: 0, y: -separation, color: '#FF2E63', label: 'CORE' },
            { x: separation, y: 0, color: '#08D9D6', label: 'TRACKING' },
            { x: 0, y: separation, color: '#00FF88', label: 'SCORING' },
            { x: -separation, y: 0, color: '#FF2E63', label: 'LOGIC' }
        ];
        
        components.forEach((comp, i) => {
            ctx.save();
            ctx.translate(comp.x, comp.y);
            
            // Component box
            ctx.strokeStyle = comp.color;
            ctx.lineWidth = 2;
            ctx.strokeRect(-40, -40, 80, 80);
            
            // Inner detail
            ctx.strokeStyle = `${comp.color}80`;
            ctx.lineWidth = 1;
            ctx.strokeRect(-30, -30, 60, 60);
            
            // Glow
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 60);
            gradient.addColorStop(0, `${comp.color}40`);
            gradient.addColorStop(1, `${comp.color}00`);
            ctx.fillStyle = gradient;
            ctx.fillRect(-60, -60, 120, 120);
            
            ctx.restore();
            
            // Connection lines to center
            ctx.strokeStyle = `${comp.color}40`;
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(comp.x, comp.y);
            ctx.stroke();
            ctx.setLineDash([]);
        });
        
        // Central core
        ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + progress * 0.2})`;
        ctx.beginPath();
        ctx.arc(0, 0, 20, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawReassembling(ctx, w, h, progress) {
        const size = Math.min(w, h) * 0.3;
        const separation = (1 - progress) * 100;
        
        // Components coming back together
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i;
            const x = Math.cos(angle) * separation;
            const y = Math.sin(angle) * separation;
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            
            ctx.strokeStyle = `rgba(8, 217, 214, ${progress})`;
            ctx.lineWidth = 2;
            ctx.strokeRect(-size * 0.15, -size * 0.3, size * 0.3, size * 0.6);
            
            ctx.restore();
        }
        
        // Final assembled state
        if (progress > 0.7) {
            const finalProgress = (progress - 0.7) / 0.3;
            this.drawAssembledArena(ctx, w, h, finalProgress);
        }
    }
    
    drawHexagon(ctx, x, y, size, opacity) {
        ctx.strokeStyle = `rgba(8, 217, 214, ${opacity * 0.6})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const px = x + Math.cos(angle) * size;
            const py = y + Math.sin(angle) * size;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
    }
}

// ===================================
// SCROLL CONTROLLER
// ===================================
class ScrollController {
    constructor(canvasController) {
        this.canvasController = canvasController;
        this.heroSection = document.getElementById('hero-canvas');
        this.overlays = document.querySelectorAll('.text-overlay');
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.handleScroll());
        this.handleScroll(); // Initial call
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset;
        const sectionTop = this.heroSection.offsetTop;
        const sectionHeight = this.heroSection.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        // Calculate scroll progress through the hero section
        const scrollProgress = clamp(
            (scrollTop - sectionTop) / (sectionHeight - viewportHeight),
            0,
            1
        );
        
        // Update canvas
        this.canvasController.setFrame(scrollProgress);
        
        // Update text overlays
        this.updateOverlays(scrollProgress);
        
        // Update navbar
        this.updateNavbar(scrollTop);
    }
    
    updateOverlays(progress) {
        CONFIG.phases.forEach(phase => {
            const overlay = document.querySelector(`[data-phase="${phase.overlay}"]`);
            if (!overlay) return;
            
            if (progress >= phase.start && progress <= phase.end) {
                overlay.classList.add('active');
            } else {
                overlay.classList.remove('active');
            }
        });
    }
    
    updateNavbar(scrollTop) {
        const navbar = document.getElementById('navbar');
        if (scrollTop > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
}

// ===================================
// LEADERBOARD
// ===================================
class Leaderboard {
    constructor() {
        this.players = [];
        this.tbody = document.getElementById('leaderboardBody');
        
        this.generatePlayers();
        this.render();
        this.startAutoUpdate();
    }
    
    generatePlayers() {
        const names = [
            'SHADOW_STRIKER', 'APEX_HUNTER', 'VOID_WALKER', 'NEON_PHANTOM',
            'CYBER_REAPER', 'QUANTUM_BLADE', 'STEEL_VIPER', 'GHOST_PROTOCOL',
            'TITAN_FORGE', 'CRIMSON_EDGE', 'ARCTIC_WOLF', 'PLASMA_KNIGHT'
        ];
        
        this.players = names.map((name, index) => ({
            name,
            score: Math.floor(Math.random() * 5000) + 5000,
            status: Math.random() > 0.3 ? 'Active' : 'Eliminated'
        }));
        
        this.sortPlayers();
    }
    
    sortPlayers() {
        this.players.sort((a, b) => b.score - a.score);
    }
    
    render() {
        this.tbody.innerHTML = '';
        
        this.players.forEach((player, index) => {
            const row = document.createElement('tr');
            const rank = index + 1;
            
            if (rank <= 3) {
                row.classList.add('top-3', `rank-${rank}`);
            }
            
            row.innerHTML = `
                <td>${rank}</td>
                <td>${player.name}</td>
                <td class="score">${player.score.toLocaleString()}</td>
                <td class="status-${player.status.toLowerCase()}">${player.status}</td>
            `;
            
            this.tbody.appendChild(row);
        });
        
        this.animateScores();
    }
    
    animateScores() {
        const scoreCells = this.tbody.querySelectorAll('.score');
        scoreCells.forEach((cell, index) => {
            const finalScore = this.players[index].score;
            const duration = 1000;
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const currentScore = Math.floor(finalScore * easeInOutCubic(progress));
                
                cell.textContent = currentScore.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            setTimeout(() => animate(), index * 50);
        });
    }
    
    startAutoUpdate() {
        setInterval(() => {
            // Randomly update scores
            this.players.forEach(player => {
                if (player.status === 'Active') {
                    player.score += Math.floor(Math.random() * 100) - 30;
                    player.score = Math.max(0, player.score);
                }
            });
            
            this.sortPlayers();
            this.render();
        }, 5000);
    }
}

// ===================================
// REGISTRATION FORM
// ===================================
class RegistrationForm {
    constructor() {
        this.form = document.getElementById('registrationForm');
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => {
                if (input.parentElement.classList.contains('error')) {
                    this.validateField(input);
                }
            });
        });
    }
    
    validateField(input) {
        const formGroup = input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');
        let isValid = true;
        let message = '';
        
        if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }
        
        if (input.type === 'number') {
            const age = parseInt(input.value);
            if (age < 18) {
                isValid = false;
                message = 'You must be at least 18 years old';
            }
        }
        
        if (input.required && !input.value) {
            isValid = false;
            message = 'This field is required';
        }
        
        if (input.type === 'checkbox' && input.required && !input.checked) {
            isValid = false;
            message = 'You must accept the terms';
        }
        
        if (isValid) {
            formGroup.classList.remove('error');
            errorMessage.textContent = '';
        } else {
            formGroup.classList.add('error');
            errorMessage.textContent = message;
        }
        
        return isValid;
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const inputs = this.form.querySelectorAll('input');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            // Success state
            const formData = new FormData(this.form);
            console.log('Registration submitted:', Object.fromEntries(formData));
            
            // Show success message
            const container = this.form.parentElement;
            container.innerHTML = `
                <div style="text-align: center; padding: 4rem 2rem;">
                    <h2 style="color: var(--accent-green); font-size: 2.5rem; margin-bottom: 1rem;">Registration Successful</h2>
                    <p style="color: var(--text-secondary); font-size: 1.2rem;">Welcome to Survival Arena 2026. Prepare yourself.</p>
                </div>
            `;
        }
    }
}

// ===================================
// MOBILE MENU
// ===================================
class MobileMenu {
    constructor() {
        this.hamburger = document.getElementById('hamburger');
        this.mobileMenu = document.getElementById('mobileMenu');
        
        this.init();
    }
    
    init() {
        this.hamburger.addEventListener('click', () => this.toggle());
        
        // Close on link click
        const links = this.mobileMenu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => this.close());
        });
    }
    
    toggle() {
        this.mobileMenu.classList.toggle('active');
        this.hamburger.classList.toggle('active');
    }
    
    close() {
        this.mobileMenu.classList.remove('active');
        this.hamburger.classList.remove('active');
    }
}

// ===================================
// BUTTON PULSE ANIMATION
// ===================================
function initButtonAnimations() {
    const buttons = document.querySelectorAll('.btn-primary');
    
    buttons.forEach(button => {
        setInterval(() => {
            button.style.animation = 'pulse 2s ease-in-out';
            setTimeout(() => {
                button.style.animation = '';
            }, 2000);
        }, 4000);
    });
}

// ===================================
// SMOOTH SCROLL
// ===================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const canvasController = new CanvasController();
    const scrollController = new ScrollController(canvasController);
    const leaderboard = new Leaderboard();
    const registrationForm = new RegistrationForm();
    const mobileMenu = new MobileMenu();
    
    initButtonAnimations();
    initSmoothScroll();
    
    console.log('🎮 Survival Arena 2026 initialized');
});
