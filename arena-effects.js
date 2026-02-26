// ===================================
// VISUAL EFFECTS
// ===================================

class EffectsManager {
    constructor(scene) {
        this.scene = scene;
        this.effects = {
            energyPulses: [],
            holographicRings: [],
            volumetricLights: []
        };
        
        this.init();
    }
    
    init() {
        this.createEnergyPulses();
        this.createHolographicRings();
        this.createVolumetricLights();
    }
    
    createEnergyPulses() {
        for (let i = 0; i < 3; i++) {
            const geometry = new THREE.PlaneGeometry(30, 30);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: new THREE.Color(0xFF1E1E) },
                    intensity: { value: 0.3 }
                },
                vertexShader: EnergyPulseShader.vertexShader,
                fragmentShader: EnergyPulseShader.fragmentShader,
                transparent: true,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide
            });
            
            const pulse = new THREE.Mesh(geometry, material);
            pulse.position.z = -10 - i * 5;
            pulse.rotation.x = Math.PI / 6;
            
            this.scene.add(pulse);
            this.effects.energyPulses.push(pulse);
        }
    }
    
    createHolographicRings() {
        for (let i = 0; i < 5; i++) {
            const geometry = new THREE.PlaneGeometry(10 + i * 2, 10 + i * 2);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    color: { value: i % 2 === 0 ? new THREE.Color(0xFF1E1E) : new THREE.Color(0x00E5FF) },
                    opacity: { value: 0.4 }
                },
                vertexShader: HolographicRingShader.vertexShader,
                fragmentShader: HolographicRingShader.fragmentShader,
                transparent: true,
                blending: THREE.AdditiveBlending,
                side: THREE.DoubleSide
            });
            
            const ring = new THREE.Mesh(geometry, material);
            ring.position.z = -8;
            ring.rotation.x = Math.PI / 2;
            
            this.scene.add(ring);
            this.effects.holographicRings.push({ mesh: ring, speed: 0.5 + i * 0.2 });
        }
    }
    
    createVolumetricLights() {
        const lightCount = 6;
        
        for (let i = 0; i < lightCount; i++) {
            const geometry = new THREE.CylinderGeometry(0.5, 2, 30, 16, 1, true);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: 0 },
                    lightColor: { value: i % 2 === 0 ? new THREE.Color(0x00E5FF) : new THREE.Color(0xFF1E1E) },
                    intensity: { value: 0.3 }
                },
                vertexShader: VolumetricLightShader.vertexShader,
                fragmentShader: VolumetricLightShader.fragmentShader,
                transparent: true,
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide
            });
            
            const light = new THREE.Mesh(geometry, material);
            const angle = (Math.PI * 2 / lightCount) * i;
            light.position.x = Math.cos(angle) * 15;
            light.position.y = 15;
            light.position.z = Math.sin(angle) * 15 - 20;
            light.rotation.x = Math.PI;
            
            this.scene.add(light);
            this.effects.volumetricLights.push(light);
        }
    }
    
    createShockwave(position) {
        const geometry = new THREE.RingGeometry(0.1, 0.2, 32);
        const material = new THREE.MeshBasicMaterial({
            color: 0xFF1E1E,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide
        });
        
        const shockwave = new THREE.Mesh(geometry, material);
        shockwave.position.copy(position);
        shockwave.rotation.x = -Math.PI / 2;
        
        this.scene.add(shockwave);
        
        // Animate
        gsap.to(shockwave.scale, {
            x: 50,
            y: 50,
            z: 50,
            duration: 1,
            ease: 'power2.out'
        });
        
        gsap.to(shockwave.material, {
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => {
                this.scene.remove(shockwave);
            }
        });
    }
    
    createScreenFlash() {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            inset: 0;
            background: radial-gradient(circle, rgba(255, 30, 30, 0.8), transparent);
            z-index: 9998;
            pointer-events: none;
        `;
        document.body.appendChild(flash);
        
        gsap.to(flash, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => flash.remove()
        });
    }
    
    update(time) {
        // Update energy pulses
        this.effects.energyPulses.forEach((pulse, index) => {
            pulse.material.uniforms.time.value = time + index;
            pulse.position.y = Math.sin(time * 0.5 + index) * 0.5;
        });
        
        // Update holographic rings
        this.effects.holographicRings.forEach((ring, index) => {
            ring.mesh.material.uniforms.time.value = time;
            ring.mesh.rotation.z = time * ring.speed;
            ring.mesh.scale.set(
                1 + Math.sin(time + index) * 0.1,
                1 + Math.sin(time + index) * 0.1,
                1
            );
        });
        
        // Update volumetric lights
        this.effects.volumetricLights.forEach((light, index) => {
            light.material.uniforms.time.value = time;
            light.material.uniforms.intensity.value = 0.2 + Math.sin(time * 2 + index) * 0.1;
        });
    }
}
