document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active'); // For hamburger animation
            // Add or remove aria-expanded for accessibility
            const isExpanded = mainNav.classList.contains('active');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu if a link is clicked (useful for single-page apps or when navigating within the PWA)
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 768) { // Only close on smaller screens
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', false);
                }
            });
        });

        // Close menu if clicked outside (optional, but good for UX)
        document.addEventListener('click', (event) => {
            if (!mainNav.contains(event.target) && !menuToggle.contains(event.target) && mainNav.classList.contains('active')) {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', false);
            }
        });
    }

    // You can add more dynamic JS functionality here later, e.g.,
    // - Smooth scrolling
    // - Lazy loading images
    // - Interactive elements
});