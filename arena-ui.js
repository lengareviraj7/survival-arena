// ===================================
// UI EFFECTS & INTERACTIONS
// ===================================

class UIEffects {
    constructor() {
        this.button = document.getElementById('arenaButton');
        this.stats = {
            players: document.getElementById('activePlayers'),
            survival: document.getElementById('survivalRate')
        };
        
        this.init();
    }
    
    init() {
        this.initButtonEffects();
        this.initStatsAnimation();
        this.initMouseEffects();
    }
    
    initButtonEffects() {
        // Hover effect
        this.button.addEventListener('mouseenter', () => {
            gsap.to(this.button, {
                y: -10,
                duration: 0.3,
                ease: 'power2.out'
            });
            
            // Trigger particle effect in 3D scene
            if (window.arenaApp && window.arenaApp.particleManager) {
                window.arenaApp.particleManager.createSpark(new THREE.Vector3(0, -1, 5));
            }
        });
        
        this.button.addEventListener('mouseleave', () => {
            gsap.to(this.button, {
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        // Click effect
        this.button.addEventListener('click', (e) => {
            this.createRipple(e);
            this.triggerShockwave();
            this.triggerScreenFlash();
            this.triggerCameraShake();
        });
    }
    
    createRipple(event) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        
        const rect = this.button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 2;
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    triggerShockwave() {
        const shockwave = document.createElement('div');
        shockwave.classList.add('shockwave');
        document.body.appendChild(shockwave);
        
        setTimeout(() => shockwave.remove(), 800);
        
        // Trigger 3D shockwave
        if (window.arenaApp && window.arenaApp.effectsManager) {
            window.arenaApp.effectsManager.createShockwave(new THREE.Vector3(0, 0, 0));
        }
    }
    
    triggerScreenFlash() {
        if (window.arenaApp && window.arenaApp.effectsManager) {
            window.arenaApp.effectsManager.createScreenFlash();
        }
    }
    
    triggerCameraShake() {
        if (window.arenaApp && window.arenaApp.scene) {
            window.arenaApp.scene.triggerCameraShake(0.3);
        }
        
        // UI shake
        document.body.classList.add('camera-shake');
        setTimeout(() => {
            document.body.classList.remove('camera-shake');
        }, 500);
    }
    
    initStatsAnimation() {
        // Animate stats on load
        this.animateCounter(this.stats.players, 0, 1247, 2000);
        this.animateCounter(this.stats.survival, 0, 3.2, 2000, '%');
        
        // Periodic updates
        setInterval(() => {
            this.updateStats();
        }, 5000);
    }
    
    animateCounter(element, start, end, duration, suffix = '') {
        const startTime = Date.now();
        
        const update = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const eased = this.easeOutCubic(progress);
            const current = start + (end - start) * eased;
            
            if (suffix === '%') {
                element.textContent = current.toFixed(1) + suffix;
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };
        
        update();
    }
    
    updateStats() {
        const currentPlayers = parseInt(this.stats.players.textContent.replace(',', ''));
        const newPlayers = currentPlayers + Math.floor((Math.random() - 0.5) * 50);
        
        const currentSurvival = parseFloat(this.stats.survival.textContent);
        const newSurvival = Math.max(1, Math.min(5, currentSurvival + (Math.random() - 0.5) * 0.5));
        
        this.animateCounter(this.stats.players, currentPlayers, newPlayers, 1000);
        this.animateCounter(this.stats.survival, currentSurvival, newSurvival, 1000, '%');
    }
    
    initMouseEffects() {
        // Parallax tilt on text
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            
            const titleContainer = document.getElementById('title-container');
            if (titleContainer) {
                gsap.to(titleContainer, {
                    rotationY: x * 5,
                    rotationX: -y * 5,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });
    }
    
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
}
