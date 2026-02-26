// ===================================
// ARENA SHADERS
// ===================================

const FloorShader = {
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    
    fragmentShader: `
        uniform float time;
        uniform vec3 crackColor;
        uniform float crackIntensity;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        
        // Noise function
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        float noise(vec2 st) {
            vec2 i = floor(st);
            vec2 f = fract(st);
            float a = random(i);
            float b = random(i + vec2(1.0, 0.0));
            float c = random(i + vec2(0.0, 1.0));
            float d = random(i + vec2(1.0, 1.0));
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }
        
        void main() {
            // Base metallic color
            vec3 baseColor = vec3(0.05, 0.05, 0.05);
            
            // Distance from center
            float dist = length(vPosition.xy);
            
            // Create crack pattern
            float crackPattern = noise(vUv * 20.0 + time * 0.1);
            crackPattern += noise(vUv * 40.0 - time * 0.05) * 0.5;
            
            // Animated cracks
            float crack = step(0.7, crackPattern);
            float pulse = sin(time * 2.0 + dist * 0.5) * 0.5 + 0.5;
            
            // Crack glow
            vec3 crackGlow = crackColor * crack * pulse * crackIntensity;
            
            // Metallic reflection
            float reflection = smoothstep(0.5, 1.0, 1.0 - abs(vUv.y - 0.5) * 2.0) * 0.2;
            
            // Fade with distance
            float fade = 1.0 - smoothstep(20.0, 50.0, dist);
            
            vec3 finalColor = baseColor + crackGlow + reflection;
            float alpha = fade;
            
            gl_FragColor = vec4(finalColor, alpha);
        }
    `
};

const Text3DShader = {
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    
    fragmentShader: `
        uniform vec3 glowColor;
        uniform float glowIntensity;
        uniform float time;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
            // Metallic base
            vec3 baseColor = vec3(0.15, 0.15, 0.15);
            
            // Fresnel rim lighting
            vec3 viewDirection = normalize(-vPosition);
            float rim = 1.0 - max(0.0, dot(viewDirection, vNormal));
            float rimPower = pow(rim, 2.0);
            
            // Animated glow
            float pulse = sin(time * 2.0) * 0.3 + 0.7;
            vec3 rimGlow = glowColor * rimPower * glowIntensity * pulse;
            
            // Edge highlight
            float edge = pow(rim, 4.0);
            vec3 edgeHighlight = glowColor * edge * 2.0;
            
            vec3 finalColor = baseColor + rimGlow + edgeHighlight;
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `
};

const SmokeShader = {
    vertexShader: `
        uniform float time;
        uniform float size;
        
        attribute float alpha;
        attribute float speed;
        attribute vec3 offset;
        
        varying float vAlpha;
        
        void main() {
            vAlpha = alpha;
            
            vec3 pos = position + offset;
            pos.y += mod(time * speed, 10.0);
            pos.x += sin(time * speed + offset.x) * 0.5;
            pos.z += cos(time * speed + offset.z) * 0.5;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    
    fragmentShader: `
        uniform vec3 color;
        varying float vAlpha;
        
        void main() {
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            
            if (dist > 0.5) discard;
            
            float alpha = (1.0 - dist * 2.0) * vAlpha * 0.3;
            gl_FragColor = vec4(color, alpha);
        }
    `
};

const EnergyPulseShader = {
    vertexShader: `
        uniform float time;
        varying vec2 vUv;
        
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    
    fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float intensity;
        
        varying vec2 vUv;
        
        void main() {
            vec2 center = vUv - vec2(0.5);
            float dist = length(center);
            
            // Pulse wave
            float wave = sin(dist * 20.0 - time * 3.0) * 0.5 + 0.5;
            float pulse = smoothstep(0.4, 0.6, wave);
            
            // Fade from center
            float fade = 1.0 - smoothstep(0.0, 0.5, dist);
            
            float alpha = pulse * fade * intensity;
            
            gl_FragColor = vec4(color, alpha);
        }
    `
};

const HolographicRingShader = {
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    
    fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float opacity;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
            // Circular pattern
            vec2 center = vUv - vec2(0.5);
            float dist = length(center);
            float angle = atan(center.y, center.x);
            
            // Rotating segments
            float segments = sin(angle * 8.0 + time * 2.0) * 0.5 + 0.5;
            
            // Ring shape
            float ring = smoothstep(0.48, 0.5, dist) * smoothstep(0.52, 0.5, dist);
            
            // Scan line
            float scanLine = sin(angle * 50.0 + time * 5.0) * 0.5 + 0.5;
            
            float alpha = (ring * segments + scanLine * 0.3) * opacity;
            
            gl_FragColor = vec4(color, alpha);
        }
    `
};

const VolumetricLightShader = {
    vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
            vPosition = position;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    
    fragmentShader: `
        uniform float time;
        uniform vec3 lightColor;
        uniform float intensity;
        
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
            // Volumetric effect
            float depth = vPosition.z / 50.0;
            float volumetric = pow(1.0 - abs(depth), 2.0);
            
            // Animated intensity
            float pulse = sin(time * 0.5) * 0.3 + 0.7;
            
            // Noise pattern
            float noise = fract(sin(dot(vPosition.xy, vec2(12.9898, 78.233))) * 43758.5453);
            
            float alpha = volumetric * intensity * pulse * (0.8 + noise * 0.2);
            
            gl_FragColor = vec4(lightColor, alpha);
        }
    `
};

const DebrisShader = {
    vertexShader: `
        uniform float time;
        
        attribute float rotationSpeed;
        attribute vec3 velocity;
        
        varying float vAlpha;
        
        void main() {
            vec3 pos = position;
            
            // Floating motion
            pos += velocity * time;
            pos.y = mod(pos.y + time * 0.5, 20.0) - 10.0;
            
            // Rotation
            float angle = time * rotationSpeed;
            mat3 rotation = mat3(
                cos(angle), -sin(angle), 0.0,
                sin(angle), cos(angle), 0.0,
                0.0, 0.0, 1.0
            );
            pos = rotation * pos;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 3.0 * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
            
            vAlpha = 1.0 - abs(pos.y) / 10.0;
        }
    `,
    
    fragmentShader: `
        uniform vec3 color;
        varying float vAlpha;
        
        void main() {
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            
            if (dist > 0.5) discard;
            
            gl_FragColor = vec4(color, vAlpha * 0.6);
        }
    `
};
