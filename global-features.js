/**
 * Global Features JS - Included across all portfolio sites
 * Injects WhatsApp FAB, Scroll Progress Bar, and ensures viewport meta.
 */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Ensure viewport meta tag exists for mobile responsiveness
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
        viewportMeta = document.createElement('meta');
        viewportMeta.name = "viewport";
        viewportMeta.content = "width=device-width, initial-scale=1.0";
        document.head.appendChild(viewportMeta);
        console.log("Global Features: Added missing viewport meta tag.");
    }

    // 2. Inject FontAwesome if missing (for WhatsApp icon)
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const faLink = document.createElement('link');
        faLink.rel = 'stylesheet';
        faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        document.head.appendChild(faLink);
    }

    // 3. Inject Scroll Progress Bar
    const scrollContainer = document.createElement('div');
    scrollContainer.className = 'global-scroll-progress-container';
    
    const scrollBar = document.createElement('div');
    scrollBar.className = 'global-scroll-progress-bar';
    scrollBar.id = 'global-scroll-bar';
    
    scrollContainer.appendChild(scrollBar);
    document.body.prepend(scrollContainer);

    // Scroll Logic
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById('global-scroll-bar').style.width = scrolled + "%";
    });

    // 4. Inject WhatsApp Floating Action Button
    const waButton = document.createElement('a');
    waButton.href = 'https://wa.me/917249512106'; // Target number
    waButton.target = '_blank';
    waButton.className = 'whatsapp-fab';
    waButton.setAttribute('aria-label', 'Contact me on WhatsApp');
    waButton.innerHTML = '<i class="fab fa-whatsapp"></i>';
    
    document.body.appendChild(waButton);
});
