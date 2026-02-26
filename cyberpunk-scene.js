// ===================================
// CYBERPUNK 3D SCENE
// ===================================

class CyberpunkScene {
    constructor() {
        this.canvas = document.getElementById('cyberpunk-canvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();
        
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        
        this.objects = {
            grid: null,
            particles: null,
            floatingObjects: [],
            energyWaves: [],
            lightRays: []
        };
        
        this.config = {
            colors: {
                cyan: new THREE.Color(0x00F5FF),
                purple: new THREE.Color(0x7B2FF7),
                pink: new THREE.Color(0xFF2E9F),
                white: new THREE.Color(0xFFFFFF)
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.createInfiniteGrid();
        this.createParticleSystem();
        this.createFloatingObjects();
        this.createEnergyWaves();
        this.createLightRays();
        this.setupEventListeners();
        this.animate();
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x050816);
        this.scene.fog = new THREE.FogExp2(0x050816, 0.015);
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 5, 15);
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
    }
    
    setupLights() {
        // Ambient light
        const ambient = new THREE.AmbientLight(0xffffff, 0.2);
        this.scene.add(ambient);
        
        // Main directional light (cyan)
        const mainLight = new THREE.DirectionalLight(0x00F5FF, 1.5);
        mainLight.position.set(10, 20, 10);
        mainLight.castShadow = true;
        this.scene.add(mainLight);
        
        // Accent light (purple)
        const accentLight = new THREE.DirectionalLight(0x7B2FF7, 1);
        accentLight.position.set(-10, 15, -10);
        this.scene.add(accentLight);
        
        // Point lights for glow
        const pointLight1 = new THREE.PointLight(0xFF2E9F, 2, 50);
        pointLight1.position.set(0, 5, -10);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x00F5FF, 2, 50);
        pointLight2.position.set(0, 5, 10);
        this.scene.add(pointLight2);
    }
    
    createInfiniteGrid() {
        const gridSize = 100;
        const divisions = 50;
        
        // Custom shader grid
        const geometry = new THREE.PlaneGeometry(gridSize, gridSize, divisions, divisions);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color1: { value: this.config.colors.cyan },
                color2: { value: this.config.colors.purple },
                gridSize: { value: 20.0 },
                lineWidth: { value: 0.05 }
            },
            vertexShader: GridShader.vertexShader,
            fragmentShader: GridShader.fragmentShader,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const grid = new THREE.Mesh(geometry, material);
        grid.rotation.x = -Math.PI / 2;
        grid.position.y = -2;
        this.scene.add(grid);
        this.objects.grid = grid;
    }
    
    createParticleSystem() {
        const particleCount = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const alphas = new Float32Array(particleCount);
        const speeds = new Float32Array(particleCount);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 100;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
            
            alphas[i] = Math.random() * 0.8 + 0.2;
            speeds[i] = Math.random() * 0.5 + 0.2;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
        geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: this.config.colors.cyan },
                size: { value: 3.0 }
            },
            vertexShader: ParticleShader.vertexShader,
            fragmentShader: ParticleShader.fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        this.objects.particles = particles;
    }
    
    createFloatingObjects() {
        // Book
        const book = this.createBook();
        book.position.set(-8, 2, -5);
        this.objects.floatingObjects.push({ mesh: book, speed: 0.5, axis: 'y' });
        
        // Holographic screen
        const screen = this.createHolographicScreen();
        screen.position.set(8, 3, -8);
        this.objects.floatingObjects.push({ mesh: screen, speed: 0.3, axis: 'x' });
        
        // Laptop
        const laptop = this.createLaptop();
        laptop.position.set(-6, 1, 5);
        this.objects.floatingObjects.push({ mesh: laptop, speed: 0.4, axis: 'z' });
        
        // Task panel
        const taskPanel = this.createTaskPanel();
        taskPanel.position.set(6, 4, 3);
        this.objects.floatingObjects.push({ mesh: taskPanel, speed: 0.6, axis: 'y' });
        
        // Floating cubes
        for (let i = 0; i < 5; i++) {
            const cube = this.createGlowingCube();
            cube.position.set(
                (Math.random() - 0.5) * 20,
                Math.random() * 8 + 2,
                (Math.random() - 0.5) * 20
            );
            this.objects.floatingObjects.push({ mesh: cube, speed: Math.random() * 0.5 + 0.3, axis: 'xyz' });
        }
    }
    
    createBook() {
        const group = new THREE.Group();
        
        const geometry = new THREE.BoxGeometry(1.5, 2, 0.3);
        const material = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            metalness: 0.3,
            roughness: 0.7,
            emissive: 0x7B2FF7,
            emissiveIntensity: 0.2
        });
        const book = new THREE.Mesh(geometry, material);
        
        // Add glow edges
        const edgeGeometry = new THREE.EdgesGeometry(geometry);
        const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x7B2FF7 });
        const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
        
        group.add(book);
        group.add(edges);
        this.scene.add(group);
        
        return group;
    }
    
    createHolographicScreen() {
        const geometry = new THREE.PlaneGeometry(3, 2);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: this.config.colors.cyan },
                opacity: { value: 0.6 }
            },
            vertexShader: HologramShader.vertexShader,
            fragmentShader: HologramShader.fragmentShader,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const screen = new THREE.Mesh(geometry, material);
        this.scene.add(screen);
        
        return screen;
    }
    
    createLaptop() {
        const group = new THREE.Group();
        
        // Base
        const baseGeometry = new THREE.BoxGeometry(2, 0.1, 1.5);
        const baseMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            metalness: 0.9,
            roughness: 0.2
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        
        // Screen
        const screenGeometry = new THREE.BoxGeometry(2, 1.2, 0.05);
        const screenMaterial = new THREE.MeshStandardMaterial({
            color: 0x00F5FF,
            emissive: 0x00F5FF,
            emissiveIntensity: 0.5
        });
        const screen = new THREE.Mesh(screenGeometry, screenMaterial);
        screen.position.set(0, 0.65, -0.7);
        screen.rotation.x = -Math.PI / 6;
        
        group.add(base);
        group.add(screen);
        this.scene.add(group);
        
        return group;
    }
    
    createTaskPanel() {
        const geometry = new THREE.PlaneGeometry(2, 3);
        const material = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            transparent: true,
            opacity: 0.7,
            emissive: 0xFF2E9F,
            emissiveIntensity: 0.3
        });
        
        const panel = new THREE.Mesh(geometry, material);
        
        // Add frame
        const frameGeometry = new THREE.EdgesGeometry(geometry);
        const frameMaterial = new THREE.LineBasicMaterial({ color: 0xFF2E9F });
        const frame = new THREE.LineSegments(frameGeometry, frameMaterial);
        panel.add(frame);
        
        this.scene.add(panel);
        return panel;
    }
    
    createGlowingCube() {
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const material = new THREE.MeshStandardMaterial({
            color: 0x00F5FF,
            emissive: 0x00F5FF,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.8
        });
        
        const cube = new THREE.Mesh(geometry, material);
        this.scene.add(cube);
        
        return cube;
    }
    
    createEnergyWaves() {
        for (let i = 0; i < 3; i++) {
            const geometry = new THREE.PlaneGeometry(20, 20, 32, 32);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color1: { value: this.config.colors.cyan },
                    color2: { value: this.config.colors.purple }
                },
                vertexShader: EnergyWaveShader.vertexShader,
                fragmentShader: EnergyWaveShader.fragmentShader,
                transparent: true,
                side: THREE.DoubleSide
            });
            
            const wave = new THREE.Mesh(geometry, material);
            wave.position.z = -10 - i * 5;
            wave.rotation.x = Math.PI / 4;
            this.scene.add(wave);
            this.objects.energyWaves.push(wave);
        }
    }
    
    createLightRays() {
        for (let i = 0; i < 5; i++) {
            const geometry = new THREE.CylinderGeometry(0.05, 0.05, 30, 8);
            const material = new THREE.MeshBasicMaterial({
                color: i % 2 === 0 ? 0x00F5FF : 0x7B2FF7,
                transparent: true,
                opacity: 0.2
            });
            
            const ray = new THREE.Mesh(geometry, material);
            ray.position.set(
                (Math.random() - 0.5) * 30,
                15,
                (Math.random() - 0.5) * 30
            );
            ray.rotation.x = Math.PI / 2;
            ray.rotation.z = Math.random() * Math.PI;
            
            this.scene.add(ray);
            this.objects.lightRays.push(ray);
        }
    }
    
    setupEventListeners() {
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('resize', () => this.onResize());
    }
    
    onMouseMove(event) {
        this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    update() {
        const time = this.clock.getElapsedTime();
        
        // Smooth mouse follow
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;
        
        // Camera parallax
        this.camera.position.x = this.mouse.x * 2;
        this.camera.position.y = 5 + this.mouse.y * 2;
        this.camera.lookAt(0, 0, 0);
        
        // Cinematic forward movement
        this.camera.position.z = 15 - Math.sin(time * 0.1) * 2;
        
        // Update grid
        if (this.objects.grid) {
            this.objects.grid.material.uniforms.time.value = time;
        }
        
        // Update particles
        if (this.objects.particles) {
            this.objects.particles.material.uniforms.time.value = time;
            this.objects.particles.rotation.y = time * 0.05;
        }
        
        // Update floating objects
        this.objects.floatingObjects.forEach((obj, index) => {
            const offset = index * 2;
            
            if (obj.axis.includes('x')) {
                obj.mesh.rotation.x += 0.005 * obj.speed;
            }
            if (obj.axis.includes('y')) {
                obj.mesh.rotation.y += 0.005 * obj.speed;
                obj.mesh.position.y += Math.sin(time * obj.speed + offset) * 0.01;
            }
            if (obj.axis.includes('z')) {
                obj.mesh.rotation.z += 0.005 * obj.speed;
            }
        });
        
        // Update energy waves
        this.objects.energyWaves.forEach((wave, index) => {
            wave.material.uniforms.time.value = time + index;
            wave.position.y = Math.sin(time * 0.5 + index) * 0.5;
        });
        
        // Update light rays
        this.objects.lightRays.forEach((ray, index) => {
            ray.material.opacity = 0.1 + Math.sin(time * 2 + index) * 0.1;
        });
        
        // Update holographic screens
        this.objects.floatingObjects.forEach(obj => {
            if (obj.mesh.material && obj.mesh.material.uniforms && obj.mesh.material.uniforms.time) {
                obj.mesh.material.uniforms.time.value = time;
            }
        });
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    getScene() {
        return this.scene;
    }
    
    getCamera() {
        return this.camera;
    }
}
