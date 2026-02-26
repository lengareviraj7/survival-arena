// ═══════════════════════════════════════════════════
// NEXUS OS — APPLICATION CONTROLLER
// ═══════════════════════════════════════════════════

'use strict';

class NexusApp {
    constructor() {
        this.scene = null;
        this.fpsSmooth = 60;
        this.lastFpsT = performance.now();
        this.fpsF = 0;
        
        this.init();
    }
    
    init() {
        this.initIntro();
        this.initCursor();
        this.initScene();
        this.initRadar();
        this.initUI();
        this.initCounters();
        this.initTerminal();
        this.startAnimationLoop();
    }
    
    initIntro() {
        const intro = document.getElementById('intro-overlay');
        const introPct = document.getElementById('introPct');
        let pct = 0;
        
        const pctTimer = setInterval(() => {
            pct += Math.random() * 8 + 2;
            if (pct >= 100) {
                pct = 100;
                clearInterval(pctTimer);
            }
            
            const labels = [
                'INITIALIZING...',
                'LOADING KERNEL...',
                'QUANTUM SYNC...',
                'NEURAL LINK...',
                'BOOT COMPLETE'
            ];
            
            const label = labels[Math.floor(pct / 25)] || labels[4];
            introPct.textContent = pct < 100 ? `${label} ${Math.floor(pct)}%` : label;
        }, 120);
        
        setTimeout(() => {
            intro.classList.add('fade');
            setTimeout(() => intro.remove(), 1300);
        }, 3000);
    }
    
    initCursor() {
        const curRing = document.getElementById('cursor-ring');
        const curDot = document.getElementById('cursor-dot');
        let curX = window.innerWidth / 2;
        let curY = window.innerHeight / 2;
        let ringX = curX;
        let ringY = curY;
        
        window.addEventListener('mousemove', (e) => {
            curX = e.clientX;
            curY = e.clientY;
            curDot.style.left = curX + 'px';
            curDot.style.top = curY + 'px';
            
            // Trail effect
            const tr = document.createElement('div');
            tr.className = 'cursor-trail';
            const sc = Math.random() * 0.8 + 0.2;
            tr.style.cssText = `
                left:${curX}px;
                top:${curY}px;
                width:${4 * sc}px;
                height:${4 * sc}px;
                opacity:${sc * 0.6};
                background:${Math.random() > 0.5 ? 'var(--cyan)' : 'var(--purple)'}
            `;
            document.body.appendChild(tr);
            setTimeout(() => tr.remove(), 500);
        });
        
        // Hover effects
        document.querySelectorAll('a, button, .btn-holo, .feat-card').forEach(el => {
            el.addEventListener('mouseenter', () => curRing.classList.add('hover'));
            el.addEventListener('mouseleave', () => curRing.classList.remove('hover'));
        });
        
        // Smooth cursor follow
        const updateCursor = () => {
            ringX += (curX - ringX) * 0.12;
            ringY += (curY - ringY) * 0.12;
            curRing.style.left = ringX + 'px';
            curRing.style.top = ringY + 'px';
            requestAnimationFrame(updateCursor);
        };
        updateCursor();
    }
    
    initScene() {
        this.scene = new NexusScene();
    }
    
    initRadar() {
        const radarCvs = document.getElementById('radarCanvas');
        const radarCtx = radarCvs.getContext('2d');
        let radarAngle = 0;
        
        const radarBlips = Array.from({ length: 8 }, () => ({
            a: Math.random() * Math.PI * 2,
            r: Math.random() * 0.4 + 0.1,
            life: 1
        }));
        
        const drawRadar = () => {
            const cx = 45, cy = 45, R = 40;
            radarCtx.clearRect(0, 0, 90, 90);
            
            // Circles
            radarCtx.strokeStyle = 'rgba(0,245,255,0.15)';
            radarCtx.lineWidth = 1;
            [0.25, 0.5, 0.75, 1].forEach(s => {
                radarCtx.beginPath();
                radarCtx.arc(cx, cy, R * s, 0, Math.PI * 2);
                radarCtx.stroke();
            });
            
            // Cross
            radarCtx.beginPath();
            radarCtx.moveTo(cx - R, cy);
            radarCtx.lineTo(cx + R, cy);
            radarCtx.moveTo(cx, cy - R);
            radarCtx.lineTo(cx, cy + R);
            radarCtx.stroke();
            
            // Sweep
            radarCtx.save();
            radarCtx.translate(cx, cy);
            radarCtx.rotate(radarAngle);
            const sg = radarCtx.createLinearGradient(0, 0, R, 0);
            sg.addColorStop(0, 'rgba(0,245,255,0.5)');
            sg.addColorStop(1, 'rgba(0,245,255,0)');
            radarCtx.fillStyle = sg;
            radarCtx.beginPath();
            radarCtx.moveTo(0, 0);
            radarCtx.arc(0, 0, R, -0.3, 0.3);
            radarCtx.closePath();
            radarCtx.fill();
            radarCtx.restore();
            
            // Blips
            radarBlips.forEach(b => {
                const bx = cx + Math.cos(b.a) * R * b.r;
                const by = cy + Math.sin(b.a) * R * b.r;
                radarCtx.beginPath();
                radarCtx.arc(bx, by, 2, 0, Math.PI * 2);
                radarCtx.fillStyle = `rgba(0,255,136,${b.life})`;
                radarCtx.fill();
                
                b.life -= 0.008;
                if (b.life < 0) {
                    b.a = Math.random() * Math.PI * 2;
                    b.r = Math.random() * 0.4 + 0.1;
                    b.life = 0.8 + Math.random() * 0.4;
                }
            });
            
            radarAngle += 0.04;
        };
        
        setInterval(drawRadar, 50);
    }
    
    initUI() {
        // Scroll effects
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            document.getElementById('mainNav').classList.toggle('scrolled', scrollY > 50);
        }, { passive: true });
        
        // Button interactions
        document.querySelectorAll('.btn-holo').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const r = document.createElement('div');
                r.className = 'bh-ripple';
                const rect = btn.getBoundingClientRect();
                const sz = Math.max(rect.width, rect.height) * 2;
                r.style.cssText = `
                    width:${sz}px;
                    height:${sz}px;
                    left:${e.clientX - rect.left - sz / 2}px;
                    top:${e.clientY - rect.top - sz / 2}px
                `;
                btn.appendChild(r);
                setTimeout(() => r.remove(), 800);
            });
            
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, { y: -5, duration: 0.3, ease: 'power2.out' });
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
            });
        });
        
        // Feature card effects
        document.querySelectorAll('.feat-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                const mx = (e.clientX - r.left) / r.width * 100;
                const my = (e.clientY - r.top) / r.height * 100;
                card.style.setProperty('--mx', mx + '%');
                card.style.setProperty('--my', my + '%');
            });
            
            card.addEventListener('mouseenter', () => {
                gsap.to(card, { y: -8, duration: 0.3, ease: 'power2.out' });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
            });
        });
        
        // Glitch effect
        const heroT = document.getElementById('heroTitle');
        const scheduleGlitch = () => {
            setTimeout(() => {
                heroT.classList.add('glitch');
                setTimeout(() => heroT.classList.remove('glitch'), 380);
                scheduleGlitch();
            }, 5000 + Math.random() * 8000);
        };
        scheduleGlitch();
        
        // Holo panels
        setTimeout(() => {
            document.querySelectorAll('.holo-panel').forEach(p => p.classList.add('visible'));
        }, 3200);
        
        // Scroll reveal
        const revObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.style.opacity = '1';
                    e.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('[data-reveal]').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity .7s ease, transform .7s ease';
            revObs.observe(el);
        });
        
        // GSAP intro animations
        gsap.from('.warp-ring', {
            scale: 0,
            opacity: 0,
            duration: 2.5,
            stagger: 0.4,
            ease: 'power3.out',
            delay: 3.2
        });
    }
    
    initCounters() {
        const animCount = (id, target, suffix = '', dur = 2000) => {
            const el = document.getElementById(id);
            let s = null;
            
            const step = (ts) => {
                if (!s) s = ts;
                const pr = Math.min((ts - s) / dur, 1);
                const e = pr < 0.5 ? 2 * pr * pr : -1 + (4 - 2 * pr) * pr;
                el.textContent = Math.round(e * target).toLocaleString() + suffix;
                if (pr < 1) requestAnimationFrame(step);
            };
            
            requestAnimationFrame(step);
        };
        
        setTimeout(() => {
            animCount('s1', 48291);
            animCount('s2', 2143876);
            animCount('s3', 94012);
            animCount('s4', 8192);
            animCount('tasksAct', 47);
            animCount('usersOn', 2891);
            document.getElementById('nodeId').textContent = 
                Math.floor(Math.random() * 9999).toString().padStart(4, '0');
        }, 3200);
        
        // Session timer
        let secs = 0;
        setInterval(() => {
            secs++;
            const h = String(Math.floor(secs / 3600)).padStart(2, '0');
            const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
            const s = String(secs % 60).padStart(2, '0');
            document.getElementById('sessionT').textContent = `${h}:${m}:${s}`;
        }, 1000);
    }
    
    initTerminal() {
        const termLines = [
            { t: '<span class="t-green">✓</span> <span class="t-cyan">NEXUS KERNEL</span> loaded — version 4.0.2', d: 200 },
            { t: '<span class="t-green">✓</span> <span class="t-cyan">QUANTUM CORE</span> initialized — 1024 nodes active', d: 350 },
            { t: '<span class="t-green">✓</span> Neural network handshake <span class="t-muted">............</span> <span class="t-green">COMPLETE</span>', d: 500 },
            { t: '<span class="t-green">✓</span> Particle render engine <span class="t-muted">................</span> <span class="t-green">ONLINE</span>', d: 650 },
            { t: '<span class="t-pink">⚠</span> Threat pattern <span class="t-pink">SIGMA-7</span> detected — <span class="t-cyan">monitoring</span>', d: 900 },
            { t: '<span class="t-green">✓</span> Holographic UI layer <span class="t-muted">..................</span> <span class="t-green">ACTIVE</span>', d: 1100 },
            { t: '<span class="t-green">✓</span> <span class="t-cyan">ALL SYSTEMS NOMINAL</span> — NEXUS OS is fully operational', d: 2200 },
            { t: '<span class="t-muted">  Awaiting operator input...</span>', d: 2600 }
        ];
        
        const termEl = document.getElementById('t-output');
        termLines.forEach(({ t: text, d }) => {
            setTimeout(() => {
                const div = document.createElement('div');
                div.className = 't-line';
                div.innerHTML = text;
                termEl.appendChild(div);
                termEl.parentElement.scrollTop = termEl.parentElement.scrollHeight;
            }, d + 3500);
        });
    }
    
    startAnimationLoop() {
        const animate = () => {
            requestAnimationFrame(animate);
            
            // FPS counter
            this.fpsF++;
            const now = performance.now();
            if (now - this.lastFpsT > 900) {
                this.fpsSmooth = (this.fpsSmooth * 0.7) + (this.fpsF / ((now - this.lastFpsT) / 1000) * 0.3);
                document.getElementById('fpsDisp').textContent = Math.round(this.fpsSmooth);
                this.fpsF = 0;
                this.lastFpsT = now;
            }
            
            // Update HUD data
            if (Math.random() < 0.04) {
                document.getElementById('effPct').textContent = Math.floor(82 + Math.random() * 17);
                document.getElementById('hpLoad').textContent = Math.floor(45 + Math.random() * 47);
                document.getElementById('hpLoadBar').style.width = (45 + Math.random() * 47) + '%';
                document.getElementById('hpMem').textContent = Math.floor(38 + Math.random() * 40);
                document.getElementById('hpMemBar').style.width = (38 + Math.random() * 40) + '%';
            }
            
            // Update scene
            if (this.scene) {
                this.scene.update();
                this.scene.render();
            }
        };
        
        animate();
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    window.nexusApp = new NexusApp();
    console.log('%c⚡ NEXUS OS INITIALIZED', 'color: #00F5FF; font-size: 16px; font-weight: bold;');
});
