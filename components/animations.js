// Advanced Animation System

// Animated Cursor
class AnimatedCursor {
    constructor() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursorGlow = document.createElement('div');
        this.cursorGlow.className = 'cursor-glow';
        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorGlow);
        
        this.position = { x: 0, y: 0 };
        this.target = { x: 0, y: 0 };
        
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.target.x = e.clientX;
            this.target.y = e.clientY;
        });
        
        document.querySelectorAll('button, a, .clickable').forEach(el => {
            el.addEventListener('mouseenter', () => this.cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => this.cursor.classList.remove('hover'));
        });
        
        this.animate();
    }
    
    animate() {
        this.position.x += (this.target.x - this.position.x) * 0.15;
        this.position.y += (this.target.y - this.position.y) * 0.15;
        
        this.cursor.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
        this.cursorGlow.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
        
        requestAnimationFrame(() => this.animate());
    }
}

// Particle System
class ParticleSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.particles = [];
        this.particleCount = 50;
        this.init();
    }
    
    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
        this.animate();
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (5 + Math.random() * 10) + 's';
        this.container.appendChild(particle);
        this.particles.push(particle);
    }
    
    animate() {
        // Particles animate via CSS
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-scroll-animate]');
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });
        
        this.elements.forEach(el => observer.observe(el));
    }
}

// 3D Card Tilt Effect
class CardTilt {
    constructor(selector) {
        this.cards = document.querySelectorAll(selector);
        this.init();
    }
    
    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMove(e, card));
            card.addEventListener('mouseleave', () => this.handleLeave(card));
        });
    }
    
    handleMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    }
    
    handleLeave(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    }
}

// Animated Counter
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = Math.round(target);
            clearInterval(timer);
        } else {
            element.textContent = Math.round(current);
        }
    }, 16);
}

// Text Glow Animation
function addTextGlow(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        el.classList.add('text-glow-animate');
    });
}

// Smooth Page Transitions
class PageTransition {
    constructor() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'page-transition-overlay';
        document.body.appendChild(this.overlay);
    }
    
    async transition(callback) {
        this.overlay.classList.add('active');
        await this.wait(500);
        callback();
        await this.wait(100);
        this.overlay.classList.remove('active');
    }
    
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Floating Animation
function addFloatingAnimation(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        el.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
        el.style.animationDelay = `${index * 0.2}s`;
    });
}

// Gradient Background Animation
class AnimatedGradient {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        if (this.element) {
            this.animate();
        }
    }
    
    animate() {
        let hue = 0;
        setInterval(() => {
            hue = (hue + 1) % 360;
            this.element.style.background = `linear-gradient(135deg, 
                hsl(${hue}, 70%, 50%), 
                hsl(${(hue + 60) % 360}, 70%, 50%), 
                hsl(${(hue + 120) % 360}, 70%, 50%))`;
        }, 50);
    }
}

// Ripple Effect
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Initialize all animations
function initAnimations() {
    // Animated cursor
    if (window.innerWidth > 768) {
        new AnimatedCursor();
    }
    
    // Scroll animations
    new ScrollAnimations();
    
    // Card tilt effects
    new CardTilt('.stat-card');
    new CardTilt('.glass-card');
    new CardTilt('.feature-card');
    
    // Add floating to certain elements
    addFloatingAnimation('.feature-icon');
    
    // Text glow
    addTextGlow('.hero-title');
    
    // Ripple effect on buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', createRipple);
    });
    
    // Page transition manager
    window.pageTransition = new PageTransition();
}

// Holographic effect
function addHolographicEffect(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            el.style.setProperty('--mouse-x', x + '%');
            el.style.setProperty('--mouse-y', y + '%');
        });
    });
}

// Morph animation between sections
function morphTransition(fromElement, toElement) {
    const from = fromElement.getBoundingClientRect();
    const to = toElement.getBoundingClientRect();
    
    toElement.style.transform = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width})`;
    toElement.style.opacity = '0';
    
    requestAnimationFrame(() => {
        toElement.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        toElement.style.transform = 'translate(0, 0) scale(1)';
        toElement.style.opacity = '1';
    });
}

// Loading animation
function showLoadingAnimation() {
    const loader = document.getElementById('loadingScreen');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1500);
    }
}

// Stagger animation for lists
function staggerAnimation(selector, delay = 100) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        setTimeout(() => {
            el.style.transition = 'all 0.5s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * delay);
    });
}
