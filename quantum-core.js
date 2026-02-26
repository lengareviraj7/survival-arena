// ===================================
// QUANTUM CORE 3D ENGINE
// Ultra-premium Three.js implementation
// ===================================

class QuantumCore {
    constructor() {
        this.canvas = document.getElementById('quantum-canvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.arenaCore = null;
        this.components = {};
        this.lights = {};
        this.particles = null;
        this.scrollProgress = 0;
        this.targetScrollProgress = 0;
        
        this.config = {
            phases: [
                { start: 0, end: 0.15, name: 'activation' },
                { start: 0.15, end: 0.35, name: 'disassembly' },
                { start: 0.35, end: 0.55, name: 'coreReveal' },
                { start: 0.55, end: 0.75, name: 'intelligence' },
                { start: 0.75, end: 0.90, name: 'symmetry' },
                { start: 0.90, end: 1.0, name: 'reassembly' }
            ]
        };
        
        this.init();
    }
    
    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.createQuantumArena();
        this.createParticles();
        this.setupPostProcessing();
        this.animate();
        
        // Hide loading
        setTimeout(() => {
            document.getElementById('loading').classList.add('hidden');
        }, 1000);
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x050505);
        this.scene.fog = new THREE.FogExp2(0x050505, 0.015);
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 0, 12);
        this.camera.lookAt(0, 0, 0);
    }
    
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        
        window.addEventListener('resize', () => this.onResize());
    }
    
    setupLights() {
        // Ambient base
        const ambient = new THREE.AmbientLight(0xffffff, 0.1);
        this.scene.add(ambient);
        
        // Primary rim light (cyan)
        const rimLight1 = new THREE.DirectionalLight(0x08D9D6, 1.5);
        rimLight1.position.set(5, 3, 5);
        this.scene.add(rimLight1);
        this.lights.rimLight1 = rimLight1;
        
        // Secondary rim light (magenta)
        const rimLight2 = new THREE.DirectionalLight(0xFF2E63, 1.2);
        rimLight2.position.set(-5, 2, -3);
        this.scene.add(rimLight2);
        this.lights.rimLight2 = rimLight2;
        
        // Front key light
        const keyLight = new THREE.DirectionalLight(0xffffff, 0.6);
        keyLight.position.set(0, 5, 8);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 2048;
        keyLight.shadow.mapSize.height = 2048;
        keyLight.shadow.camera.near = 0.5;
        keyLight.shadow.camera.far = 50;
        this.scene.add(keyLight);
        this.lights.keyLight = keyLight;
        
        // Spotlight sweep
        const spotlight = new THREE.SpotLight(0x08D9D6, 2, 30, Math.PI / 8, 0.5, 2);
        spotlight.position.set(0, 10, 0);
        spotlight.target.position.set(0, 0, 0);
        this.scene.add(spotlight);
        this.scene.add(spotlight.target);
        this.lights.spotlight = spotlight;
    }
    
    createQuantumArena() {
        this.arenaCore = new THREE.Group();
        
        // Outer stabilizing ring
        const ringGeometry = new THREE.TorusGeometry(3, 0.08, 16, 64);
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.9,
            roughness: 0.3,
            envMapIntensity: 0.5
        });
        const outerRing = new THREE.Mesh(ringGeometry, ringMaterial);
        outerRing.rotation.x = Math.PI / 2;
        this.arenaCore.add(outerRing);
        this.components.outerRing = outerRing;
        
        // Segmented armor panels (6 panels)
        this.components.panels = [];
        for (let i = 0; i < 6; i++) {
            const angle = (Math.PI * 2 / 6) * i;
            const panelGeometry = new THREE.BoxGeometry(0.6, 2, 0.1);
            const panelMaterial = new THREE.MeshStandardMaterial({
                color: 0x0a0a0a,
                metalness: 0.95,
                roughness: 0.2,
                emissive: 0x08D9D6,
                emissiveIntensity: 0
            });
            const panel = new THREE.Mesh(panelGeometry, panelMaterial);
            panel.position.x = Math.cos(angle) * 2.5;
            panel.position.z = Math.sin(angle) * 2.5;
            panel.rotation.y = -angle;
            this.arenaCore.add(panel);
            this.components.panels.push({ mesh: panel, angle, baseX: panel.position.x, baseZ: panel.position.z });
        }
        
        // Central quantum logic sphere
        const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
        const sphereMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x0a0a0a,
            metalness: 0.9,
            roughness: 0.1,
            transparent: true,
            opacity: 0.95,
            transmission: 0.1,
            thickness: 0.5,
            envMapIntensity: 1
        });
        const coreSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.arenaCore.add(coreSphere);
        this.components.coreSphere = coreSphere;
        
        // Inner energy sphere
        const energyGeometry = new THREE.SphereGeometry(0.85, 32, 32);
        const energyMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF2E63,
            transparent: true,
            opacity: 0
        });
        const energySphere = new THREE.Mesh(energyGeometry, energyMaterial);
        this.arenaCore.add(energySphere);
        this.components.energySphere = energySphere;
        
        // Holographic rings
        this.components.holoRings = [];
        for (let i = 0; i < 3; i++) {
            const holoRingGeometry = new THREE.TorusGeometry(1.2 + i * 0.3, 0.01, 8, 64);
            const holoRingMaterial = new THREE.MeshBasicMaterial({
                color: 0x08D9D6,
                transparent: true,
                opacity: 0
            });
            const holoRing = new THREE.Mesh(holoRingGeometry, holoRingMaterial);
            holoRing.rotation.x = Math.PI / 2;
            this.arenaCore.add(holoRing);
            this.components.holoRings.push(holoRing);
        }
        
        // Circuit veins (thin lines)
        this.components.circuitLines = [];
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 / 12) * i;
            const points = [];
            points.push(new THREE.Vector3(0, 0, 0));
            points.push(new THREE.Vector3(
                Math.cos(angle) * 1.5,
                Math.sin(angle * 2) * 0.5,
                Math.sin(angle) * 1.5
            ));
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0xFF2E63,
                transparent: true,
                opacity: 0
            });
            const line = new THREE.Line(lineGeometry, lineMaterial);
            this.arenaCore.add(line);
            this.components.circuitLines.push(line);
        }
        
        // Magnetic levitation modules (4 small cubes)
        this.components.levModules = [];
        const positions = [
            [2, 1.5, 0],
            [-2, 1.5, 0],
            [0, 1.5, 2],
            [0, 1.5, -2]
        ];
        positions.forEach(pos => {
            const moduleGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
            const moduleMaterial = new THREE.MeshStandardMaterial({
                color: 0x1a1a1a,
                metalness: 0.9,
                roughness: 0.3,
                emissive: 0x00FF88,
                emissiveIntensity: 0
            });
            const module = new THREE.Mesh(moduleGeometry, moduleMaterial);
            module.position.set(...pos);
            this.arenaCore.add(module);
            this.components.levModules.push({ mesh: module, baseY: pos[1] });
        });
        
        this.scene.add(this.arenaCore);
    }
    
    createParticles() {
        const particleCount = 500;
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
        }
        
        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x08D9D6,
            size: 0.02,
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        
        this.particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particles);
    }
    
    setupPostProcessing() {
        // Placeholder for post-processing effects
        // In production, use EffectComposer with bloom, DOF, etc.
    }
    
    updatePhase(progress) {
        const phase = this.getCurrentPhase(progress);
        
        switch(phase.name) {
            case 'activation':
                this.phaseActivation(this.getPhaseProgress(progress, phase));
                break;
            case 'disassembly':
                this.phaseDisassembly(this.getPhaseProgress(progress, phase));
                break;
            case 'coreReveal':
                this.phaseCoreReveal(this.getPhaseProgress(progress, phase));
                break;
            case 'intelligence':
                this.phaseIntelligence(this.getPhaseProgress(progress, phase));
                break;
            case 'symmetry':
                this.phaseSymmetry(this.getPhaseProgress(progress, phase));
                break;
            case 'reassembly':
                this.phaseReassembly(this.getPhaseProgress(progress, phase));
                break;
        }
    }
    
    getCurrentPhase(progress) {
        for (let phase of this.config.phases) {
            if (progress >= phase.start && progress <= phase.end) {
                return phase;
            }
        }
        return this.config.phases[0];
    }
    
    getPhaseProgress(progress, phase) {
        return (progress - phase.start) / (phase.end - phase.start);
    }
    
    phaseActivation(progress) {
        // Slow rotation, scanning light
        this.arenaCore.rotation.y = progress * 0.3;
        
        // Scanning light effect
        this.lights.spotlight.position.y = 10 - progress * 5;
        this.lights.spotlight.intensity = 2 + progress * 1;
        
        // Core glow starts
        this.components.energySphere.material.opacity = progress * 0.2;
        
        // Subtle float
        this.arenaCore.position.y = Math.sin(Date.now() * 0.0005) * 0.1;
    }
    
    phaseDisassembly(progress) {
        const eased = this.easeInOutCubic(progress);
        
        // Panels separate symmetrically
        this.components.panels.forEach((panel, i) => {
            const separation = eased * 2;
            panel.mesh.position.x = panel.baseX + Math.cos(panel.angle) * separation;
            panel.mesh.position.z = panel.baseZ + Math.sin(panel.angle) * separation;
            panel.mesh.material.emissiveIntensity = eased * 0.3;
        });
        
        // Ring expands slightly
        this.components.outerRing.scale.set(1 + eased * 0.3, 1 + eased * 0.3, 1 + eased * 0.3);
        
        // Levitation modules rise
        this.components.levModules.forEach(module => {
            module.mesh.position.y = module.baseY + eased * 1;
            module.mesh.material.emissiveIntensity = eased * 0.5;
        });
    }
    
    phaseCoreReveal(progress) {
        const eased = this.easeInOutCubic(progress);
        
        // Camera pushes closer
        const targetZ = 12 - eased * 3;
        this.camera.position.z += (targetZ - this.camera.position.z) * 0.05;
        
        // Core sphere opens (scale down slightly)
        this.components.coreSphere.scale.set(1 - eased * 0.2, 1 - eased * 0.2, 1 - eased * 0.2);
        
        // Energy sphere glows
        this.components.energySphere.material.opacity = 0.2 + eased * 0.4;
        this.components.energySphere.rotation.y += 0.01;
        
        // Holographic rings appear
        this.components.holoRings.forEach((ring, i) => {
            ring.material.opacity = eased * 0.6;
            ring.rotation.z = Date.now() * 0.0003 * (i + 1);
        });
        
        // Circuit lines glow
        this.components.circuitLines.forEach(line => {
            line.material.opacity = eased * 0.8;
        });
    }
    
    phaseIntelligence(progress) {
        const eased = this.easeInOutCubic(progress);
        
        // Levitation modules rotate
        this.components.levModules.forEach((module, i) => {
            module.mesh.rotation.y += 0.02;
            module.mesh.material.emissiveIntensity = 0.5 + eased * 0.3;
        });
        
        // Energy intensity increases
        this.components.energySphere.material.opacity = 0.6 + eased * 0.2;
        
        // Scanning beam
        this.lights.spotlight.position.y = 5 + Math.sin(Date.now() * 0.001) * 3;
        
        // Circuit pulse
        this.components.circuitLines.forEach((line, i) => {
            const pulse = Math.sin(Date.now() * 0.003 + i * 0.5);
            line.material.opacity = 0.8 + pulse * 0.2;
        });
    }
    
    phaseSymmetry(progress) {
        const eased = this.easeInOutCubic(progress);
        
        // Camera orbits 8 degrees
        const orbitAngle = eased * (Math.PI / 22.5); // 8 degrees
        const radius = 9;
        this.camera.position.x = Math.sin(orbitAngle) * radius;
        this.camera.position.z = Math.cos(orbitAngle) * radius;
        this.camera.lookAt(0, 0, 0);
        
        // Particle motion increases
        this.particles.material.opacity = 0.3 + eased * 0.3;
        this.particles.rotation.y += 0.001;
        
        // All components in perfect symmetry
        this.arenaCore.rotation.y += 0.002;
    }
    
    phaseReassembly(progress) {
        const eased = this.easeInOutCubic(progress);
        const reverse = 1 - eased;
        
        // Panels return
        this.components.panels.forEach((panel, i) => {
            const separation = reverse * 2;
            panel.mesh.position.x = panel.baseX + Math.cos(panel.angle) * separation;
            panel.mesh.position.z = panel.baseZ + Math.sin(panel.angle) * separation;
            panel.mesh.material.emissiveIntensity = reverse * 0.3;
        });
        
        // Ring contracts
        this.components.outerRing.scale.set(1 + reverse * 0.3, 1 + reverse * 0.3, 1 + reverse * 0.3);
        
        // Levitation modules descend
        this.components.levModules.forEach(module => {
            module.mesh.position.y = module.baseY + reverse * 1;
            module.mesh.material.emissiveIntensity = reverse * 0.5;
        });
        
        // Core sphere closes
        this.components.coreSphere.scale.set(1 - reverse * 0.2, 1 - reverse * 0.2, 1 - reverse * 0.2);
        
        // Energy fades
        this.components.energySphere.material.opacity = 0.2 + reverse * 0.4;
        
        // Holographic rings fade
        this.components.holoRings.forEach(ring => {
            ring.material.opacity = reverse * 0.6;
        });
        
        // Circuit lines fade
        this.components.circuitLines.forEach(line => {
            line.material.opacity = reverse * 0.8;
        });
        
        // Camera returns
        const targetZ = 9 + reverse * 3;
        this.camera.position.z += (targetZ - this.camera.position.z) * 0.05;
        this.camera.position.x += (0 - this.camera.position.x) * 0.05;
        this.camera.lookAt(0, 0, 0);
        
        // Rotation slows
        this.arenaCore.rotation.y += 0.001 * reverse;
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    lerp(start, end, t) {
        return start + (end - start) * t;
    }
    
    setScrollProgress(progress) {
        this.targetScrollProgress = Math.max(0, Math.min(1, progress));
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Smooth interpolation
        this.scrollProgress = this.lerp(this.scrollProgress, this.targetScrollProgress, 0.08);
        
        // Update phase
        this.updatePhase(this.scrollProgress);
        
        // Ambient rotation
        if (this.particles) {
            this.particles.rotation.y += 0.0002;
        }
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
