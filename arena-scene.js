// ===================================
// ARENA SCENE MANAGER
// ===================================

class ArenaScene {
    constructor() {
        this.canvas = document.getElementById('arena-canvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();
        
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        
        this.cameraShake = { x: 0, y: 0, intensity: 0 };
        
        this.objects = {
            floor: null,
            text3D: null,
            arena: null,
            particles: null,
            effects: null
        };
        
        this.config = {
            colors: {
                red: new THREE.Color(0xFF1E1E),
                blue: new THREE.Color(0x00E5FF),
                white: new THREE.Color(0xFFFFFF),
                black: new THREE.Color(0x000000)
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupScene();
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.createFloor();
        this.create3DText();
        this.setupEventListeners();
        this.animate();
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        this.scene.fog = new THREE.FogExp2(0x000000, 0.02);
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 3, 20);
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
    }
    
    setupLights() {
        // Ambient
        const ambient = new THREE.AmbientLight(0xffffff, 0.1);
        this.scene.add(ambient);
        
        // Main red rim light (behind text)
        const rimLight = new THREE.DirectionalLight(0xFF1E1E, 3);
        rimLight.position.set(0, 5, -10);
        rimLight.castShadow = true;
        rimLight.shadow.mapSize.width = 2048;
        rimLight.shadow.mapSize.height = 2048;
        this.scene.add(rimLight);
        
        // Blue volumetric lights
        const blueLight1 = new THREE.SpotLight(0x00E5FF, 2, 50, Math.PI / 6, 0.5, 2);
        blueLight1.position.set(-15, 20, 5);
        blueLight1.target.position.set(0, 0, 0);
        this.scene.add(blueLight1);
        this.scene.add(blueLight1.target);
        
        const blueLight2 = new THREE.SpotLight(0x00E5FF, 2, 50, Math.PI / 6, 0.5, 2);
        blueLight2.position.set(15, 20, 5);
        blueLight2.target.position.set(0, 0, 0);
        this.scene.add(blueLight2);
        this.scene.add(blueLight2.target);
        
        // Flickering arena flood lights
        this.floodLights = [];
        for (let i = 0; i < 4; i++) {
            const angle = (Math.PI * 2 / 4) * i;
            const light = new THREE.PointLight(0xFFFFFF, 1, 30);
            light.position.set(
                Math.cos(angle) * 20,
                15,
                Math.sin(angle) * 20
            );
            this.scene.add(light);
            this.floodLights.push(light);
        }
        
        // Front key light
        const keyLight = new THREE.DirectionalLight(0xffffff, 0.5);
        keyLight.position.set(0, 10, 15);
        this.scene.add(keyLight);
    }
    
    createFloor() {
        const geometry = new THREE.PlaneGeometry(100, 100, 100, 100);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                crackColor: { value: this.config.colors.red },
                crackIntensity: { value: 1.0 }
            },
            vertexShader: FloorShader.vertexShader,
            fragmentShader: FloorShader.fragmentShader,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        const floor = new THREE.Mesh(geometry, material);
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -2;
        floor.receiveShadow = true;
        
        this.scene.add(floor);
        this.objects.floor = floor;
    }
    
    create3DText() {
        // Create text using TextGeometry (simplified version using boxes for demo)
        const textGroup = new THREE.Group();
        
        // "ONLY ONE SURVIVES" as extruded geometry
        const words = [
            { text: 'ONLY', x: -12 },
            { text: 'ONE', x: -4 },
            { text: 'SURVIVES', x: 4 }
        ];
        
        words.forEach(word => {
            const letterGroup = this.createWordGeometry(word.text);
            letterGroup.position.x = word.x;
            textGroup.add(letterGroup);
        });
        
        textGroup.position.y = 0;
        textGroup.position.z = -5;
        
        this.scene.add(textGroup);
        this.objects.text3D = textGroup;
        
        // Initial animation state
        textGroup.scale.set(0, 0, 0);
        textGroup.visible = false;
    }
    
    createWordGeometry(word) {
        const group = new THREE.Group();
        const letterWidth = 1.5;
        const letterSpacing = 0.3;
        
        for (let i = 0; i < word.length; i++) {
            const geometry = new THREE.BoxGeometry(1.2, 2, 0.5);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    glowColor: { value: this.config.colors.red },
                    glowIntensity: { value: 1.5 },
                    time: { value: 0 }
                },
                vertexShader: Text3DShader.vertexShader,
                fragmentShader: Text3DShader.fragmentShader
            });
            
            const letter = new THREE.Mesh(geometry, material);
            letter.position.x = i * (letterWidth + letterSpacing);
            letter.castShadow = true;
            
            // Add edge glow
            const edgeGeometry = new THREE.EdgesGeometry(geometry);
            const edgeMaterial = new THREE.LineBasicMaterial({
                color: 0xFF1E1E,
                linewidth: 2
            });
            const edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
            letter.add(edges);
            
            group.add(letter);
        }
        
        // Center the word
        const totalWidth = word.length * (letterWidth + letterSpacing) - letterSpacing;
        group.position.x = -totalWidth / 2;
        
        return group;
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
    
    triggerCameraShake(intensity = 0.1) {
        this.cameraShake.intensity = intensity;
    }
    
    revealText() {
        if (!this.objects.text3D) return;
        
        this.objects.text3D.visible = true;
        
        gsap.to(this.objects.text3D.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 1.5,
            ease: 'back.out(1.7)'
        });
        
        gsap.to(this.objects.text3D.position, {
            z: 0,
            duration: 2,
            ease: 'power2.out'
        });
    }
    
    triggerGlitch() {
        if (!this.objects.text3D) return;
        
        const originalX = this.objects.text3D.position.x;
        const originalY = this.objects.text3D.position.y;
        
        gsap.to(this.objects.text3D.position, {
            x: originalX + (Math.random() - 0.5) * 0.5,
            y: originalY + (Math.random() - 0.5) * 0.5,
            duration: 0.05,
            yoyo: true,
            repeat: 5,
            onComplete: () => {
                this.objects.text3D.position.x = originalX;
                this.objects.text3D.position.y = originalY;
            }
        });
    }
    
    update() {
        const time = this.clock.getElapsedTime();
        
        // Smooth mouse follow
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;
        
        // Camera parallax
        this.camera.position.x = this.mouse.x * 3;
        this.camera.position.y = 3 + this.mouse.y * 2;
        
        // Cinematic forward movement
        this.camera.position.z = 20 - Math.sin(time * 0.2) * 1;
        
        // Camera shake
        if (this.cameraShake.intensity > 0) {
            this.camera.position.x += (Math.random() - 0.5) * this.cameraShake.intensity;
            this.camera.position.y += (Math.random() - 0.5) * this.cameraShake.intensity;
            this.cameraShake.intensity *= 0.9;
        }
        
        // Cinematic breathing
        this.camera.position.y += Math.sin(time * 0.5) * 0.1;
        
        this.camera.lookAt(0, 0, 0);
        
        // Update floor
        if (this.objects.floor) {
            this.objects.floor.material.uniforms.time.value = time;
        }
        
        // Update 3D text
        if (this.objects.text3D && this.objects.text3D.visible) {
            // Floating animation
            this.objects.text3D.position.y = Math.sin(time * 0.8) * 0.2;
            
            // Update shader uniforms
            this.objects.text3D.children.forEach(word => {
                word.children.forEach(letter => {
                    if (letter.material.uniforms) {
                        letter.material.uniforms.time.value = time;
                    }
                });
            });
        }
        
        // Flickering flood lights
        this.floodLights.forEach((light, index) => {
            const flicker = Math.random() > 0.95 ? Math.random() * 0.5 : 1;
            light.intensity = flicker;
            
            // Slow rotation
            const angle = time * 0.1 + (Math.PI * 2 / 4) * index;
            light.position.x = Math.cos(angle) * 20;
            light.position.z = Math.sin(angle) * 20;
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
