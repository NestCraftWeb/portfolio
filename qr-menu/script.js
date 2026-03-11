document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');
  const cartBadge = document.querySelector('.badge');
  const addBtns = document.querySelectorAll('.add-btn');
  
  let cartCount = 0;

  // Category Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      menuItems.forEach(item => {
        // Reset animation logic to re-trigger on filter
        item.style.animation = 'none';
        item.offsetHeight; /* trigger reflow */
        item.style.animation = null; 

        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  // Simple Add to Cart Interaction
  addBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      cartCount++;
      cartBadge.textContent = cartCount;
      
      // Feedback animation on the button itself
      const originalIcon = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i>';
      btn.style.background = 'var(--accent)';
      btn.style.color = '#0f172a';
      
      // Create a small pop particle
      createParticle(e.clientX, e.clientY);

      setTimeout(() => {
        btn.innerHTML = originalIcon;
        btn.style.background = '';
        btn.style.color = '';
      }, 800);
    });
  });

  // Particle Effect function
  function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = '10px';
    particle.style.height = '10px';
    particle.style.background = 'var(--accent)';
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '999';
    particle.style.transition = 'all 0.6s cubic-bezier(0.1, 0.8, 0.3, 1)';
    
    document.body.appendChild(particle);
    
    // Animate up and fade out
    setTimeout(() => {
      particle.style.transform = `translateY(-30px) scale(1.5)`;
      particle.style.opacity = '0';
    }, 10);
    
    // Cleanup
    setTimeout(() => {
      particle.remove();
    }, 600);
  }
});
