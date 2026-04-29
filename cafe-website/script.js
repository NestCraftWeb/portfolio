/**
 * Premium Interactive Features for Aura Coffee
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Preloader ---
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.style.opacity = '0';
    setTimeout(() => {
      preloader.style.visibility = 'hidden';
      document.body.classList.add('loaded'); // Trigger hero animations
    }, 1000);
  }, 1500);

  // --- Custom Cursor ---
  const cursor = document.querySelector('.custom-cursor');
  const cursorFollower = document.querySelector('.custom-cursor-follower');
  const hoverElements = document.querySelectorAll('a, button, .menu-item, input, select');

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Smooth follow for the larger circle
    setTimeout(() => {
      cursorFollower.style.left = e.clientX + 'px';
      cursorFollower.style.top = e.clientY + 'px';
    }, 80);
  });

  hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
    });
  });

  // --- Magnetic Buttons ---
  const magneticWins = document.querySelectorAll('.magnetic-wrap');
  
  magneticWins.forEach(wrap => {
    const btn = wrap.querySelector('.magnetic-btn');
    if (!btn) return;
    
    wrap.addEventListener('mousemove', (e) => {
      const position = wrap.getBoundingClientRect();
      const x = e.pageX - position.left - position.width / 2;
      const y = e.pageY - position.top - position.height / 2;
      
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
      // Make cursor stick slightly
      cursorFollower.style.transform = `translate(-50%, -50%) translate(${x * 0.1}px, ${y * 0.1}px)`;
    });
    
    wrap.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
      btn.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
      setTimeout(() => {
        btn.style.transition = 'none'; // remove transition after animating back so it follows mouse smoothly again
      }, 400);
    });
    
    wrap.addEventListener('mouseenter', () => {
      btn.style.transition = 'none';
    });
  });

  // --- Navbar Scroll Effect ---
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Scroll Reveal Animations (Intersection Observer) ---
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  // --- Parallax Effect on Scroll ---
  const parallaxBg = document.querySelectorAll('.parallax-bg');
  const imgParallax = document.querySelectorAll('.img-parallax');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    parallaxBg.forEach(bg => {
      // Move background slightly slower than scroll
      const speed = 0.4;
      bg.style.transform = `translateY(${scrollY * speed}px)`;
    });

    imgParallax.forEach(img => {
      const rect = img.parentElement.getBoundingClientRect();
      const parentTop = rect.top; // Distance from viewport top
      
      // Only animate if in viewport
      if (parentTop < window.innerHeight && rect.bottom > 0) {
        const speed = 0.2;
        // Calculate offset based on center of screen
        const offset = (parentTop - window.innerHeight / 2) * speed;
        img.style.transform = `translateY(${offset}px)`;
      }
    });
  });
});
