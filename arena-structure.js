// ===================================
// ARENA STRUCTURE
// ===================================

class ArenaStructure {
    constructor(scene) {
        this.scene = scene;
        this.structure = null;
        
        this.init();
    }
    
    init() {
        this.createArenaStructure();
    }
    
    createArenaStructure() {
        const arenaGroup = new THREE.Group();
        
        // Massive circular arena ring
        this.createMainRing(arenaGroup);
        
        // Support pillars
        this.createPillars(arenaGroup);
        
        // Upper platform
        this.createUpperPlatform(arenaGroup);
        
        // Lighting towers
        this.createLightingTowers(arenaGroup);
        
        arenaGroup.position.set(0, 0, -30);
        arenaGroup.scale.set(2, 2, 2);
        
        this.scene.add(arenaGroup);
        this.structure = arenaGroup;
    }
    
    createMainRing(parent) {
        const ringGeometry = new THREE.TorusGeometry(15, 0.5, 16, 64);
        const ringMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a1a,
            metalness: 0.9,
            roughness: 0.3,
            emissive: 0xFF1E1E,
            emissiveIntensity: 0.2
        });
        
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        ring.castShadow = true;
        ring.receiveShadow = true;
        
        // Add glowing edge
        const edgeGeometry = new THREE.TorusGeometry(15, 0.52, 16, 64);
        const edgeMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF1E1E,
            transparent: true,
            opacity: 0.3
        });
        const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
        edge.rotation.x = Math.PI / 2;
        
        parent.add(ring);
        parent.add(edge);
    }
    
    createPillars(parent) {
        const pillarCount = 8;
        const radius = 15;
        
        for (let i = 0; i < pillarCount; i++) {
            const angle = (Math.PI * 2 / pillarCount) * i;
            
            const pillarGeometry = new THREE.CylinderGeometry(0.3, 0.4, 10, 8);
            const pillarMaterial = new THREE.MeshStandardMaterial({
                color: 0x0a0a0a,
                metalness: 0.8,
                roughness: 0.4,
                emissive: 0xFF1E1E,
                emissiveIntensity: 0.1
            });
            
            const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
            pillar.position.x = Math.cos(angle) * radius;
            pillar.position.y = 5;
            pillar.position.z = Math.sin(angle) * radius;
            pillar.castShadow = true;
            
            // Add detail rings
            for (let j = 0; j < 3; j++) {
                const ringGeometry = new THREE.TorusGeometry(0.5, 0.05, 8, 16);
                const ringMaterial = new THREE.MeshBasicMaterial({
                    color: 0xFF1E1E,
                    transparent: true,
                    opacity: 0.5
                });
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.rotation.x = Math.PI / 2;
                ring.position.y = -3 + j * 3;
                pillar.add(ring);
            }
            
            parent.add(pillar);
        }
    }
    
    createUpperPlatform(parent) {
        const platformGeometry = new THREE.CylinderGeometry(16, 16, 0.5, 64);
        const platformMaterial = new THREE.MeshStandardMaterial({
            color: 0x0a0a0a,
            metalness: 0.9,
            roughness: 0.2,
            transparent: true,
            opacity: 0.8
        });
        
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.position.y = 10;
        platform.castShadow = true;
        platform.receiveShadow = true;
        
        // Add grid pattern
        const gridHelper = new THREE.PolarGridHelper(16, 16, 8, 64, 0xFF1E1E, 0x333333);
        gridHelper.position.y = 10.3;
        
        parent.add(platform);
        parent.add(gridHelper);
    }
    
    createLightingTowers(parent) {
        const towerCount = 4;
        const radius = 18;
        
        for (let i = 0; i < towerCount; i++) {
            const angle = (Math.PI * 2 / towerCount) * i + Math.PI / 4;
            
            const towerGeometry = new THREE.BoxGeometry(0.5, 15, 0.5);
            const towerMaterial = new THREE.MeshStandardMaterial({
                color: 0x1a1a1a,
                metalness: 0.8,
                roughness: 0.3
            });
            
            const tower = new THREE.Mesh(towerGeometry, towerMaterial);
            tower.position.x = Math.cos(angle) * radius;
            tower.position.y = 7.5;
            tower.position.z = Math.sin(angle) * radius;
            tower.castShadow = true;
            
            // Add light fixture
            const fixtureGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            const fixtureMaterial = new THREE.MeshBasicMaterial({
                color: 0xFFFFFF,
                transparent: true,
                opacity: 0.8
            });
            const fixture = new THREE.Mesh(fixtureGeometry, fixtureMaterial);
            fixture.position.y = 7;
            tower.add(fixture);
            
            parent.add(tower);
        }
    }
    
    update(time) {
        if (!this.structure) return;
        
        // Slow rotation
        this.structure.rotation.y = time * 0.05;
        
        // Subtle breathing
        this.structure.position.y = Math.sin(time * 0.3) * 0.5;
    }
}
