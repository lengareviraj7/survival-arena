// 3D Scene Manager using Three.js
class Scene3D {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);
        
        this.camera.position.z = 5;
        
        // Add lights
        const ambientLight = new THREE.AmbientLight(0x6366f1, 0.5);
        this.scene.add(ambientLight);
        
        const pointLight1 = new THREE.PointLight(0x8b5cf6, 1, 100);
        pointLight1.position.set(5, 5, 5);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0xec4899, 0.8, 100);
        pointLight2.position.set(-5, -5, 5);
        this.scene.add(pointLight2);
        
        // Mouse tracking
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
        
        window.addEventListener('resize', () => this.onResize());
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Smooth camera follow mouse
        this.targetRotation.x += (this.mouse.y * 0.1 - this.targetRotation.x) * 0.05;
        this.targetRotation.y += (this.mouse.x * 0.1 - this.targetRotation.y) * 0.05;
        
        this.camera.position.x = this.targetRotation.y;
        this.camera.position.y = this.targetRotation.x;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Hero 3D Scene
class HeroScene extends Scene3D {
    constructor() {
        super('hero3d');
        this.createStudyDesk();
        this.createFloatingElements();
        this.createParticles();
        this.animate();
    }

    createStudyDesk() {
        // Desk
        const deskGeometry = new THREE.BoxGeometry(4, 0.1, 2);
        const deskMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2a2a3a,
            roughness: 0.7,
            metalness: 0.3
        });
        const desk = new THREE.Mesh(deskGeometry, deskMaterial);
        desk.position.y = -1;
        this.scene.add(desk);

        // Laptop
        const laptopBase = new THREE.BoxGeometry(1.5, 0.05, 1);
        const laptopScreen = new THREE.BoxGeometry(1.5, 1, 0.05);
        const laptopMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x1a1a2e,
            emissive: 0x6366f1,
            emissiveIntensity: 0.2
        });
        
        const laptop = new THREE.Group();
        const base = new THREE.Mesh(laptopBase, laptopMaterial);
        const screen = new THREE.Mesh(laptopScreen, laptopMaterial);
        screen.position.y = 0.5;
        screen.position.z = -0.5;
        screen.rotation.x = -0.3;
        
        laptop.add(base);
        laptop.add(screen);
        laptop.position.set(0, -0.9, 0);
        this.scene.add(laptop);

        // Glowing screen effect
        const screenLight = new THREE.PointLight(0x6366f1, 1, 3);
        screenLight.position.set(0, -0.4, 0.5);
        this.scene.add(screenLight);

        // Books stack
        this.createBooks();
    }

    createBooks() {
        const bookColors = [0x6366f1, 0x8b5cf6, 0xec4899, 0xf59e0b];
        const booksGroup = new THREE.Group();
        
        for (let i = 0; i < 4; i++) {
            const bookGeometry = new THREE.BoxGeometry(0.6, 0.15, 0.8);
            const bookMaterial = new THREE.MeshStandardMaterial({ 
                color: bookColors[i],
                roughness: 0.8
            });
            const book = new THREE.Mesh(bookGeometry, bookMaterial);
            book.position.y = i * 0.16;
            book.rotation.y = (Math.random() - 0.5) * 0.2;
            booksGroup.add(book);
        }
        
        booksGroup.position.set(-1.5, -0.5, 0);
        this.scene.add(booksGroup);
        this.booksGroup = booksGroup;
    }

    createFloatingElements() {
        // Holographic stats cards
        this.floatingCards = [];
        const cardPositions = [
            { x: 2, y: 0.5, z: -1 },
            { x: -2, y: 1, z: -1 },
            { x: 2.5, y: -0.5, z: -2 }
        ];

        cardPositions.forEach((pos, i) => {
            const cardGeometry = new THREE.PlaneGeometry(0.8, 0.5);
            const cardMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x6366f1,
                transparent: true,
                opacity: 0.3,
                emissive: 0x6366f1,
                emissiveIntensity: 0.5,
                side: THREE.DoubleSide
            });
            const card = new THREE.Mesh(cardGeometry, cardMaterial);
            card.position.set(pos.x, pos.y, pos.z);
            card.userData.initialY = pos.y;
            card.userData.floatSpeed = 0.5 + Math.random() * 0.5;
            this.scene.add(card);
            this.floatingCards.push(card);
        });
    }

    createParticles() {
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 200;
        const positions = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 20;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particlesMaterial = new THREE.PointsMaterial({
            color: 0x6366f1,
            size: 0.05,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(particlesGeometry, particlesMaterial);
        this.scene.add(this.particles);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Rotate books slightly
        if (this.booksGroup) {
            this.booksGroup.rotation.y = Math.sin(time * 0.3) * 0.1;
        }
        
        // Float cards
        this.floatingCards.forEach(card => {
            card.position.y = card.userData.initialY + Math.sin(time * card.userData.floatSpeed) * 0.3;
            card.rotation.y = Math.sin(time * 0.5) * 0.2;
        });
        
        // Rotate particles
        if (this.particles) {
            this.particles.rotation.y = time * 0.05;
        }
        
        // Smooth camera follow
        this.targetRotation.x += (this.mouse.y * 0.2 - this.targetRotation.x) * 0.05;
        this.targetRotation.y += (this.mouse.x * 0.2 - this.targetRotation.y) * 0.05;
        
        this.camera.position.x = this.targetRotation.y * 2;
        this.camera.position.y = this.targetRotation.x * 2;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Study Environment Scene
class StudyEnvironmentScene extends Scene3D {
    constructor() {
        super('studyEnvironment3d');
        this.createStudyRoom();
        this.createFloatingBooks();
        this.createClock();
        this.createTaskCards();
        this.createProgressRing();
        this.animate();
    }

    createStudyRoom() {
        // Table
        const tableGeometry = new THREE.BoxGeometry(5, 0.15, 3);
        const tableMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x3a3a4a,
            roughness: 0.6
        });
        const table = new THREE.Mesh(tableGeometry, tableMaterial);
        table.position.y = -1.5;
        this.scene.add(table);

        // Warm lamp light
        const lampLight = new THREE.PointLight(0xffa500, 1.5, 10);
        lampLight.position.set(0, 2, 0);
        this.scene.add(lampLight);

        // Student (simple low poly)
        this.createStudent();
    }

    createStudent() {
        const student = new THREE.Group();
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const skinMaterial = new THREE.MeshStandardMaterial({ color: 0xffdbac });
        const head = new THREE.Mesh(headGeometry, skinMaterial);
        head.position.y = 0.5;
        student.add(head);
        
        // Body
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 0.8, 16);
        const shirtMaterial = new THREE.MeshStandardMaterial({ color: 0x6366f1 });
        const body = new THREE.Mesh(bodyGeometry, shirtMaterial);
        student.add(body);
        
        student.position.set(-2, -1, 0);
        this.scene.add(student);
        this.student = student;
    }

    createFloatingBooks() {
        this.floatingBooks = [];
        const bookColors = [0x6366f1, 0x8b5cf6, 0xec4899];
        
        for (let i = 0; i < 5; i++) {
            const bookGeometry = new THREE.BoxGeometry(0.4, 0.6, 0.1);
            const bookMaterial = new THREE.MeshStandardMaterial({ 
                color: bookColors[i % bookColors.length],
                roughness: 0.7
            });
            const book = new THREE.Mesh(bookGeometry, bookMaterial);
            book.position.set(
                (Math.random() - 0.5) * 4,
                Math.random() * 2,
                (Math.random() - 0.5) * 2
            );
            book.userData.floatSpeed = 0.3 + Math.random() * 0.4;
            book.userData.initialY = book.position.y;
            this.scene.add(book);
            this.floatingBooks.push(book);
        }
    }

    createClock() {
        const clockGroup = new THREE.Group();
        
        // Clock face
        const faceGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
        const faceMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x2a2a3a,
            emissive: 0x6366f1,
            emissiveIntensity: 0.2
        });
        const face = new THREE.Mesh(faceGeometry, faceMaterial);
        face.rotation.x = Math.PI / 2;
        clockGroup.add(face);
        
        // Hour hand
        const hourGeometry = new THREE.BoxGeometry(0.05, 0.3, 0.02);
        const handMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        this.hourHand = new THREE.Mesh(hourGeometry, handMaterial);
        this.hourHand.position.z = 0.06;
        clockGroup.add(this.hourHand);
        
        // Minute hand
        const minuteGeometry = new THREE.BoxGeometry(0.03, 0.4, 0.02);
        this.minuteHand = new THREE.Mesh(minuteGeometry, handMaterial);
        this.minuteHand.position.z = 0.07;
        clockGroup.add(this.minuteHand);
        
        clockGroup.position.set(2, 1, -2);
        this.scene.add(clockGroup);
        this.clock = clockGroup;
    }

    createTaskCards() {
        this.taskCards = [];
        for (let i = 0; i < 3; i++) {
            const cardGeometry = new THREE.PlaneGeometry(1, 0.6);
            const cardMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x6366f1,
                transparent: true,
                opacity: 0.4,
                emissive: 0x6366f1,
                emissiveIntensity: 0.3,
                side: THREE.DoubleSide
            });
            const card = new THREE.Mesh(cardGeometry, cardMaterial);
            card.position.set(1 + i * 0.5, 0.5 + i * 0.3, -1);
            card.userData.initialPos = card.position.clone();
            card.userData.floatSpeed = 0.4 + i * 0.2;
            this.scene.add(card);
            this.taskCards.push(card);
        }
    }

    createProgressRing() {
        const ringGeometry = new THREE.TorusGeometry(0.8, 0.05, 16, 100);
        const ringMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x6366f1,
            emissive: 0x6366f1,
            emissiveIntensity: 0.5
        });
        this.progressRing = new THREE.Mesh(ringGeometry, ringMaterial);
        this.progressRing.position.set(0, 1.5, -2);
        this.scene.add(this.progressRing);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.001;
        
        // Animate floating books
        this.floatingBooks.forEach(book => {
            book.position.y = book.userData.initialY + Math.sin(time * book.userData.floatSpeed) * 0.2;
            book.rotation.y += 0.01;
        });
        
        // Rotate clock hands
        if (this.hourHand && this.minuteHand) {
            this.hourHand.rotation.z = time * 0.1;
            this.minuteHand.rotation.z = time * 0.5;
        }
        
        // Float task cards
        this.taskCards.forEach(card => {
            card.position.y = card.userData.initialPos.y + Math.sin(time * card.userData.floatSpeed) * 0.15;
        });
        
        // Rotate progress ring
        if (this.progressRing) {
            this.progressRing.rotation.z = time * 0.3;
        }
        
        // Student subtle movement
        if (this.student) {
            this.student.rotation.y = Math.sin(time * 0.5) * 0.1;
        }
        
        // Camera movement
        this.targetRotation.x += (this.mouse.y * 0.15 - this.targetRotation.x) * 0.05;
        this.targetRotation.y += (this.mouse.x * 0.15 - this.targetRotation.y) * 0.05;
        
        this.camera.position.x = this.targetRotation.y * 1.5;
        this.camera.position.y = this.targetRotation.x * 1.5;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize scenes when needed
let heroScene = null;
let studyScene = null;

function init3DScenes() {
    if (document.getElementById('hero3d')) {
        heroScene = new HeroScene();
    }
    if (document.getElementById('studyEnvironment3d')) {
        studyScene = new StudyEnvironmentScene();
    }
}
