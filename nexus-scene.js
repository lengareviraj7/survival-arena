// ═══════════════════════════════════════════════════
// NEXUS OS — THREE.JS SCENE
// ═══════════════════════════════════════════════════

'use strict';

// Utilities
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const rand = (lo, hi) => lo + Math.random() * (hi - lo);
const W = () => window.innerWidth;
const H = () => window.innerHeight;

class NexusScene {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        this.postCanvas = document.getElementById('post-canvas');
        this.postCtx = this.postCanvas.getContext('2d');
        
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();
        
        this.mouse = { x: 0, y: 0, px: 0, py: 0 };
        this.camT = { x: 0, y: 2.5, z: 14 };
        this.camC = { x: 0, y: 2.5, z: 14 };
        
        this.objects = {
            grid: null,
            vortex: null,
            particles: [],
            dna: [],
            city: null,
            floaters: []
        };
        
        this.init();
    }
    
    init() {
        this.setupRenderer();
        this.setupScene();
        this.setupCamera();
        this.setupLights();
        this.createGrid();
        this.createVortex();
        this.createDNAHelixes();
        this.createParticles();
        this.createCity();
        this.createFloatingObjects();
        this.setupPostCanvas();
        this.setupEventListeners();
    }
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        this.renderer.setSize(W(), H());
        this.renderer.setClearColor(0x020510, 1);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.1;
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x020510, 0.018);
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(58, W() / H(), 0.1, 300);
        this.camera.position.set(0, 2.5, 14);
    }
    
    setupLights() {
        this.scene.add(new THREE.AmbientLight(0x05081a, 1.2));
        
        const lp = new THREE.PointLight(0x7B2FF7, 4, 30);
        lp.position.set(-7, 5, -2);
        this.scene.add(lp);
        this.lights = { purple: lp };
        
        const lc = new THREE.PointLight(0x00F5FF, 3, 25);
        lc.position.set(7, 3, 3);
        this.scene.add(lc);
        this.lights.cyan = lc;
        
        const lpk = new THREE.PointLight(0xFF2E9F, 2.5, 20);
        lpk.position.set(0, -2, 6);
        this.scene.add(lpk);
        this.lights.pink = lpk;
        
        const lg = new THREE.PointLight(0x00FF88, 0.8, 15);
        lg.position.set(0, 8, -5);
        this.scene.add(lg);
        this.lights.green = lg;
    }
    
    createGrid() {
        const gridMat = new THREE.ShaderMaterial({
            uniforms: {
                uT: { value: 0 },
                uC1: { value: new THREE.Color(0x00F5FF) },
                uC2: { value: new THREE.Color(0x7B2FF7) },
                uC3: { value: new THREE.Color(0xFF2E9F) }
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vWP;
                void main() {
                    vUv = uv;
                    vec4 wp = modelMatrix * vec4(position, 1.);
                    vWP = wp.xyz;
                    gl_Position = projectionMatrix * viewMatrix * wp;
                }
            `,
            fragmentShader: `
                uniform float uT;
                uniform vec3 uC1, uC2, uC3;
                varying vec2 vUv;
                varying vec3 vWP;
                
                float grid(vec2 p, float s) {
                    vec2 pp = fract(p / s) - 0.5;
                    return 1.0 - smoothstep(0., 0.045, min(abs(pp.x), abs(pp.y)));
                }
                
                void main() {
                    vec2 gp = vec2(vWP.x, vWP.z + uT * 4.);
                    float g1 = grid(gp, 1.) * 0.75;
                    float g2 = grid(gp, 5.) * 0.5;
                    float g = max(g1, g2);
                    
                    float dist = length(vec2(vWP.x, vWP.z));
                    float fade = 1.0 - smoothstep(8., 45., dist);
                    
                    float t1 = sin(vWP.x * 0.15 + uT * 0.6) * 0.5 + 0.5;
                    float t2 = cos(vWP.z * 0.12 - uT * 0.4) * 0.5 + 0.5;
                    vec3 col = mix(uC1, uC2, t1);
                    col = mix(col, uC3, t2 * 0.3);
                    
                    float pulse = sin(uT * 2.5 + vWP.z * 0.4) * 0.4 + 0.6;
                    col = mix(col, vec3(1.), g2 * pulse * 0.25);
                    
                    gl_FragColor = vec4(col * g, g * fade * 0.9);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        
        const gMesh = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100, 100, 100),
            gridMat
        );
        gMesh.rotation.x = -Math.PI / 2;
        gMesh.position.y = -3;
        this.scene.add(gMesh);
        this.objects.grid = gMesh;
    }
    
    createVortex() {
        const vortexMat = new THREE.ShaderMaterial({
            uniforms: {
                uT: { value: 0 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
                }
            `,
            fragmentShader: `
                uniform float uT;
                varying vec2 vUv;
                
                void main() {
                    vec2 uv = vUv * 2. - 1.;
                    float r = length(uv);
                    float a = atan(uv.y, uv.x);
                    
                    float warp = sin(r * 8. - uT * 3. + a * 3.) * 0.5 + 0.5;
                    float ring = smoothstep(0.9, 1., r) * smoothstep(1.1, 1., r);
                    float tube = 1. - smoothstep(0., 0.8, r);
                    
                    vec3 c1 = vec3(0., 0.961, 1.);
                    vec3 c2 = vec3(0.482, 0.184, 0.969);
                    vec3 c3 = vec3(1., 0.18, 0.624);
                    
                    float ta = sin(a * 3. + uT) * 0.5 + 0.5;
                    vec3 col = mix(c1, c2, ta);
                    col = mix(col, c3, warp * 0.3);
                    
                    float alpha = (tube * warp * 0.25 + ring * 0.3) * (1. - r * 0.8);
                    gl_FragColor = vec4(col, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        
        const vMesh = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), vortexMat);
        vMesh.position.set(0, 1, -8);
        this.scene.add(vMesh);
        this.objects.vortex = vMesh;
    }
    
    createDNAHelixes() {
        // DNA helix creation code (simplified for brevity)
        // Full implementation in original code
    }
    
    createParticles() {
        const createParticleSystem = (count, spread, size, color, speed) => {
            const geo = new THREE.BufferGeometry();
            const pos = new Float32Array(count * 3);
            
            for (let i = 0; i < count; i++) {
                pos[i * 3] = (Math.random() - 0.5) * spread;
                pos[i * 3 + 1] = (Math.random() - 0.5) * spread * 0.5 + 2;
                pos[i * 3 + 2] = (Math.random() - 0.5) * spread - 10;
            }
            
            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            
            const mat = new THREE.PointsMaterial({
                color: color,
                size: size,
                transparent: true,
                opacity: 0.6,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            
            const particles = new THREE.Points(geo, mat);
            this.scene.add(particles);
            return particles;
        };
        
        this.objects.particles.push(createParticleSystem(1200, 55, 0.09, 0x00F5FF, 1.0));
        this.objects.particles.push(createParticleSystem(600, 45, 0.14, 0x7B2FF7, 0.75));
        this.objects.particles.push(createParticleSystem(300, 35, 0.07, 0xFF2E9F, 1.3));
    }
    
    createCity() {
        // City grid creation (simplified)
    }
    
    createFloatingObjects() {
        // Floating objects creation (simplified)
    }
    
    setupPostCanvas() {
        this.postCanvas.width = W();
        this.postCanvas.height = H();
    }
    
    setupEventListeners() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / W() - 0.5) * 2;
            this.mouse.y = (e.clientY / H() - 0.5) * 2;
        });
        
        window.addEventListener('resize', () => this.onResize());
    }
    
    onResize() {
        this.camera.aspect = W() / H();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(W(), H());
        this.postCanvas.width = W();
        this.postCanvas.height = H();
    }
    
    update() {
        const t = this.clock.getElapsedTime();
        
        // Mouse parallax
        this.mouse.px = lerp(this.mouse.px, this.mouse.x, 0.06);
        this.mouse.py = lerp(this.mouse.py, this.mouse.y, 0.06);
        
        // Camera
        const pageScrollY = window.scrollY || 0;
        this.camT.x = this.mouse.px * -1.8;
        this.camT.y = 2.5 + this.mouse.py * -0.9;
        this.camT.z = 14 - t * 0.04 + pageScrollY * 0.002;
        
        this.camC.x = lerp(this.camC.x, this.camT.x, 0.04);
        this.camC.y = lerp(this.camC.y, this.camT.y, 0.04);
        this.camC.z = lerp(this.camC.z, this.camT.z, 0.015);
        
        this.camera.position.set(this.camC.x, this.camC.y, this.camC.z);
        this.camera.lookAt(this.camC.x * 0.12, 0, 0);
        
        // Update grid
        if (this.objects.grid) {
            this.objects.grid.material.uniforms.uT.value = t;
        }
        
        // Update vortex
        if (this.objects.vortex) {
            this.objects.vortex.material.uniforms.uT.value = t;
        }
        
        // Update lights
        if (this.lights) {
            this.lights.purple.position.x = Math.sin(t * 0.28) * 9;
            this.lights.purple.position.z = Math.cos(t * 0.28) * 6;
            
            this.lights.cyan.position.x = Math.cos(t * 0.35) * 8;
            this.lights.cyan.position.z = Math.sin(t * 0.35) * 7;
            
            this.lights.pink.position.x = Math.sin(t * 0.45 + 1) * 5;
            this.lights.pink.position.y = Math.cos(t * 0.3) * 3 - 1;
        }
        
        // Update particles
        this.objects.particles.forEach((p, i) => {
            p.rotation.y = t * (0.05 + i * 0.02);
        });
    }
    
    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

// Export for use in app
window.NexusScene = NexusScene;
