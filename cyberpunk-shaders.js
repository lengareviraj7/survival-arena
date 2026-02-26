// ===================================
// CUSTOM GLSL SHADERS
// ===================================

const GridShader = {
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
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float gridSize;
        uniform float lineWidth;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
            // Create grid pattern
            vec2 grid = abs(fract(vUv * gridSize - 0.5) - 0.5) / fwidth(vUv * gridSize);
            float line = min(grid.x, grid.y);
            
            // Distance fade
            float dist = length(vPosition.xy);
            float fade = 1.0 - smoothstep(20.0, 50.0, dist);
            
            // Animated glow
            float glow = sin(time * 0.5 + vPosition.x * 0.1) * 0.5 + 0.5;
            
            // Mix colors
            vec3 gridColor = mix(color1, color2, glow);
            float alpha = (1.0 - min(line, 1.0)) * fade * 0.6;
            
            gl_FragColor = vec4(gridColor, alpha);
        }
    `
};

const ParticleShader = {
    vertexShader: `
        uniform float time;
        uniform float size;
        
        attribute float alpha;
        attribute float speed;
        
        varying float vAlpha;
        
        void main() {
            vAlpha = alpha;
            
            vec3 pos = position;
            pos.z += mod(time * speed, 100.0) - 50.0;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    
    fragmentShader: `
        uniform vec3 color;
        varying float vAlpha;
        
        void main() {
            // Circular particle
            vec2 center = gl_PointCoord - vec2(0.5);
            float dist = length(center);
            
            if (dist > 0.5) discard;
            
            float alpha = (1.0 - dist * 2.0) * vAlpha;
            gl_FragColor = vec4(color, alpha);
        }
    `
};

const HologramShader = {
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    
    fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float opacity;
        
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
            // Fresnel effect
            vec3 viewDirection = normalize(cameraPosition - vPosition);
            float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 2.0);
            
            // Scan lines
            float scanLine = sin(vUv.y * 100.0 + time * 2.0) * 0.5 + 0.5;
            
            // Glitch effect
            float glitch = step(0.98, sin(time * 10.0 + vPosition.y * 5.0));
            
            // Combine effects
            float alpha = (fresnel * 0.8 + scanLine * 0.2 + glitch * 0.3) * opacity;
            
            gl_FragColor = vec4(color, alpha);
        }
    `
};

const GlowShader = {
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
        uniform float intensity;
        
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
            vec3 viewDirection = normalize(-vPosition);
            float rim = 1.0 - max(0.0, dot(viewDirection, vNormal));
            float glow = pow(rim, 3.0) * intensity;
            
            gl_FragColor = vec4(glowColor, glow);
        }
    `
};

const EnergyWaveShader = {
    vertexShader: `
        uniform float time;
        varying vec2 vUv;
        
        void main() {
            vUv = uv;
            vec3 pos = position;
            pos.z += sin(pos.x * 2.0 + time) * 0.1;
            pos.z += cos(pos.y * 2.0 + time * 1.5) * 0.1;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,
    
    fragmentShader: `
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        
        varying vec2 vUv;
        
        void main() {
            vec2 uv = vUv;
            
            // Wave pattern
            float wave1 = sin(uv.x * 10.0 + time * 2.0) * 0.5 + 0.5;
            float wave2 = cos(uv.y * 10.0 + time * 1.5) * 0.5 + 0.5;
            float pattern = wave1 * wave2;
            
            // Color mixing
            vec3 color = mix(color1, color2, pattern);
            
            // Fade edges
            float fade = smoothstep(0.0, 0.2, uv.x) * smoothstep(1.0, 0.8, uv.x);
            fade *= smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.8, uv.y);
            
            gl_FragColor = vec4(color, pattern * fade * 0.6);
        }
    `
};
