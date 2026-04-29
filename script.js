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

  /* --- Mobile Navigation --- */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      
      const menuIcon = mobileMenuBtn.querySelector('.lucide-menu');
      const closeIcon = mobileMenuBtn.querySelector('.lucide-x');
      
      if (mobileMenu.classList.contains('open')) {
        if(menuIcon) {
          menuIcon.style.opacity = '0';
          menuIcon.style.transform = 'rotate(180deg) scale(0.5)';
        }
        if(closeIcon) {
          closeIcon.style.opacity = '1';
          closeIcon.style.transform = 'rotate(0deg) scale(1)';
        }
        document.body.style.overflow = 'hidden';
      } else {
        if(menuIcon) {
          menuIcon.style.opacity = '1';
          menuIcon.style.transform = 'rotate(0deg) scale(1)';
        }
        if(closeIcon) {
          closeIcon.style.opacity = '0';
          closeIcon.style.transform = 'rotate(-180deg) scale(0.5)';
        }
        document.body.style.overflow = '';
      }
    });

    // Close mobile menu on link click
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('open')) {
          mobileMenu.classList.remove('open');
          const menuIcon = mobileMenuBtn.querySelector('.lucide-menu');
          const closeIcon = mobileMenuBtn.querySelector('.lucide-x');
          
          if(menuIcon) {
            menuIcon.style.opacity = '1';
            menuIcon.style.transform = 'rotate(0deg) scale(1)';
          }
          if(closeIcon) {
            closeIcon.style.opacity = '0';
            closeIcon.style.transform = 'rotate(-180deg) scale(0.5)';
          }
          document.body.style.overflow = '';
        }
      });
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
      url: "furniture site/demo3.0.html" // Link to the specific file inside
    },
    "Handy AI": {
      desc: "A fullscreen browser-based hand gesture experience. Features real-time hand tracking, gesture physics, and an air-drawing canvas using MediaPipe machine learning.",
      tech: ["MediaPipe AI", "HTML5 Canvas", "Vanilla JS"],
      url: "handy-ai.html"
    }
  };

  if (modal) {
    projectCards.forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault(); // Stop routing from the anchor tag
        
        const titleText = card.querySelector('.project-name').innerText;
        const data = projectData[titleText];

        if (data) {
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
                item.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
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
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      parallaxBg.style.transform = `scale(1.1) translateY(${scrolled * 0.4}px)`;
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
        const navbar = document.querySelector('.cinematic-navbar') || document.querySelector('.navbar');
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* --- Navigation Arrows Logic --- */
  const navArrows = document.querySelectorAll('.nav-arrow');
  if (navArrows.length >= 2) {
    const prevArrow = navArrows[0];
    const nextArrow = navArrows[1];

    prevArrow.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    nextArrow.addEventListener('click', () => {
      const aboutSection = document.getElementById('about') || document.getElementById('projects');
      if (aboutSection) {
        const navbar = document.querySelector('.cinematic-navbar');
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = aboutSection.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  }

  /* --- Navbar Scroll Effect --- */
  const navbarScroll = document.querySelector('.cinematic-navbar') || document.querySelector('.navbar');
  if (navbarScroll) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbarScroll.classList.add('scrolled');
      } else {
        navbarScroll.classList.remove('scrolled');
      }
    });
  }

  /* --- Current Year for Footer --- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* --- Advanced Project Card 3D Hover Parallax --- */
  const projectCardsEffects = document.querySelectorAll('.project-card');
  projectCardsEffects.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -8; // Max rotation 8deg
      const rotateY = ((x - centerX) / centerX) * 8;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.transition = 'transform 0.5s ease';
    });
    
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });

  /* --- Interactive 3D Background (Three.js) --- */
  const canvas = document.getElementById('hero-canvas');
  if (canvas && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const heroEl = document.getElementById('hero');
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / heroEl.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, heroEl.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Floating Geometries
    const geometries = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1, 0),
      new THREE.TetrahedronGeometry(1, 0)
    ];
    
    let isLight = document.body.classList.contains('light-theme');
    
    const materialGold = new THREE.MeshPhysicalMaterial({ 
      color: isLight ? 0xB8860B : 0xD4AF37,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.8,
      wireframe: true
    });
    
    const materialGlass = new THREE.MeshPhysicalMaterial({
      color: isLight ? 0xffffff : 0x050505,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.9,
      thickness: 1.0,
      transparent: true,
      opacity: 0.6
    });

    const particles = new THREE.Group();
    scene.add(particles);

    const particleCount = window.innerWidth < 768 ? 15 : 35;

    for (let i = 0; i < particleCount; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = Math.random() > 0.5 ? materialGold : materialGlass;
      const mesh = new THREE.Mesh(geometry, material);
      
      mesh.position.x = (Math.random() - 0.5) * 40;
      mesh.position.y = (Math.random() - 0.5) * 40;
      mesh.position.z = (Math.random() - 0.5) * 20 - 10;
      
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      
      const scale = Math.random() * 0.8 + 0.2;
      mesh.scale.set(scale, scale, scale);
      
      // Custom animation data
      mesh.userData = {
        rx: (Math.random() - 0.5) * 0.015,
        ry: (Math.random() - 0.5) * 0.015,
        yOffset: Math.random() * Math.PI * 2,
        yPos: mesh.position.y
      };
      
      particles.add(mesh);
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xD4AF37, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 15;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = heroEl.offsetHeight / 2;

    document.addEventListener('mousemove', (event) => {
      mouseX = (event.clientX - windowHalfX);
      mouseY = (event.clientY - windowHalfY);
    });

    // Theme Mutation Observer to update colors
    const bodyObserver = new MutationObserver(() => {
      const lightMode = document.body.classList.contains('light-theme');
      materialGold.color.setHex(lightMode ? 0xB8860B : 0xD4AF37);
      materialGlass.color.setHex(lightMode ? 0xffffff : 0x050505);
    });
    bodyObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      targetX = mouseX * 0.001;
      targetY = mouseY * 0.001;

      particles.rotation.y += 0.05 * (targetX - particles.rotation.y);
      particles.rotation.x += 0.05 * (targetY - particles.rotation.x);

      particles.children.forEach(mesh => {
        mesh.rotation.x += mesh.userData.rx;
        mesh.rotation.y += mesh.userData.ry;
        mesh.position.y = mesh.userData.yPos + Math.sin(time + mesh.userData.yOffset) * 0.5;
      });

      renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / heroEl.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, heroEl.offsetHeight);
    });

    animate();
  }

  /* --- Seamless Page Transitions --- */
  const modalLinkReal = document.getElementById('modal-link');
  if (modalLinkReal && preloader) {
    modalLinkReal.addEventListener('click', (e) => {
      e.preventDefault();
      const targetUrl = modalLinkReal.getAttribute('href');
      if (targetUrl && targetUrl !== '#') {
        preloader.style.opacity = '1';
        preloader.style.visibility = 'visible';
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 800);
      }
    });
  }

  window.addEventListener('pageshow', (e) => {
    if (e.persisted && preloader) {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
    }
  });

  /* --- Initialize Lucide Icons --- */
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
