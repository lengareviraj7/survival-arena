// ===================================
// CYBERPUNK APPLICATION CONTROLLER
// ===================================

class CyberpunkApp {
    constructor() {
        this.scene = null;
        this.loadingProgress = 0;
        this.isLoaded = false;
        
        this.init();
    }
    
    init() {
        this.showLoadingScreen();
        this.initScene();
        this.initInteractions();
        this.initAnimations();
        this.initStats();
    }
    
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const progressBar = document.getElementById('loadingProgress');
        const percentText = document.getElementById('loadingPercent');
        
        // Simulate loading
        const loadInterval = setInterval(() => {
            this.loadingProgress += Math.random() * 15;
            
            if (this.loadingProgress >= 100) {
                this.loadingProgress = 100;
                clearInterval(loadInterval);
                
                setTimeout(() => {
                    this.hideLoadingScreen();
                }, 500);
            }
            
            progressBar.style.width = this.loadingProgress + '%';
            percentText.textContent = Math.floor(this.loadingProgress) + '%';
        }, 100);
    }
    
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.classList.add('hidden');
        this.isLoaded = true;
        
        // Trigger entrance animations
        this.playEntranceAnimations();
    }
    
    initScene() {
        this.scene = new CyberpunkScene();
    }
    
    initInteractions() {
        this.initButtonInteractions();
        this.initScrollEffects();
        this.initMouseEffects();
    }
    
    initButtonInteractions() {
        const ctaButton = document.getElementById('ctaButton');
        
        // Hover effect
        ctaButton.addEventListener('mouseenter', () => {
            gsap.to(ctaButton, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        ctaButton.addEventListener('mouseleave', () => {
            gsap.to(ctaButton, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        // Click ripple effect
        ctaButton.addEventListener('click', (e) => {
            this.createRipple(e, ctaButton);
            this.triggerSystemInitialization();
        });
    }
    
    createRipple(event, element) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    triggerSystemInitialization() {
        // Flash effect
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0, 245, 255, 0.3);
            z-index: 9998;
            pointer-events: none;
        `;
        document.body.appendChild(flash);
        
        gsap.to(flash, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => flash.remove()
        });
        
        // Trigger glitch on title
        this.triggerGlitch();
        
        // Scroll to content
        setTimeout(() => {
            document.querySelector('.content-section').scrollIntoView({
                behavior: 'smooth'
            });
        }, 300);
    }
    
    triggerGlitch() {
        const glitchElements = document.querySelectorAll('.glitch');
        
        glitchElements.forEach(element => {
            element.style.animation = 'none';
            setTimeout(() => {
                element.style.animation = '';
            }, 10);
        });
    }
    
    initScrollEffects() {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;
            const heroContainer = document.querySelector('.hero-container');
            
            // Parallax fade out
            const opacity = 1 - (scrollY / window.innerHeight);
            const scale = 1 - (scrollY / window.innerHeight) * 0.2;
            
            if (heroContainer) {
                heroContainer.style.opacity = Math.max(0, opacity);
                heroContainer.style.transform = `scale(${Math.max(0.8, scale)})`;
            }
            
            // Hide/show based on scroll direction
            if (scrollY > lastScroll && scrollY > 100) {
                // Scrolling down
                gsap.to('.hud-corners', { opacity: 0, duration: 0.3 });
            } else {
                // Scrolling up
                gsap.to('.hud-corners', { opacity: 1, duration: 0.3 });
            }
            
            lastScroll = scrollY;
        });
    }
    
    initMouseEffects() {
        // Custom cursor (optional)
        const cursor = document.createElement('div');
        cursor.classList.add('custom-cursor');
        document.body.appendChild(cursor);
        
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });
        
        // Smooth cursor follow
        const updateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';
            
            requestAnimationFrame(updateCursor);
        };
        updateCursor();
        
        // Cursor interactions
        const interactiveElements = document.querySelectorAll('button, a, .stat-item');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursor.classList.add('active');
            });
            
            element.addEventListener('mouseleave', () => {
                cursor.classList.remove('active');
            });
        });
    }
    
    initAnimations() {
        // Random glitch trigger
        setInterval(() => {
            if (Math.random() > 0.95) {
                this.triggerGlitch();
            }
        }, 3000);
        
        // Pulse stats
        this.animateStats();
    }
    
    playEntranceAnimations() {
        const timeline = gsap.timeline();
        
        // Title entrance
        timeline.from('.hero-title', {
            opacity: 0,
            y: 50,
            scale: 0.9,
            duration: 1,
            ease: 'power3.out'
        });
        
        // Subtitle
        timeline.from('.hero-subtitle', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.5');
        
        // Energy rings
        timeline.from('.energy-ring', {
            scale: 0,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'back.out(1.7)'
        }, '-=0.6');
        
        // CTA button
        timeline.from('.cta-button', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power2.out'
        }, '-=0.4');
        
        // Stats
        timeline.from('.stat-item', {
            opacity: 0,
            y: 20,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out'
        }, '-=0.4');
        
        // Scroll indicator
        timeline.from('.scroll-indicator', {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.3');
        
        // HUD corners
        timeline.from('.corner', {
            scale: 0,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'back.out(1.7)'
        }, '-=0.6');
    }
    
    initStats() {
        this.animateStatValues();
        
        // Update stats periodically
        setInterval(() => {
            this.updateStats();
        }, 3000);
    }
    
    animateStatValues() {
        // Neural sync counter
        const neuralSync = document.getElementById('neuralSync');
        const targetValue = 98.7;
        
        gsap.to({ value: 0 }, {
            value: targetValue,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function() {
                neuralSync.textContent = this.targets()[0].value.toFixed(1) + '%';
            }
        });
        
        // Users active counter
        const usersActive = document.getElementById('usersActive');
        const targetUsers = 1247;
        
        gsap.to({ value: 0 }, {
            value: targetUsers,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function() {
                usersActive.textContent = Math.floor(this.targets()[0].value).toLocaleString();
            }
        });
    }
    
    updateStats() {
        const neuralSync = document.getElementById('neuralSync');
        const usersActive = document.getElementById('usersActive');
        
        // Random fluctuation
        const currentSync = parseFloat(neuralSync.textContent);
        const newSync = currentSync + (Math.random() - 0.5) * 0.5;
        
        gsap.to({ value: currentSync }, {
            value: Math.max(95, Math.min(99.9, newSync)),
            duration: 1,
            ease: 'power2.inOut',
            onUpdate: function() {
                neuralSync.textContent = this.targets()[0].value.toFixed(1) + '%';
            }
        });
        
        // Users fluctuation
        const currentUsers = parseInt(usersActive.textContent.replace(',', ''));
        const newUsers = currentUsers + Math.floor((Math.random() - 0.5) * 50);
        
        gsap.to({ value: currentUsers }, {
            value: Math.max(1000, newUsers),
            duration: 1,
            ease: 'power2.inOut',
            onUpdate: function() {
                usersActive.textContent = Math.floor(this.targets()[0].value).toLocaleString();
            }
        });
    }
    
    animateStats() {
        // Pulse effect on stats
        gsap.to('.stat-value', {
            textShadow: '0 0 20px currentColor',
            duration: 1,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            stagger: 0.2
        });
    }
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Detect mobile
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Performance optimization for mobile
if (isMobile()) {
    document.body.classList.add('mobile');
    // Reduce particle count, disable some effects
}

// ===================================
// INITIALIZE APPLICATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const app = new CyberpunkApp();
    
    // Expose to window for debugging
    window.cyberpunkApp = app;
    
    console.log('%c🎮 CYBERPUNK SYSTEM INITIALIZED', 'color: #00F5FF; font-size: 16px; font-weight: bold;');
    console.log('%cWelcome to the Productivity Metaverse', 'color: #7B2FF7; font-size: 12px;');
});

// ===================================
// PERFORMANCE MONITORING
// ===================================

if (window.performance) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
    });
}

// ===================================
// ERROR HANDLING
// ===================================

window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
});

// ===================================
// VISIBILITY CHANGE (Performance)
// ===================================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is hidden
        console.log('Tab hidden - pausing animations');
    } else {
        // Resume animations
        console.log('Tab visible - resuming animations');
    }
});
