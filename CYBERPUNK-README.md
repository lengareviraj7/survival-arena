# 🎮 Cyberpunk Productivity Metaverse

Ultra-premium AAA-level cyberpunk game interface with immersive 3D environment, holographic UI, and cinematic effects.

## 🌟 Features

### 3D Environment
- **Infinite digital grid floor** with animated glowing lines moving forward
- **Floating 3D objects**: books, holographic screens, laptops, task panels, glowing cubes
- **2000 particle system** with depth-based movement and glow effects
- **Energy waves** with animated shader effects
- **Volumetric light rays** creating atmospheric depth
- **Custom GLSL shaders** for grid, particles, holograms, and energy effects

### Camera & Visual Effects
- **Cinematic forward movement** - slow dolly-in effect
- **Mouse parallax** - camera follows cursor with smooth interpolation
- **Depth-of-field** simulation with fog
- **Smooth 60fps performance** with optimized rendering

### UI & Interactions
- **Metallic gradient text** with neon glow
- **Glitch effect** on text (randomly triggered)
- **Animated energy rings** rotating behind title
- **Glowing CTA button** with animated gradient border
- **Ripple effect** on button click
- **Custom cursor** with smooth follow animation
- **Live stats display** with animated counters
- **Digital scanning line** animation
- **HUD corner elements** for game-like interface

### Color Palette
- **Deep Blue Background**: `#050816`
- **Neon Purple**: `#7B2FF7`
- **Electric Cyan**: `#00F5FF`
- **Glowing Pink**: `#FF2E9F`

### Animations (GSAP)
- Entrance animations with staggered timing
- Smooth scroll-triggered parallax
- Hover effects with 3D lift
- Pulse animations on stats
- Rotating energy rings
- Floating object animations

## 🚀 Quick Start

```bash
# Open in browser
open cyberpunk-hero.html
```

**Requirements:**
- Modern browser with WebGL support
- Internet connection (for CDN libraries)

## 📁 File Structure

```
├── cyberpunk-hero.html      # Main HTML structure
├── cyberpunk-styles.css     # Complete styling system
├── cyberpunk-shaders.js     # Custom GLSL shaders
├── cyberpunk-scene.js       # Three.js 3D scene
├── cyberpunk-app.js         # Application controller
└── CYBERPUNK-README.md      # This file
```

## 🎨 Design System

### Typography
```css
Font Family: 'Orbitron', 'Rajdhani', -apple-system
Title Size: clamp(3rem, 10vw, 8rem)
Subtitle Size: clamp(1rem, 2vw, 1.5rem)
Letter Spacing: 0.05em - 0.2em
```

### Spacing
- Container padding: `10rem 2rem`
- Element gaps: `1rem - 4rem`
- Section margins: `2rem - 5rem`

### Effects
- **Glow**: `box-shadow: 0 0 20px color`
- **Blur**: `backdrop-filter: blur(20px)`
- **Gradient**: `linear-gradient(135deg, cyan, purple, pink)`

## 🎬 Animation Timeline

### Loading Sequence (0-2s)
1. Loading screen with spinner
2. Progress bar animation
3. Fade out loading screen

### Entrance Sequence (2-5s)
1. Title fade in + scale (1s)
2. Subtitle fade in (0.8s)
3. Energy rings scale in (1s)
4. CTA button fade in (0.8s)
5. Stats counter animation (0.6s)
6. Scroll indicator fade in (0.6s)
7. HUD corners scale in (0.8s)

### Continuous Animations
- Grid movement (infinite)
- Particle drift (infinite)
- Energy wave pulse (infinite)
- Object rotation (infinite)
- Stats fluctuation (every 3s)
- Random glitch (every 3s, 5% chance)

## 🔧 Technical Details

### Three.js Configuration
```javascript
Camera: PerspectiveCamera(60°, aspect, 0.1, 1000)
Position: (0, 5, 15)
Renderer: WebGLRenderer with antialiasing
Shadow Map: PCFSoftShadowMap
Pixel Ratio: min(devicePixelRatio, 2)
```

### Lighting Setup
- **Ambient**: 0.2 intensity
- **Main Directional** (Cyan): 1.5 intensity, position (10, 20, 10)
- **Accent Directional** (Purple): 1.0 intensity, position (-10, 15, -10)
- **Point Light 1** (Pink): 2.0 intensity, range 50
- **Point Light 2** (Cyan): 2.0 intensity, range 50

### Shader Uniforms
```javascript
Grid Shader:
- time: elapsed time
- color1, color2: gradient colors
- gridSize: 20.0
- lineWidth: 0.05

Particle Shader:
- time: elapsed time
- color: particle color
- size: 3.0
- speed: per-particle attribute

Hologram Shader:
- time: elapsed time
- color: hologram color
- opacity: 0.6
```

### Performance Optimizations
1. **Geometry reuse** - shared geometries for similar objects
2. **Material pooling** - limited material instances
3. **Particle instancing** - efficient particle rendering
4. **Frustum culling** - automatic by Three.js
5. **Level of detail** - simplified geometry for distant objects
6. **Conditional rendering** - mobile detection for reduced effects
7. **RequestAnimationFrame** - synced with display refresh
8. **Passive event listeners** - improved scroll performance

## 🎮 Interactions

### Mouse Movement
- Camera parallax (±2 units on X/Y)
- Custom cursor follow with smooth lerp
- Object hover detection

### Button Hover
- Scale up to 1.05
- Glow intensity increase
- Cursor change to active state

### Button Click
- Ripple effect from click position
- Screen flash effect
- Glitch trigger on title
- Smooth scroll to content

### Scroll
- Hero fade out with parallax
- HUD corners hide on scroll down
- Content section reveal

## 📱 Responsive Design

### Desktop (1024px+)
- Full 3D experience
- All effects enabled
- Large text sizes
- Wide stat display

### Tablet (768px - 1024px)
- Scaled 3D scene
- Reduced particle count
- Medium text sizes
- Stacked stats

### Mobile (<768px)
- Optimized 3D scene
- Minimal particles
- Small text sizes
- Vertical stat layout
- Simplified effects

## 🎯 Use Cases

### Landing Pages
- SaaS products
- Gaming platforms
- Tech startups
- Digital agencies
- Metaverse projects

### Portfolio Sites
- 3D artists
- Game developers
- UI/UX designers
- Creative studios

### Marketing Campaigns
- Product launches
- Event promotions
- Brand experiences

## 🔥 Advanced Customization

### Change Colors
```javascript
// In cyberpunk-scene.js
this.config = {
    colors: {
        cyan: new THREE.Color(0x00F5FF),    // Change here
        purple: new THREE.Color(0x7B2FF7),  // Change here
        pink: new THREE.Color(0xFF2E9F),    // Change here
    }
};
```

### Adjust Camera Movement
```javascript
// In cyberpunk-scene.js update()
this.camera.position.z = 15 - Math.sin(time * 0.1) * 2;  // Adjust speed/range
```

### Modify Particle Count
```javascript
// In cyberpunk-scene.js createParticleSystem()
const particleCount = 2000;  // Reduce for better performance
```

### Add Custom Objects
```javascript
// In cyberpunk-scene.js
createCustomObject() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({
        color: 0x00F5FF,
        emissive: 0x00F5FF,
        emissiveIntensity: 0.5
    });
    const mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
    return mesh;
}
```

## 🐛 Troubleshooting

### Low FPS
1. Reduce particle count
2. Disable shadow maps
3. Lower pixel ratio
4. Simplify shader calculations
5. Remove some floating objects

### Objects Not Visible
1. Check camera position
2. Verify object positions
3. Check material opacity
4. Ensure lights are added to scene

### Shaders Not Working
1. Check WebGL support
2. Verify shader syntax
3. Check uniform values
4. Test with basic material first

### Loading Issues
1. Check CDN availability
2. Verify file paths
3. Check console for errors
4. Test with local Three.js

## 🎓 Learning Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [GSAP Documentation](https://greensock.com/docs/)
- [WebGL Fundamentals](https://webglfundamentals.org/)
- [Shader Tutorial](https://thebookofshaders.com/)
- [Awwwards](https://www.awwwards.com/) - Design inspiration

## 📊 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 90+     | ✅ Full |
| Firefox | 88+     | ✅ Full |
| Safari  | 14+     | ✅ Full |
| Edge    | 90+     | ✅ Full |
| Mobile  | Modern  | ⚠️ Limited |

## 🚀 Deployment

### Static Hosting
```bash
# Vercel
vercel deploy

# Netlify
netlify deploy

# GitHub Pages
git push origin main
```

### CDN Optimization
- Use local Three.js for production
- Minify CSS/JS files
- Compress textures
- Enable gzip compression

## 📝 License

Created for educational and commercial use.

---

**Enter the Productivity Metaverse** 🎮✨

Built with Three.js, GSAP, and pure cyberpunk energy.
