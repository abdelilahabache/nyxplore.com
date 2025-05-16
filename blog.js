document.addEventListener('DOMContentLoaded', function() {
    // Update year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    

    
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        const currentTheme = localStorage.getItem('theme') || 
                            (prefersDarkScheme.matches ? 'dark' : 'light');
        
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }

        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            let theme = 'light';
            if (document.body.classList.contains('dark-mode')) {
                theme = 'dark';
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
            localStorage.setItem('theme', theme);
        });
    }

    // Mobile menu toggle
    const mobileMenu = document.getElementById('mobile-menu');
    const navbarMenu = document.getElementById('navbar-menu');
    
    if (mobileMenu && navbarMenu) {
        mobileMenu.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            navbarMenu.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    };
    

    // Newsletter form submission
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            
            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                this.style.display = 'none';
                const successMessage = document.querySelector('.newsletter-success');
                if (successMessage) {
                    successMessage.style.display = 'block';
                }
            })
            .catch(error => alert('Error submitting form'));
        });
    }
});



//Structured Data
type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "10 Hidden NYC Courtyards & Alleyways Even Locals Miss",
      "description": "Discover secret gardens, historic mews, and tucked-away oases from Greenwich Village to Brooklyn Heights.",
      "image": "https://nyxplore.com/assets/images/blog/hidden-gems-social.webp",
      "author": {
        "@type": "Organization",
        "name": "NYxplore Team"
      },
      "datePublished": "2025-05-12",
      "publisher": {
        "@type": "Organization",
        "name": "NYxplore",
        "logo": {
          "@type": "ImageObject",
          "url": "https://nyxplore.com/assets/images/logo-NY (2).webp"
        }
      }
    }