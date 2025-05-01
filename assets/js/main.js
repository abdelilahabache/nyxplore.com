// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuButton) {
        menuButton.addEventListener('click', () => {
            nav.classList.toggle('open');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});