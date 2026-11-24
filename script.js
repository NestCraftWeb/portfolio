document.addEventListener('DOMContentLoaded', () => {
  /* --- Preloader --- */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      document.body.style.overflow = 'auto'; // allow scroll
    }, 1500);
  }

  /* --- Dark/Light Mode Theme Toggle --- */
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const icon = themeToggle ? themeToggle.querySelector('i') : null;

  // Check Local Storage
  const savedTheme = localStorage.getItem('portfolioTheme');
  if (savedTheme === 'light') {
    body.classList.add('light-theme');
    if (icon) {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      body.classList.toggle('light-theme');
      
      if (body.classList.contains('light-theme')) {
        localStorage.setItem('portfolioTheme', 'light');
        if(icon) {
          icon.classList.remove('fa-sun');
          icon.classList.add('fa-moon');
        }
      } else {
        localStorage.setItem('portfolioTheme', 'dark');
        if(icon) {
          icon.classList.remove('fa-moon');
          icon.classList.add('fa-sun');
        }
      }
    });
  }

  /* --- Project Modal Logic --- */
  const modal = document.getElementById('project-modal');
  const modalClose = document.querySelector('.close-modal');
  const projectCards = document.querySelectorAll('.project-card');

  // Modal Data Targets
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalTech = document.getElementById('modal-tech');
  const modalLink = document.getElementById('modal-link');

  // Hardcoded Data Mapping for the demo (Normally comes from JSON/CMS)
  const projectData = {
    "Neon Air Writing": {
      desc: "An innovative interactive web application that leverages AI and hand tracking to allow users to draw in the air. Real-time canvas rendering creates a magical neon writing experience.",
      tech: ["HTML5 Canvas", "AI Hand Tracking", "JavaScript"],
      url: "neon-air-writing/index.html"
    },
    "Digital QR Menu": {
      desc: "A mobile-first, premium digital menu designed for cafes and restaurants. Features a sleek glassmorphous UI, fluid background animations, dynamic category filtering, and micro-interactions for adding items to the cart.",
      tech: ["HTML5", "CSS3 Grid/Flexbox", "Vanilla JS"],
      url: "qr-menu/index.html"
    },
    "Premium Cafe Site": {
      desc: "A luxurious, premium cafe website featuring a dark espresso and gold aesthetic. Includes advanced interactions like a custom cursor, magnetic buttons, and parallax scrolling.",
      tech: ["HTML5", "CSS3 Animations", "Vanilla JS"],
      url: "cafe-website/index.html"
    },
    "Catch the Stars": {
      desc: "A highly interactive, physics-based browser game designed to challenge players' timing and reflex speed. Meticulously crafted using requestAnimationFrame for 60fps performance.",
      tech: ["HTML5 Canvas", "Vanilla JS", "CSS3 Animations"],
      url: "catch-the-stars-game/index.html"
    },
    "Scrolling Text": {
      desc: "An immersive, infinite-scrolling text experience that manipulates the DOM on scroll. Demonstrates advanced typography rendering and scroll-trigger methodologies without heavy libraries.",
      tech: ["JavaScript", "HTML5", "CSS Transformations"],
      url: "scrolling-text-website/index.html"
    },
    "Calculator Pro": {
      desc: "A luxurious utility application with a bespoke neumorphic/glass interface. Handles complex arithmetic operations smoothly with extensive input validation and error handling.",
      tech: ["JavaScript ES6", "CSS Grid", "Event Delegation"],
      url: "calculator/index.html"
    },
    "Furniture Design": {
      desc: "A high-end, visual e-commerce landing page focused on modern furniture. Built using CSS Grid to simulate complex, irregular layouts typical of high-fashion editorials.",
      tech: ["HTML5", "Advanced CSS Grid", "Responsive Design"],
      url: "furniture site/demo3.0.html"
    },
    "Aura Estates": {
      desc: "An architectural real estate landing page with a minimalist aesthetic. Features a stunning horizontal scrolling layout and high-definition imagery for premium properties.",
      tech: ["GSAP", "HTML5", "CSS3 Flexbox", "JavaScript"],
      url: "real-estate/index.html"
    },
    "Sonic Beats": {
      desc: "An interactive music player featuring a rotating vinyl record animation, CSS audio visualizers, and a clean, user-friendly control interface.",
      tech: ["HTML5 Audio API", "CSS3 Keyframes", "Vanilla JS"],
      url: "music-player/index.html"
    },
    "3D Configurator": {
      desc: "A WebGL-powered 3D product configurator using Three.js. Allows users to interact with a 3D model, change textures, and explore product details in real-time.",
      tech: ["Three.js", "WebGL", "OrbitControls", "JavaScript"],
      url: "3d-configurator/index.html"
    },
    "Synapse AI Chat": {
      desc: "A futuristic AI chat interface with conversation history, code highlighting, and a sleek dark-mode design inspired by next-gen AI assistants.",
      tech: ["JavaScript", "Highlight.js", "CSS3"],
      url: "ai-chat/index.html"
    },
    "3D Floating Spheres": {
      desc: "Premium Three.js experience with glass and aluminum spheres, mouse-reactive physics, and cinematic lighting — a pure visual showcase.",
      tech: ["Three.js", "WebGL", "Tailwind CSS"],
      url: "3d-spheres/index.html"
    },
    "Task Manager": {
      desc: "A clean, minimal to-do list with add/delete/complete functionality and persistent task management for everyday productivity.",
      tech: ["JavaScript", "HTML5", "CSS3"],
      url: "to%20do%20list/index.html"
    }
  };

  if (modal) {
    projectCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const titleText = card.querySelector('.project-name').innerText;
        const data = projectData[titleText];

        if (data) {
          e.preventDefault(); // Stop routing from the anchor tag
          modalTitle.innerText = titleText;
          modalDesc.innerText = data.desc;
          modalLink.href = data.url;

          // Build tags
          modalTech.innerHTML = '';
          data.tech.forEach(t => {
            const span = document.createElement('span');
            span.className = 'tech-tag';
            span.innerText = t;
            modalTech.appendChild(span);
          });

          // Show Modal
          modal.classList.add('active');
          document.body.style.overflow = 'hidden'; // Stop background scrolling
        }
      });
    });

    // Close on X
    if (modalClose) {
      modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      });
    }

    // Close on Outside Click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  }

  /* --- Project Filtering Logic --- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterItems = document.querySelectorAll('.filter-item');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Active state formatting
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        filterItems.forEach(item => {
          // Reset animation classes for re-trigger
          item.style.opacity = '0';
          item.style.transform = 'scale(0.95)';
          
          setTimeout(() => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
              item.classList.remove('hide');
              // Animate in
              setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'scale(1)';
              }, 50);
            } else {
              item.classList.add('hide');
            }
          }, 300); // Wait for fade out before changing display
        });
      });
    });
  }

  /* --- Intersection Observer for Fade-ins and Skill Bars --- */
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Handle Fade Ins
        if (entry.target.classList.contains('hidden')) {
          entry.target.classList.add('show');
        }

        // Handle Skill Bars width animation specifically if this section is visible
        if (entry.target.id === 'skills') {
          const bars = entry.target.querySelectorAll('.skill-bar');
          bars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
          });
        }

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const hiddenElements = document.querySelectorAll('.hidden');
  hiddenElements.forEach((el) => observer.observe(el));

  /* --- Lazy Load Background Images --- */
  const lazyBgElements = document.querySelectorAll('[data-bg]');
  const lazyBgObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.backgroundImage = el.getAttribute('data-bg');
        el.removeAttribute('data-bg');
        obs.unobserve(el);
      }
    });
  }, { rootMargin: '50px 0px', threshold: 0.01 });

  lazyBgElements.forEach(el => lazyBgObserver.observe(el));

  // Custom Cursor
  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.custom-cursor-follower');
  
  if (cursor && follower && matchMedia('(pointer:fine)').matches) {
    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    const renderFollower = () => {
      posX += (mouseX - posX) * 0.1;
      posY += (mouseY - posY) * 0.1;
      follower.style.transform = `translate(${posX - 20}px, ${posY - 20}px)`;
      requestAnimationFrame(renderFollower);
    };
    renderFollower();

    const hoverSelector = 'a, button, .project-card, .btn-primary, .close-modal, .theme-btn';
    
    // Use event delegation for dynamic elements (like modal)
    document.body.addEventListener('mouseover', (e) => {
      if(e.target.closest(hoverSelector)) {
        document.body.classList.add('cursor-hover');
      }
    });
    
    document.body.addEventListener('mouseout', (e) => {
      if(e.target.closest(hoverSelector)) {
        document.body.classList.remove('cursor-hover');
      }
    });
  }

  /* --- Dynamic Typing Effect --- */
  const dynamicText = document.querySelector('.dynamic-text');
  if (dynamicText) {
    const textArray = [
      "Crafting Digital Excellence", 
      "Building Premium Experiences", 
      "Architecting Clean Code",
      "Designing Bespoke Solutions"
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function typeEffect() {
      const currentText = textArray[textIndex];
      
      if (isDeleting) {
        dynamicText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typeDelay = 50;
      } else {
        dynamicText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typeDelay = 100;
      }

      if (!isDeleting && charIndex === currentText.length) {
        typeDelay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % textArray.length;
        typeDelay = 500;
      }

      setTimeout(typeEffect, typeDelay);
    }
    
    setTimeout(typeEffect, 1600);
  }

  /* --- Magnetic Buttons --- */
  const magneticWrappers = document.querySelectorAll('.magnetic-wrap');
  
  magneticWrappers.forEach((wrapper) => {
    const btn = wrapper.querySelector('.magnetic-btn');
    if (!btn) return;

    wrapper.addEventListener('mousemove', (e) => {
      const rect = wrapper.getBoundingClientRect();
      const h = rect.width / 2;
      const x = e.clientX - rect.left - h;
      const y = e.clientY - rect.top - (rect.height / 2);
      
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });

    wrapper.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px)`;
      btn.style.transition = 'transform 0.5s ease';
      
      setTimeout(() => {
        btn.style.transition = 'background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease';
      }, 500);
    });
    
    wrapper.addEventListener('mouseenter', () => {
      btn.style.transition = 'none';
    });
  });

  /* --- Parallax Background --- */
  const parallaxBg = document.querySelector('.parallax-bg');
  if (parallaxBg) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY;
          parallaxBg.style.transform = `scale(1.1) translateY(${scrolled * 0.4}px)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* --- Smooth Scroll for Internal Links --- */
  const links = document.querySelectorAll('a[href^="#"]:not(#modal-link)');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* --- Navbar Scroll Effect --- */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* --- Current Year for Footer --- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* --- Interactive 3D Canvas Background --- */
  const canvasContainer = document.getElementById('canvas-container');
  if (canvasContainer && window.THREE) {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x03030b, 0.04);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    const isMobile = window.innerWidth <= 768;
    const dpr = isMobile ? Math.min(window.devicePixelRatio, 1.0) : Math.min(window.devicePixelRatio, 2.0);
    renderer.setPixelRatio(dpr);
    
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    canvasContainer.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 2, 100);
    pointLight.position.set(10, 20, 10);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;
    pointLight.shadow.bias = -0.0005;
    pointLight.shadow.radius = 4;
    scene.add(pointLight);

    const blueLight = new THREE.PointLight(0x0066ff, 3, 50);
    blueLight.position.set(-15, -10, -10);
    scene.add(blueLight);

    const purpleLight = new THREE.PointLight(0xaa00ff, 2, 50);
    purpleLight.position.set(15, -15, 5);
    scene.add(purpleLight);

    const aluminumMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xe0e0e0,
        metalness: 1.0,
        roughness: 0.1,
        clearcoat: 0.5,
        clearcoatRoughness: 0.2
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.95,
        ior: 1.5,
        thickness: 1.0,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05
    });

    const sphereGeometry = new THREE.SphereGeometry(1, 64, 64);
    const spheres = [];
    const numSpheres = isMobile ? 12 : 25;

    for (let i = 0; i < numSpheres; i++) {
        const isGlass = Math.random() > 0.5;
        const material = isGlass ? glassMaterial : aluminumMaterial;
        const sphere = new THREE.Mesh(sphereGeometry, material);
        
        sphere.position.x = (Math.random() - 0.5) * 35;
        sphere.position.y = (Math.random() - 0.5) * 20;
        sphere.position.z = (Math.random() - 0.5) * 20;
        
        const scale = Math.random() * 1.5 + 0.5;
        sphere.scale.set(scale, scale, scale);
        
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        scene.add(sphere);
        
        spheres.push({
            mesh: sphere,
            baseX: sphere.position.x,
            baseY: sphere.position.y,
            baseZ: sphere.position.z,
            timeOffset: Math.random() * Math.PI * 2,
            speed: Math.random() * 0.5 + 0.2,
            velocity: new THREE.Vector3(0, 0, 0)
        });
    }

    const mouse = new THREE.Vector2(2, 2);
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const clock = new THREE.Clock();
    let time = 0;

    function resizeCanvas() {
        const heroEl = document.getElementById('hero');
        const height = heroEl ? heroEl.offsetHeight : window.innerHeight;
        const width = window.innerWidth;
        
        windowHalfX = width / 2;
        windowHalfY = height / 2;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        time += delta;
        
        camera.position.x += (mouse.x * 3 - camera.position.x) * 0.05;
        camera.position.y += (mouse.y * 3 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);
        
        raycaster.setFromCamera(mouse, camera);
        const intersectPoint = new THREE.Vector3();
        raycaster.ray.intersectPlane(plane, intersectPoint);

        spheres.forEach(obj => {
            const floatY = Math.sin(time * obj.speed + obj.timeOffset) * 2.0; 
            const spherePos = obj.mesh.position;
            const projMouse = intersectPoint.clone();
            projMouse.z = spherePos.z;
            
            const dist = projMouse.distanceTo(spherePos);
            const repelRadius = 12;
            const repelForce = 5.0;
            
            if (dist < repelRadius) {
                const dir = new THREE.Vector3().subVectors(spherePos, projMouse).normalize();
                const force = (repelRadius - dist) * repelForce * delta;
                obj.velocity.x += dir.x * force;
                obj.velocity.y += dir.y * force;
                obj.velocity.z += dir.z * force * 0.5;
            }
            
            obj.velocity.multiplyScalar(0.96);
            
            const returnForceX = (obj.baseX - spherePos.x) * 0.005;
            const returnForceZ = (obj.baseZ - spherePos.z) * 0.005;
            const targetY = obj.baseY + floatY;
            const returnForceY = (targetY - spherePos.y) * 0.005;
            
            obj.velocity.x += returnForceX;
            obj.velocity.y += returnForceY;
            obj.velocity.z += returnForceZ;
            
            obj.mesh.position.add(obj.velocity);
            
            obj.mesh.rotation.x += 0.005;
            obj.mesh.rotation.y += 0.008;
        });
        
        renderer.render(scene, camera);
    }
    animate();
  }

  // --- Antigravity Parallax Engine --- //
  const layers = document.querySelectorAll('.parallax-layer');
  const shapes = document.querySelectorAll('.crystalline-shape');
  let pmouseX = 0, pmouseY = 0;
  let currentParallaxX = 0, currentParallaxY = 0;
  let shapeTime = 0;

  if (window.innerWidth > 768) {
      document.addEventListener('mousemove', (e) => {
          pmouseX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
          pmouseY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      });
  }

  function animateAntigravity() {
      requestAnimationFrame(animateAntigravity);
      shapeTime += 0.01;
      
      currentParallaxX += (pmouseX - currentParallaxX) * 0.05;
      currentParallaxY += (pmouseY - currentParallaxY) * 0.05;
      
      // Move layers
      layers.forEach(layer => {
          const depth = parseFloat(layer.getAttribute('data-depth')) || 0.1;
          const moveX = currentParallaxX * depth * -100;
          const moveY = currentParallaxY * depth * -100;
          layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
      
      // Float shapes
      shapes.forEach((shape, index) => {
          const floatY = Math.sin(shapeTime + index * 5) * 15;
          const floatX = Math.cos(shapeTime + index * 3) * 10;
          const rot = Math.sin(shapeTime + index) * 5;
          shape.style.transform = `translate3d(${floatX}px, ${floatY}px, 0) rotate(${rot}deg)`;
      });
  }
  animateAntigravity();

  // --- Cinematic Dust / Bokeh Engine --- //
  const dustCanvas = document.getElementById('bokeh-dust-canvas');
  if (dustCanvas) {
      const dCtx = dustCanvas.getContext('2d');
      let dWidth, dHeight;
      let dustParticles = [];

      function initDust() {
          dWidth = window.innerWidth;
          dHeight = window.innerHeight;
          dustCanvas.width = dWidth;
          dustCanvas.height = dHeight;
          
          dustParticles = [];
          const count = window.innerWidth <= 768 ? 20 : 50;
          for (let i = 0; i < count; i++) {
              dustParticles.push({
                  x: Math.random() * dWidth,
                  y: Math.random() * dHeight,
                  radius: Math.random() * 4 + 1,
                  vx: (Math.random() - 0.5) * 0.3,
                  vy: (Math.random() - 0.5) * 0.3,
                  alpha: Math.random() * 0.5 + 0.1,
                  phase: Math.random() * Math.PI * 2
              });
          }
      }

      function animateDust() {
          requestAnimationFrame(animateDust);
          dCtx.clearRect(0, 0, dWidth, dHeight);
          
          dustParticles.forEach(p => {
              p.x += p.vx + (currentParallaxX * 0.5);
              p.y += p.vy + (currentParallaxY * 0.5);
              p.phase += 0.02;
              
              const currentAlpha = p.alpha + Math.sin(p.phase) * 0.1;

              if (p.x < 0) p.x = dWidth;
              if (p.x > dWidth) p.x = 0;
              if (p.y < 0) p.y = dHeight;
              if (p.y > dHeight) p.y = 0;

              dCtx.beginPath();
              dCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
              dCtx.fillStyle = `rgba(212, 175, 55, ${Math.max(0, currentAlpha)})`;
              dCtx.shadowBlur = 15;
              dCtx.shadowColor = 'rgba(212, 175, 55, 0.8)';
              dCtx.fill();
          });
      }

      window.addEventListener('resize', initDust);
      initDust();
      animateDust();
  }

  // --- Chronos Motion Blur Engine (Scroll Velocity) --- //
  let lastScrollY = window.scrollY;
  const blurElements = document.querySelectorAll('.glass-hero-card, .project-card, .expertise-card');

  function updateMotionBlur() {
      const currentScrollY = window.scrollY;
      const scrollDiff = Math.abs(currentScrollY - lastScrollY);
      
      const targetBlur = Math.min(scrollDiff * 0.1, 15);
      
      blurElements.forEach(el => {
          if (targetBlur > 0.5) {
              const direction = currentScrollY > lastScrollY ? 1 : -1;
              el.style.transform = `translateY(${scrollDiff * direction * 0.2}px)`;
              el.style.filter = `blur(${targetBlur}px)`;
              // Ensure transitions do not fight the frame updates
              el.style.transition = 'none'; 
          } else {
              el.style.transform = 'translateY(0)';
              el.style.filter = 'none';
              // Restore hover transitions
              el.style.transition = 'transform 0.3s ease, border-color 0.3s ease, filter 0.3s ease';
          }
      });
      
      lastScrollY = currentScrollY;
      requestAnimationFrame(updateMotionBlur);
  }
  updateMotionBlur();

});
