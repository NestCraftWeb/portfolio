document.addEventListener('DOMContentLoaded', () => {
  // GSAP Registration
  gsap.registerPlugin(ScrollTrigger);

  // Custom Cursor
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  
  if (matchMedia('(pointer:fine)').matches) {
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
      follower.style.transform = `translate(${posX}px, ${posY}px)`;
      requestAnimationFrame(renderFollower);
    };
    renderFollower();

    const hoverTargets = document.querySelectorAll('button, a, .menu-btn');
    hoverTargets.forEach(target => {
      target.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // Initial Hero Animations
  const tl = gsap.timeline();
  
  tl.to('.reveal-text span', {
    y: 0,
    duration: 1.2,
    stagger: 0.1,
    ease: "power4.out",
    delay: 0.2
  })
  .to('.fade-in', {
    opacity: 1,
    y: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power2.out"
  }, "-=0.8");

  // Horizontal Scroll Setup
  const sections = gsap.utils.toArray(".panel");
  const wrapper = document.querySelector(".horizontal-scroll-wrapper");

  let horizontalScrollParams = gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: wrapper,
      pin: true,
      scrub: 1,
      snap: 1 / (sections.length - 1),
      end: () => "+=" + wrapper.offsetWidth
    }
  });

  // Image Reveal Animations during horizontal scroll
  const reveals = document.querySelectorAll(".img-reveal");
  
  reveals.forEach(reveal => {
    gsap.to(reveal, {
      CSSRule: { scaleX: 0 },
      scrollTrigger: {
        trigger: reveal,
        containerAnimation: horizontalScrollParams, // Link to horizontal scroll
        start: "left center",
        onEnter: () => {
          gsap.to(reveal, { '--pseudo-scale': 0, duration: 1.5, ease: "power3.inOut" });
        }
      }
    });

    // Custom implementation since CSSRulePlugin isn't imported, animate a pseudo-element via CSS var
    reveal.style.setProperty('--pseudo-scale', '1');
    
    // We update the CSS to use this variable
    const style = document.createElement('style');
    style.textContent = `
      .img-reveal::after {
        transform: scaleX(var(--pseudo-scale, 1));
      }
    `;
    document.head.appendChild(style);

    gsap.to(reveal, {
      '--pseudo-scale': 0,
      duration: 1.5,
      ease: "power3.inOut",
      scrollTrigger: {
        trigger: reveal,
        containerAnimation: horizontalScrollParams,
        start: "left 70%",
      }
    });
  });

  // Parallax the hero image slightly while scrolling out
  gsap.to('.parallax-img', {
    x: 200,
    ease: "none",
    scrollTrigger: {
      trigger: '.hero-panel',
      containerAnimation: horizontalScrollParams,
      start: "left left",
      scrub: 1
    }
  });

});
