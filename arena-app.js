// ===================================
// ARENA APPLICATION
// ===================================

class ArenaApp {
    constructor() {
        this.scene = null;
        this.particleManager = null;
        this.arenaStructure = null;
        this.effectsManager = null;
        this.uiEffects = null;
        
        this.loadingProgress = 0;
        this.isLoaded = false;
        
        this.init();
    }
    
    init() {
        this.showLoadingScreen();
        this.initScene();
        this.initManagers();
        this.initUI();
        this.startAnimationLoop();
    }
    
    showLoadingScreen() {
        const loadingScreen = document.getElementById('loadingScreen');
        const progressBar = document.getElementById('loadingBar');
        const percentText = document.getElementById('loadingPercent');
        
        // Simulate loading with realistic progression
        const loadInterval = setInterval(() => {
            this.loadingProgress += Math.random() * 12;
            
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
        
        gsap.to(loadingScreen, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                loadingScreen.classList.add('hidden');
                this.isLoaded = true;
                this.playIntroSequence();
            }
        });
    }
    
    initScene() {
        this.scene = new ArenaScene();
    }
    
    initManagers() {
        const sceneObject = this.scene.getScene();
        
        this.particleManager = new ParticleManager(sceneObject);
        this.arenaStructure = new ArenaStructure(sceneObject);
        this.effectsManager = new EffectsManager(sceneObject);
    }
    
    initUI() {
        this.uiEffects = new UIEffects();
    }
    
    playIntroSequence() {
        const timeline = gsap.timeline();
        
        // Step 1: Dark screen (already dark)
        timeline.to({}, { duration: 0.5 });
        
        // Step 2: Red light flicker
        timeline.call(() => {
            this.flickerRedLight();
        });
        
        timeline.to({}, { duration: 1 });
        
        // Step 3: Text emerges from darkness
        timeline.call(() => {
            this.scene.revealText();
        });
        
        // Step 4: Random glitch after reveal
        timeline.to({}, { duration: 2 });
        timeline.call(() => {
            this.scene.triggerGlitch();
        });
        
        // Periodic glitch effects
        setInterval(() => {
            if (Math.random() > 0.97) {
                this.scene.triggerGlitch();
            }
        }, 3000);
    }
    
    flickerRedLight() {
        const flickers = [100, 50, 200, 100, 300];
        let delay = 0;
        
        flickers.forEach(duration => {
            setTimeout(() => {
                this.createFlash(duration);
            }, delay);
            delay += duration + 50;
        });
    }
    
    createFlash(duration) {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            inset: 0;
            background: radial-gradient(circle, rgba(255, 30, 30, 0.3), transparent);
            z-index: 9998;
            pointer-events: none;
        `;
        document.body.appendChild(flash);
        
        gsap.to(flash, {
            opacity: 0,
            duration: duration / 1000,
            onComplete: () => flash.remove()
        });
    }
    
    startAnimationLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            if (!this.isLoaded) return;
            
            const time = performance.now() * 0.001;
            
            // Update all managers
            if (this.particleManager) {
                this.particleManager.update(time);
            }
            
            if (this.arenaStructure) {
                this.arenaStructure.update(time);
            }
            
            if (this.effectsManager) {
                this.effectsManager.update(time);
            }
        };
        
        animate();
    }
}

// ===================================
// INITIALIZE ON LOAD
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    // Check WebGL support
    if (!window.WebGLRenderingContext) {
        alert('Your browser does not support WebGL. Please use a modern browser.');
        return;
    }
    
    // Initialize application
    window.arenaApp = new ArenaApp();
    
    console.log('%c⚔️ SURVIVAL ARENA 2026 INITIALIZED', 'color: #FF1E1E; font-size: 20px; font-weight: bold;');
    console.log('%cONLY ONE SURVIVES', 'color: #00E5FF; font-size: 14px;');
});

// ===================================
// PERFORMANCE MONITORING
// ===================================

if (window.performance) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Arena loaded in ${pageLoadTime}ms`);
    });
}

// ===================================
// ERROR HANDLING
// ===================================

window.addEventListener('error', (e) => {
    console.error('Arena error:', e.error);
});

// ===================================
// VISIBILITY OPTIMIZATION
// ===================================

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Arena paused');
    } else {
        console.log('Arena resumed');
    }
});

// ===================================
// MOBILE DETECTION
// ===================================

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobile()) {
    console.log('Mobile device detected - optimizing performance');
    document.body.classList.add('mobile');
}
