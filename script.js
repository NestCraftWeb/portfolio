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

  /* --- Interactive Canvas Background --- */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    // Set colors based on theme
    let isLight = document.body.classList.contains('light-theme');
    let particleColor = isLight ? 'rgba(184, 134, 11, 0.5)' : 'rgba(212, 175, 55, 0.4)';
    let lineColor = isLight ? 'rgba(184, 134, 11, ' : 'rgba(212, 175, 55, ';

    function initCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = document.getElementById('hero').offsetHeight;
      
      particles = [];
      const particleCount = window.innerWidth < 768 ? 40 : 80;
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          radius: Math.random() * 2 + 1
        });
      }
    }

    function animateCanvas() {
      requestAnimationFrame(animateCanvas);
      ctx.clearRect(0, 0, width, height);

      // Check theme dynamically
      isLight = document.body.classList.contains('light-theme');
      particleColor = isLight ? 'rgba(0, 0, 0, 0.2)' : 'rgba(212, 175, 55, 0.4)';
      lineColor = isLight ? 'rgba(0, 0, 0, ' : 'rgba(212, 175, 55, ';

      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse interaction
        let dx = (cursorFollower ? parseFloat(cursorFollower.style.left) || 0 : 0) - p.x;
        let dy = (cursorFollower ? parseFloat(cursorFollower.style.top) || 0 : 0) - p.y;
        
        // If mouse is near, push slightly
        if (cursorFollower) {
           let dist = Math.sqrt(dx*dx + dy*dy);
           if (dist < 100) {
             p.x -= dx * 0.02;
             p.y -= dy * 0.02;
           }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();

        // Connect particles
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${lineColor}${1 - dist/120})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
    }

    // Need access to cursor elements from outside scope hook if possible, otherwise read DOM roughly
    const cursorFollower = document.querySelector('.custom-cursor');

    window.addEventListener('resize', initCanvas);
    initCanvas();
    animateCanvas();
  }
});
