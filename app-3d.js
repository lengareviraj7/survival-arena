// ===================================
// APPLICATION CONTROLLER
// Manages scroll, UI, and interactions
// ===================================

class Application {
    constructor() {
        this.quantumCore = null;
        this.scrollController = null;
        this.leaderboard = null;
        this.registrationForm = null;
        this.mobileMenu = null;
        
        this.init();
    }
    
    init() {
        // Initialize 3D scene
        this.quantumCore = new QuantumCore();
        
        // Initialize controllers
        this.scrollController = new ScrollController(this.quantumCore);
        this.leaderboard = new Leaderboard();
        this.registrationForm = new RegistrationForm();
        this.mobileMenu = new MobileMenu();
        
        // Initialize interactions
        this.initSmoothScroll();
        this.initButtonAnimations();
        
        console.log('🎮 Quantum Core initialized');
    }
    
    initSmoothScroll() {
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
    
    initButtonAnimations() {
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
}

// ===================================
// SCROLL CONTROLLER
// ===================================
class ScrollController {
    constructor(quantumCore) {
        this.quantumCore = quantumCore;
        this.quantumSection = document.getElementById('quantum-core');
        this.overlays = document.querySelectorAll('.text-overlay');
        this.navbar = document.getElementById('navbar');
        
        this.phases = [
            { start: 0, end: 0.15, overlay: 1 },
            { start: 0.15, end: 0.35, overlay: null },
            { start: 0.35, end: 0.55, overlay: 3 },
            { start: 0.55, end: 0.75, overlay: 4 },
            { start: 0.75, end: 0.90, overlay: 5 },
            { start: 0.90, end: 1.0, overlay: 6 }
        ];
        
        this.init();
    }
    
    init() {
        window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
        this.handleScroll();
    }
    
    handleScroll() {
        const scrollTop = window.pageYOffset;
        const sectionTop = this.quantumSection.offsetTop;
        const sectionHeight = this.quantumSection.offsetHeight;
        const viewportHeight = window.innerHeight;
        
        // Calculate scroll progress
        const scrollProgress = this.clamp(
            (scrollTop - sectionTop) / (sectionHeight - viewportHeight),
            0,
            1
        );
        
        // Update 3D scene
        this.quantumCore.setScrollProgress(scrollProgress);
        
        // Update text overlays
        this.updateOverlays(scrollProgress);
        
        // Update navbar
        this.updateNavbar(scrollTop);
    }
    
    updateOverlays(progress) {
        this.phases.forEach(phase => {
            if (phase.overlay === null) return;
            
            const overlay = document.querySelector(`[data-phase="${phase.overlay}"]`);
            if (!overlay) return;
            
            // Calculate fade in/out
            const fadeInDuration = 0.05;
            const fadeOutDuration = 0.05;
            const visibleDuration = phase.end - phase.start;
            
            if (progress >= phase.start && progress <= phase.end) {
                // Fade in
                if (progress < phase.start + fadeInDuration) {
                    const fadeProgress = (progress - phase.start) / fadeInDuration;
                    overlay.style.opacity = fadeProgress;
                } 
                // Fade out
                else if (progress > phase.end - fadeOutDuration) {
                    const fadeProgress = (phase.end - progress) / fadeOutDuration;
                    overlay.style.opacity = fadeProgress;
                }
                // Fully visible
                else {
                    overlay.style.opacity = 1;
                }
                overlay.classList.add('active');
            } else {
                overlay.classList.remove('active');
                overlay.style.opacity = 0;
            }
        });
    }
    
    updateNavbar(scrollTop) {
        if (scrollTop > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
    
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
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
                const eased = this.easeInOutCubic(progress);
                const currentScore = Math.floor(finalScore * eased);
                
                cell.textContent = currentScore.toLocaleString();
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };
            
            setTimeout(() => animate(), index * 50);
        });
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    startAutoUpdate() {
        setInterval(() => {
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
            const formData = new FormData(this.form);
            console.log('Registration submitted:', Object.fromEntries(formData));
            
            const container = this.form.parentElement;
            container.innerHTML = `
                <div style="text-align: center; padding: 4rem 2rem;">
                    <h2 style="color: var(--accent-green); font-size: 2.5rem; margin-bottom: 1rem;">Registration Successful</h2>
                    <p style="color: var(--text-secondary); font-size: 1.2rem;">Welcome to Survival Arena 2026. Quantum Core activated.</p>
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
// INITIALIZE APPLICATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    new Application();
});
