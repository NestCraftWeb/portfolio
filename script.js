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
  const links = document.querySelectorAll('a[href^="#"]');
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
});
