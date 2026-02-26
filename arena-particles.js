// ===================================
// PARTICLE SYSTEMS
// ===================================

class ParticleManager {
    constructor(scene) {
        this.scene = scene;
        this.particles = {
            smoke: null,
            debris: null,
            sparks: []
        };
        
        this.init();
    }
    
    init() {
        this.createSmokeParticles();
        this.createDebrisParticles();
    }
    
    createSmokeParticles() {
        const particleCount = 500;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const alphas = new Float32Array(particleCount);
        const speeds = new Float32Array(particleCount);
        const offsets = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            // Ground level smoke
            positions[i * 3] = (Math.random() - 0.5) * 50;
            positions[i * 3 + 1] = Math.random() * 2;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
            
            alphas[i] = Math.random() * 0.5 + 0.2;
            speeds[i] = Math.random() * 0.3 + 0.1;
            
            offsets[i * 3] = (Math.random() - 0.5) * 10;
            offsets[i * 3 + 1] = 0;
            offsets[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
        geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
        geometry.setAttribute('offset', new THREE.BufferAttribute(offsets, 3));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0x666666) },
                size: { value: 8.0 }
            },
            vertexShader: SmokeShader.vertexShader,
            fragmentShader: SmokeShader.fragmentShader,
            transparent: true,
            blending: THREE.NormalBlending,
            depthWrite: false
        });
        
        const smoke = new THREE.Points(geometry, material);
        this.scene.add(smoke);
        this.particles.smoke = smoke;
    }
    
    createDebrisParticles() {
        const particleCount = 300;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const rotationSpeeds = new Float32Array(particleCount);
        const velocities = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 40;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
            
            rotationSpeeds[i] = (Math.random() - 0.5) * 2;
            
            velocities[i * 3] = (Math.random() - 0.5) * 0.1;
            velocities[i * 3 + 1] = Math.random() * 0.2;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('rotationSpeed', new THREE.BufferAttribute(rotationSpeeds, 1));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(0xFF1E1E) }
            },
            vertexShader: DebrisShader.vertexShader,
            fragmentShader: DebrisShader.fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const debris = new THREE.Points(geometry, material);
        this.scene.add(debris);
        this.particles.debris = debris;
    }
    
    createSpark(position) {
        const sparkCount = 20;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(sparkCount * 3);
        const velocities = [];
        
        for (let i = 0; i < sparkCount; i++) {
            positions[i * 3] = position.x;
            positions[i * 3 + 1] = position.y;
            positions[i * 3 + 2] = position.z;
            
            velocities.push(new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                Math.random() * 2,
                (Math.random() - 0.5) * 2
            ));
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0xFF1E1E,
            size: 0.1,
            transparent: true,
            opacity: 1,
            blending: THREE.AdditiveBlending
        });
        
        const sparks = new THREE.Points(geometry, material);
        this.scene.add(sparks);
        
        const spark = {
            mesh: sparks,
            velocities: velocities,
            life: 1.0
        };
        
        this.particles.sparks.push(spark);
        
        // Remove after animation
        setTimeout(() => {
            this.scene.remove(sparks);
            const index = this.particles.sparks.indexOf(spark);
            if (index > -1) {
                this.particles.sparks.splice(index, 1);
            }
        }, 1000);
    }
    
    update(time) {
        // Update smoke
        if (this.particles.smoke) {
            this.particles.smoke.material.uniforms.time.value = time;
        }
        
        // Update debris
        if (this.particles.debris) {
            this.particles.debris.material.uniforms.time.value = time;
        }
        
        // Update sparks
        this.particles.sparks.forEach(spark => {
            const positions = spark.mesh.geometry.attributes.position.array;
            
            for (let i = 0; i < spark.velocities.length; i++) {
                positions[i * 3] += spark.velocities[i].x * 0.1;
                positions[i * 3 + 1] += spark.velocities[i].y * 0.1;
                positions[i * 3 + 2] += spark.velocities[i].z * 0.1;
                
                // Gravity
                spark.velocities[i].y -= 0.05;
            }
            
            spark.mesh.geometry.attributes.position.needsUpdate = true;
            
            // Fade out
            spark.life -= 0.02;
            spark.mesh.material.opacity = spark.life;
        });
    }
}
