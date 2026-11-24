// Scene Initialization
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x03030b, 0.04);

// Camera Setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 20;

// Renderer Setup
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
renderer.setSize(window.innerWidth, window.innerHeight);

// Performance Optimization: Lower DPR (resolution scale) on mobile hardware to maintain smooth scroll & animation
const isMobile = window.innerWidth <= 768;
const dpr = isMobile ? Math.min(window.devicePixelRatio, 1.0) : Math.min(window.devicePixelRatio, 2.0);
renderer.setPixelRatio(dpr);

// Premium Lighting Setup (Soft Shadows)
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

document.getElementById('canvas-container').appendChild(renderer.domElement);

// Environment setup (simulating reflections)
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Primary Point Light with Soft Shadows
const pointLight = new THREE.PointLight(0xffffff, 2, 100);
pointLight.position.set(10, 20, 10);
pointLight.castShadow = true;
pointLight.shadow.mapSize.width = 2048;
pointLight.shadow.mapSize.height = 2048;
pointLight.shadow.bias = -0.0005;
pointLight.shadow.radius = 4; // Softens the shadow edges
scene.add(pointLight);

// Accent Lights for that "Tech Premium" look
const blueLight = new THREE.PointLight(0x0066ff, 3, 50);
blueLight.position.set(-15, -10, -10);
scene.add(blueLight);

const purpleLight = new THREE.PointLight(0xaa00ff, 2, 50);
purpleLight.position.set(15, -15, 5);
scene.add(purpleLight);

// Materials

// Brushed Aluminum (Physical, 0.1 roughness, 1.0 metalness)
const aluminumMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xe0e0e0,
    metalness: 1.0,
    roughness: 0.1,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2
});

// High-Gloss Transmissive Glass
const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.95, // Glass-like transparency
    ior: 1.5,
    thickness: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05
});

// Geometry
const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
const spheres = [];
const numSpheres = 25;

for (let i = 0; i < numSpheres; i++) {
    // 50/50 chance for glass or aluminum
    const isGlass = Math.random() > 0.5;
    const material = isGlass ? glassMaterial : aluminumMaterial;
    
    const sphere = new THREE.Mesh(sphereGeometry, material);
    
    // Spread them around
    sphere.position.x = (Math.random() - 0.5) * 35;
    sphere.position.y = (Math.random() - 0.5) * 20;
    sphere.position.z = (Math.random() - 0.5) * 20;
    
    // Random sizes
    const scale = Math.random() * 1.5 + 0.5;
    sphere.scale.set(scale, scale, scale);
    
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    
    scene.add(sphere);
    
    // Store original position and individual properties for animation
    spheres.push({
        mesh: sphere,
        baseX: sphere.position.x,
        baseY: sphere.position.y,
        baseZ: sphere.position.z,
        timeOffset: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.5 + 0.2, // Float speed
        velocity: new THREE.Vector3(0, 0, 0)
    });
}

// Mouse Interaction Setup
const mouse = new THREE.Vector2(2, 2); // Initial off-screen
const targetMouse = new THREE.Vector2();
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    // Normalized mouse (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Pixel mouse relative to center
    targetMouse.x = (event.clientX - windowHalfX);
    targetMouse.y = (event.clientY - windowHalfY);
});

// Raycaster and invisible plane for mouse projection in 3D space
const raycaster = new THREE.Raycaster();
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

// Animation Loop
const clock = new THREE.Clock();
let time = 0;

function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    time += delta;
    
    // Subtle parallax effect on the camera based on mouse
    camera.position.x += (mouse.x * 3 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 3 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    // Update Raycaster
    raycaster.setFromCamera(mouse, camera);
    const intersectPoint = new THREE.Vector3();
    raycaster.ray.intersectPlane(plane, intersectPoint);

    // Update spheres
    spheres.forEach(obj => {
        // 1. Slow sine wave movement on the Y-axis (Float state)
        const floatY = Math.sin(time * obj.speed + obj.timeOffset) * 2.0; 
        
        // 2. Mouse Hover Anti-Gravity Push-Away
        const spherePos = obj.mesh.position;
        // Project mouse intersection onto same Z plane as sphere to get accurate 2D distance
        const projMouse = intersectPoint.clone();
        projMouse.z = spherePos.z;
        
        const dist = projMouse.distanceTo(spherePos);
        const repelRadius = 8;   // How far the mouse push reaches
        const repelForce = 15.0; // Strength of the push
        
        if (dist < repelRadius) {
            const dir = new THREE.Vector3().subVectors(spherePos, projMouse).normalize();
            const force = (repelRadius - dist) * repelForce * delta;
            
            // Push violently away on X and Y, with a bit of Z for depth
            obj.velocity.x += dir.x * force;
            obj.velocity.y += dir.y * force;
            obj.velocity.z += dir.z * force * 0.5;
        }
        
        // Apply friction to velocity so they slow down over time
        obj.velocity.multiplyScalar(0.92);
        
        // Spring force pulling them back to their floating state position
        const returnForceX = (obj.baseX - spherePos.x) * 0.02;
        const returnForceZ = (obj.baseZ - spherePos.z) * 0.02;
        // Y position is the base Y + the sine wave float
        const targetY = obj.baseY + floatY;
        const returnForceY = (targetY - spherePos.y) * 0.02;
        
        obj.velocity.x += returnForceX;
        obj.velocity.y += returnForceY;
        obj.velocity.z += returnForceZ;
        
        // Apply final velocity to position
        obj.mesh.position.add(obj.velocity);
        
        // Gentle continued rotation for premium look
        obj.mesh.rotation.x += 0.002;
        obj.mesh.rotation.y += 0.003;
    });
    
    renderer.render(scene, camera);
}

// Window resize handling
window.addEventListener('resize', () => {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();
