document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
  
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
  
    themeToggle.addEventListener('click', function() {
      let theme = 'light';
      if (document.body.getAttribute('data-theme') !== 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        theme = 'dark';
      } else {
        document.body.removeAttribute('data-theme');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      }
      localStorage.setItem('theme', theme);
    });
  
    // Sound Toggle
    const soundToggle = document.getElementById('sound-toggle');
    const ambientSound = document.getElementById('ambient-sound');
    let isSoundOn = false;
  
    // Check if sound was previously on
    if (localStorage.getItem('sound') === 'on') {
      isSoundOn = true;
      ambientSound.play();
      soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
  
    soundToggle.addEventListener('click', function() {
      if (isSoundOn) {
        ambientSound.pause();
        soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        localStorage.setItem('sound', 'off');
      } else {
        ambientSound.play()
          .then(() => {
            soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
            localStorage.setItem('sound', 'on');
          })
          .catch(error => {
            console.error('Audio playback failed:', error);
          });
      }
      isSoundOn = !isSoundOn;
    });
  
    // Mobile Menu Toggle with improved behavior
    const mobileMenuButton = document.getElementById('mobile-menu');
    const navbarMenu = document.querySelector('.navbar-menu');
    const navbarLinks = document.querySelectorAll('.navbar-link');
  
    mobileMenuButton.addEventListener('click', function() {
      this.classList.toggle('active');
      navbarMenu.classList.toggle('active');
      document.body.style.overflow = navbarMenu.classList.contains('active') ? 'hidden' : 'auto';
    });
  
    // Close mobile menu when clicking on a link or outside
    navbarLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuButton.classList.remove('active');
        navbarMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
      });
    });
  
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar-container') && navbarMenu.classList.contains('active')) {
        mobileMenuButton.classList.remove('active');
        navbarMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  
    // Sticky Navbar on Scroll with improved performance
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
  
    window.addEventListener('scroll', function() {
      const currentScrollY = window.scrollY;
      
      // Only update if scroll position changed significantly
      if (Math.abs(currentScrollY - lastScrollY) > 5) {
        navbar.classList.toggle('scrolled', currentScrollY > 50);
        lastScrollY = currentScrollY;
      }
    }, { passive: true });
  
    // Smooth Scrolling for Anchor Links with offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const offset = 80; // Same as your CSS
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          
          window.scrollTo({
            top: targetPosition - offset,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          if (navbarMenu.classList.contains('active')) {
            mobileMenuButton.classList.remove('active');
            navbarMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
          }
        }
      });
    });
  
    // Parallax Effect with performance optimization
  // Update your parallax initialization code
function initParallax() {
    const parallaxItems = document.querySelectorAll('.parallax-item');
    // Add data-speed attribute if missing
    parallaxItems.forEach((item, index) => {
      if (!item.dataset.speed) {
        item.setAttribute('data-speed', (index * 0.05 + 0.1).toFixed(2));
      }
    });
  
    window.addEventListener('scroll', () => {
      parallaxItems.forEach(item => {
        const speed = parseFloat(item.dataset.speed);
        const yPos = -(window.scrollY * speed);
        item.style.transform = `translateY(${yPos}px)`;
      });
    }, { passive: true });
  }
  
    // Intersection Observer for Scroll Animations
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if (fadeElements.length > 0) {
      const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('appear');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });
      
      fadeElements.forEach(element => {
        fadeObserver.observe(element);
      });
    }
    
  
    // Gallery Lightbox with improved UX
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    
    if (galleryItems.length > 0 && lightbox) {
      const lightboxImg = document.getElementById('lightbox-image');
      const lightboxCaption = document.querySelector('.lightbox-caption');
      const lightboxClose = document.querySelector('.lightbox-close');
      const lightboxPrev = document.querySelector('.lightbox-prev');
      const lightboxNext = document.querySelector('.lightbox-next');
      
      let currentImageIndex = 0;
      
      // Preload images for better lightbox performance
      function preloadImages() {
        galleryItems.forEach(item => {
          const img = new Image();
          img.src = item.querySelector('img').getAttribute('data-src');
        });
      }
      
      // Open lightbox
      galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
          currentImageIndex = index;
          updateLightbox();
          lightbox.style.display = 'block';
          document.body.style.overflow = 'hidden';
        });
      });
      
      // Close lightbox
      lightboxClose.addEventListener('click', closeLightbox);
      
      // Previous image
      lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightbox();
      });
      
      // Next image
      lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        updateLightbox();
      });
      
      // Close when clicking outside image
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });
      
      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
          switch(e.key) {
            case 'Escape':
              closeLightbox();
              break;
            case 'ArrowLeft':
              currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
              updateLightbox();
              break;
            case 'ArrowRight':
              currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
              updateLightbox();
              break;
          }
        }
      });
      
      function updateLightbox() {
        const imgElement = galleryItems[currentImageIndex].querySelector('img');
        const imgSrc = imgElement.getAttribute('data-src');
        const imgAlt = imgElement.getAttribute('alt');
        
        // Add loading class
        lightboxImg.classList.add('loading');
        
        // Load image
        const img = new Image();
        img.src = imgSrc;
        img.onload = () => {
          lightboxImg.setAttribute('src', imgSrc);
          lightboxImg.setAttribute('alt', imgAlt);
          lightboxCaption.textContent = imgAlt;
          lightboxImg.classList.remove('loading');
        };
      }
      
      function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
      }
      
      // Preload images after page load
      window.addEventListener('load', preloadImages);
    }
  
    // Interactive Map with improved accessibility
    const mapAreas = document.querySelectorAll('.map-area');
    const mapMarkers = document.querySelectorAll('.map-marker');
    
    if (mapAreas.length > 0 || mapMarkers.length > 0) {
      const mapLocationTitle = document.getElementById('map-location-title');
      const mapLocationDesc = document.getElementById('map-location-description');
      
      const locationInfo = {
        'manhattan': {
          title: 'Manhattan',
          desc: 'The most densely populated borough and home to most of NYC\'s iconic landmarks including Times Square, Central Park, and the Empire State Building.'
        },
        'brooklyn': {
          title: 'Brooklyn',
          desc: 'Known for its cultural diversity, art scene, and distinct neighborhoods. Features attractions like the Brooklyn Bridge and Prospect Park.'
        },
        'queens': {
          title: 'Queens',
          desc: 'The largest borough and most ethnically diverse urban area in the world. Home to two major airports and Flushing Meadows Park.'
        },
        'bronx': {
          title: 'The Bronx',
          desc: 'Home of the New York Yankees and the birthplace of hip-hop. Features the Bronx Zoo and New York Botanical Garden.'
        },
        'staten-island': {
          title: 'Staten Island',
          desc: 'The most suburban of the five boroughs, known for the Staten Island Ferry and the Freshkills Park.'
        },
        'times-square': {
          title: 'Times Square',
          desc: 'The bustling commercial and entertainment hub known as "The Crossroads of the World" with its bright neon signs and Broadway theaters.'
        },
        'central-park': {
          title: 'Central Park',
          desc: 'An 843-acre urban park in Manhattan featuring lakes, meadows, and performance spaces, visited by millions annually.'
        },
        'brooklyn-bridge': {
          title: 'Brooklyn Bridge',
          desc: 'Completed in 1883, this iconic suspension bridge connects Manhattan and Brooklyn across the East River.'
        },
        'statue-liberty': {
          title: 'Statue of Liberty',
          desc: 'A colossal neoclassical sculpture on Liberty Island, a universal symbol of freedom and democracy.'
        },
        'met-museum': {
          title: 'Metropolitan Museum of Art',
          desc: 'The largest art museum in the Western Hemisphere with collections spanning 5,000 years of world culture.'
        },
        'yankee-stadium': {
          title: 'Yankee Stadium',
          desc: 'Home of the 27-time World Series champion New York Yankees, located in the Bronx.'
        }
      };
      
      // Add click events to map areas and markers
      [...mapAreas, ...mapMarkers].forEach(element => {
        element.addEventListener('click', function() {
          const locationId = this.id;
          if (locationInfo[locationId]) {
            mapLocationTitle.textContent = locationInfo[locationId].title;
            mapLocationDesc.textContent = locationInfo[locationId].desc;
          }
        });
        
        // Add keyboard accessibility
        element.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const locationId = this.id;
            if (locationInfo[locationId]) {
              mapLocationTitle.textContent = locationInfo[locationId].title;
              mapLocationDesc.textContent = locationInfo[locationId].desc;
            }
          }
        });
      });
    }
  
    // Lazy Loading Images with improved performance
    const lazyImages = document.querySelectorAll('.lazy');
    
    if (lazyImages.length > 0) {
      const lazyObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.getAttribute('data-src');
            img.onload = () => {
              img.classList.remove('lazy');
            };
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '200px 0px',
        threshold: 0.01
      });
      
      lazyImages.forEach(img => {
        lazyObserver.observe(img);
      });
    }
  
    // Newsletter Form with validation
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (validateEmail(email)) {
          // In a real app, you would send this to your server
          alert(`Thank you for subscribing with ${email}! We'll keep you updated on NYC.`);
          this.reset();
        } else {
          alert('Please enter a valid email address.');
          emailInput.focus();
        }
      });
      
      function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
      }
    }
  
    // Video fallback handler
    const heroVideo = document.getElementById('hero-video');
    
    if (heroVideo) {
      // Check if video can play
      heroVideo.addEventListener('error', function() {
        const fallback = document.querySelector('.video-fallback');
        if (fallback) {
          fallback.style.display = 'block';
          heroVideo.style.display = 'none';
        }
      });
      
      // For mobile devices
      heroVideo.setAttribute('playsinline', '');
      heroVideo.setAttribute('muted', '');
      heroVideo.setAttribute('autoplay', '');
      heroVideo.setAttribute('loop', '');
      
      // Try to play the video
      const playPromise = heroVideo.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          const fallback = document.querySelector('.video-fallback');
          if (fallback) {
            fallback.style.display = 'block';
            heroVideo.style.display = 'none';
          }
        });
      }
    }
  });