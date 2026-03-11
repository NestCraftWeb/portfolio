/**
 * KROMA | 3D Product Configurator
 * Core Engine: Three.js
 */

// Global Variables
let scene, camera, renderer, controls, product;
const container = document.getElementById('canvas-container');
const loadingBar = document.getElementById('loading-bar');
const loadingText = document.getElementById('loading-text');
const loaderScreen = document.getElementById('loader');

// Material Definitions
const materials = {
    primary: new THREE.MeshPhysicalMaterial({
        color: 0x111111,
        roughness: 0.2,
        metalness: 0.8,
        reflectivity: 1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
    }),
    accent: new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        roughness: 0.1,
        metalness: 1.0
    })
};

// Initialize the 3D Scene
function init() {
    // 1. Scene Setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f7f7);
    
    // 2. Camera Setup
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(4, 2, 8);
    
    // 3. Renderer Setup
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);
    
    // 4. Controls Setup
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 4;
    controls.maxDistance = 15;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    
    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(10, 15, 10);
    spotLight.castShadow = true;
    scene.add(spotLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-10, -10, -10);
    scene.add(pointLight);

    // 6. Create Product Model (Stylized "Aura Series X")
    createProduct();
    
    // 7. Event Listeners
    setupEventListeners();
    
    // 8. Start Animation Loop
    animate();
    
    // 9. Fake Loading Lag for UX
    simulateLoading();
}

function createProduct() {
    product = new THREE.Group();
    
    // Main Body (Round Cube)
    const bodyGeo = new THREE.BoxGeometry(2, 3, 2);
    const body = new THREE.Mesh(bodyGeo, materials.primary);
    body.castShadow = true;
    body.receiveShadow = true;
    product.add(body);
    
    // Core Detail (Floating Geometric Ring)
    const torusGeo = new THREE.TorusGeometry(1.5, 0.05, 16, 100);
    const core = new THREE.Mesh(torusGeo, materials.accent);
    core.rotation.x = Math.PI / 2;
    core.position.y = 0;
    core.name = "accent-part";
    product.add(core);

    // Floating Panels
    const panelGeo = new THREE.PlaneGeometry(1.8, 2.8);
    const sidePanel1 = new THREE.Mesh(panelGeo, materials.primary);
    sidePanel1.position.z = 1.05;
    product.add(sidePanel1);

    const sidePanel2 = new THREE.Mesh(panelGeo, materials.primary);
    sidePanel2.position.z = -1.05;
    sidePanel2.rotation.y = Math.PI;
    product.add(sidePanel2);

    scene.add(product);
}

function setupEventListeners() {
    window.addEventListener('resize', onWindowResize);
    
    // Color Swatches
    const swatches = document.querySelectorAll('.swatch');
    swatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            // Update UI
            swatches.forEach(s => s.classList.remove('active'));
            swatch.classList.add('active');
            
            // Update Material
            const color = swatch.getAttribute('data-color');
            const roughness = parseFloat(swatch.getAttribute('data-roughness'));
            const metalness = parseFloat(swatch.getAttribute('data-metalness'));
            
            updateMaterial(color, roughness, metalness);
        });
    });

    // Accent Buttons
    document.getElementById('btn-silver').addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('btn-carbon').classList.remove('active');
        updateAccent('#cccccc', 0.1, 1.0);
    });

    document.getElementById('btn-carbon').addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('btn-silver').classList.remove('active');
        updateAccent('#222222', 0.8, 0.1);
    });
}

function updateMaterial(color, roughness, metalness) {
    gsap.to(materials.primary.color, {
        r: new THREE.Color(color).r,
        g: new THREE.Color(color).g,
        b: new THREE.Color(color).b,
        duration: 0.5
    });
    materials.primary.roughness = roughness;
    materials.primary.metalness = metalness;
}

function updateAccent(color, roughness, metalness) {
    materials.accent.color.set(color);
    materials.accent.roughness = roughness;
    materials.accent.metalness = metalness;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    
    // Subtle float animation
    if (product) {
        product.position.y = Math.sin(Date.now() * 0.001) * 0.1;
        
        // Rotate the core ring
        const accentPart = product.getObjectByName('accent-part');
        if (accentPart) {
            accentPart.rotation.z += 0.01;
        }
    }
    
    renderer.render(scene, camera);
}

function simulateLoading() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            loadingBar.style.width = '100%';
            loadingText.innerText = 'Ready';
            
            setTimeout(() => {
                loaderScreen.style.opacity = '0';
                loaderScreen.style.visibility = 'hidden';
            }, 500);
        }
        loadingBar.style.width = progress + '%';
        if (progress > 30) loadingText.innerText = 'Initializing Shaders...';
        if (progress > 60) loadingText.innerText = 'Optimizing Mesh...';
        if (progress > 90) loadingText.innerText = 'Finishing...';
    }, 100);
}

// Check for GSAP dependency, adding fallback if not available in trial but I'll use simple set for now to be safe
// Actually, I'll add GSAP to index.html to make it smooth as requested.

init();
