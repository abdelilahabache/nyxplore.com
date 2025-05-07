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
  if (document.body.getAttribute('data-theme') !== 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.removeAttribute('data-theme');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', 'light');
  }
});

// Sound Toggle - Corrected Version
const soundToggle = document.getElementById('sound-toggle');
const ambientSound = document.getElementById('ambient-sound');
let isSoundOn = localStorage.getItem('sound') === 'on';

// Initialize icon (volume-up when sound is ON, mute when OFF)
if (isSoundOn) {
  soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>'; // Sound ON → Volume UP
  ambientSound.play().catch(e => console.log("Audio autoplay blocked:", e));
} else {
  soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>'; // Sound OFF → Mute
}

soundToggle.addEventListener('click', function() {
  if (isSoundOn) {
    ambientSound.pause();
    soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>'; // Mute when turning OFF
    localStorage.setItem('sound', 'off');
  } else {
    ambientSound.play()
      .then(() => {
        soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>'; // Volume UP when turning ON
        localStorage.setItem('sound', 'on');
      })
      .catch(e => console.log("Audio play failed:", e));
  }
  isSoundOn = !isSoundOn;
}); 
  // Mobile Menu Toggle
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

  // Sticky Navbar on Scroll
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
        const offset = 80; // 
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

  // Interactive Map
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

  // Lazy Loading Images
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

  document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('input[type="email"]');
        const submitButton = this.querySelector('button[type="submit"]');
        const email = emailInput.value.trim();
        const successMessage = this.nextElementSibling;
        
        if (!validateEmail(email)) {
          emailInput.setAttribute('aria-invalid', 'true');
          alert('Please enter a valid email address.');
          emailInput.focus();
          return;
        }
        
        // Add loading state
        submitButton.classList.add('loading');
        submitButton.setAttribute('aria-busy', 'true');
        
        try {
          const formData = new FormData(this);
          formData.append('form-name', 'newsletter');
          
          const response = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams(formData)
          });
          
          if (response.ok) {
            // Show success message
            successMessage.style.display = 'block';
            emailInput.setAttribute('aria-invalid', 'false');
            
            // Hide after 3 seconds
            setTimeout(() => {
              successMessage.style.display = 'none';
            }, 3000);
            
            // Reset form
            this.reset();
          } else {
            throw new Error('Network response was not ok');
          }
        } catch (error) {
          console.error('Error:', error);
          alert('Subscription failed. Please try again later.');
        } finally {
          // Remove loading state
          submitButton.classList.remove('loading');
          submitButton.removeAttribute('aria-busy');
        }
      });
      
      // Real-time email validation
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      emailInput.addEventListener('input', function() {
        this.setAttribute('aria-invalid', !validateEmail(this.value.trim()));
      });
    }
    
    function validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
  });

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

// hero-cta.js
document.addEventListener('DOMContentLoaded', function() {
  const ctaButton = document.querySelector('.cta-button');
  
  if (ctaButton) {
    // 1. Smooth Scroll to First Section
    ctaButton.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Scroll to landmarks section (or any target)
      const targetSection = document.getElementById('landmarks');
      if (targetSection) {
        targetSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }

      // 2. Optional: Analytics Event (Google Analytics example)
      if (typeof gtag === 'function') {
        gtag('event', 'click', {
          'event_category': 'CTA',
          'event_label': 'Hero Button Click'
        });
      }
      
      // 3. Ripple Effect (Visual feedback)
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      this.appendChild(ripple);
      
      // Remove ripple after animation
      setTimeout(() => ripple.remove(), 600);
    });
    
    // 4. Keyboard Accessibility
    ctaButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        ctaButton.click();
      }
    });
  }
});
// Culture Section Interaction
document.addEventListener('DOMContentLoaded', function() {
  // Add buttons to masonry items
  document.querySelectorAll('.masonry-item').forEach(item => {
    const content = item.querySelector('.masonry-content');
    if (content && !content.querySelector('.explore-culture-btn')) {
      const btn = document.createElement('button');
      btn.className = 'explore-culture-btn';
      btn.textContent = 'Quick View';
      btn.setAttribute('aria-label', 'Quick view of this cultural item');
      content.appendChild(btn);
    }
  });

  // Modal functionality
  const modal = document.createElement('div');
  modal.className = 'culture-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="close-modal" aria-label="Close modal">&times;</button>
      <div class="modal-body"></div>
    </div>
  `;
  document.body.appendChild(modal);

  // Click handlers
  document.querySelectorAll('.masonry-item').forEach(item => {
    const btn = item.querySelector('.explore-culture-btn');
    const title = item.querySelector('h3')?.textContent;
    const imgSrc = item.querySelector('img')?.src;
    const description = item.querySelector('p')?.textContent;

    btn?.addEventListener('click', (e) => {
      e.stopPropagation();
      modal.querySelector('.modal-body').innerHTML = `
        <h2>${title}</h2>
        <img src="${imgSrc}" alt="${title}" loading="lazy" class="modal-image">
        <p>${description}</p>
        <a href="#map" class="modal-map-link">Find on Map</a>
      `;
      modal.classList.add('active');
    });
  });

  // Close modal
  modal.querySelector('.close-modal').addEventListener('click', () => {
    modal.classList.remove('active');
  });

  // Close when clicking outside
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });
});

// ==============================================
// FOOD SECTION - COMPLETE JAVASCRIPT
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
  // 1. Initialize Elements
  const foodCards = document.querySelectorAll('.food-card');
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  // 2. Device Detection
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // 3. Mobile Tap Handling
  if (isTouchDevice) {
    foodCards.forEach(card => {
      card.addEventListener('click', function(e) {
        // Ignore clicks on the "View Places" button
        if (!e.target.closest('.food-button')) {
          // Close other flipped cards first
          document.querySelectorAll('.food-card.flipped').forEach(flippedCard => {
            if (flippedCard !== this) flippedCard.classList.remove('flipped');
          });
          // Toggle current card
          this.classList.toggle('flipped');
        }
      });
    });
  }

  // 4. Filter Functionality
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Update active button state
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-pressed', 'true');
      
      // Get filter category
      const filterValue = this.dataset.filter;
      
      // Filter cards
      foodCards.forEach(card => {
        const cardCategory = card.dataset.category;
        const shouldShow = filterValue === 'all' || cardCategory === filterValue;
        
        card.style.display = shouldShow ? 'block' : 'none';
        card.setAttribute('aria-hidden', !shouldShow);
        
        // Reset flip state when filtering
        if (shouldShow) card.classList.remove('flipped');
      });
    });
  });

  // 5. "View Places" Button Handling
  document.querySelectorAll('.food-button').forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent card flip
      const foodType = this.closest('.food-card').querySelector('h3').textContent;
      
      // Your action here (example):
      console.log(`Opening locations for: ${foodType}`);
      // highlightOnMap(foodType); // If you have map integration
    });
  });

  // 6. Initialize default state
  function initFoodSection() {
    // Activate "All" filter by default
    document.querySelector('.filter-btn[data-filter="all"]')?.classList.add('active');
    
    // Make sure all cards are visible initially
    foodCards.forEach(card => {
      card.style.display = 'block';
      card.setAttribute('aria-hidden', 'false');
    });
  }

  initFoodSection();
});

    // Parallax Effect
    document.addEventListener('DOMContentLoaded', function() {
         const parallaxItems = document.querySelectorAll('.parallax-item');
        if (window.innerWidth > 768) {
            window.addEventListener('scroll', function() {
                parallaxItems.forEach(item => {
                    const speed = parseFloat(item.getAttribute('data-speed'));
                    const yPos = -(window.scrollY * speed);
                     const img = item.querySelector('.parallax-image');
                    if (img) {
                        img.style.transform = `translateY(${yPos}px)`;
                     }
                    const content = item.querySelector('.parallax-content');
                    const itemTop = item.getBoundingClientRect().top;
                    const windowHeight = window.innerHeight;
                    
                    if (itemTop < windowHeight * 0.75) {
                        content.style.opacity = '1';
                        content.style.transform = 'translateY(0)';
                    }
                });
            }, { passive: true });
         } else {
            parallaxItems.forEach(item => {
                const content = item.querySelector('.parallax-content');
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            });
        }
    });
   // Final Landmarks Interaction Script
document.addEventListener('DOMContentLoaded', function() {
  // Get all landmark cards
  const landmarkCards = document.querySelectorAll('.parallax-item');
  
  // Add click handling to each card
  landmarkCards.forEach(card => {
    card.addEventListener('click', function(e) {
      // Only navigate if the click wasn't on the button itself
      if (!e.target.closest('.landmark-button') && this.href) {
        window.location.href = this.href;
      }
    });
    
    // Optional: Add keyboard navigation support
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && this.href) {
        window.location.href = this.href;
      }
    });
  });
}); 