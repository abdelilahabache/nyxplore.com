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

// Sound Toggle with Initial Volume Set to 10%
// Sound Toggle - Visitor Controlled Version
const soundToggle = document.getElementById('sound-toggle');
const ambientSound = document.getElementById('ambient-sound');
let isSoundOn = localStorage.getItem('sound') === 'on'; // Defaults to off if not set

// Configure audio settings
ambientSound.volume = 0.1; // 10% volume (when turned on)
ambientSound.loop = false; // Don't loop

// Always start muted (regardless of previous setting)
soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
ambientSound.pause();

// Toggle functionality
soundToggle.addEventListener('click', function() {
  if (isSoundOn) {
    // Turn sound OFF
    ambientSound.pause();
    soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
    localStorage.setItem('sound', 'off');
  } else {
    // Turn sound ON
    ambientSound.currentTime = 0; // Reset to start
    ambientSound.play()
      .then(() => {
        soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
        localStorage.setItem('sound', 'on');
      })
      .catch(e => {
        console.log("Play failed:", e);
        // Show some UI indication that play was blocked if needed
      });
  }
  isSoundOn = !isSoundOn;
});

// Handle case where sound was previously on
// (but still require user interaction to start)
if (isSoundOn) {
  soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
  // Note: We don't autoplay here - waiting for user click
}
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
// Newsletter form handling
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


// ===== Culture Section - Optimized Final Version =====
document.addEventListener('DOMContentLoaded', function() {
  // 1. Initialize Elements
  const filterButtons = document.querySelectorAll('.culture-filter .filter-btn');
  const masonryItems = document.querySelectorAll('.masonry-item');
  const masonryGrid = document.querySelector('.masonry-grid');

  // 2. Image Loading Handler
  const loadImages = () => {
    document.querySelectorAll('.masonry-image').forEach(img => {
      // Skip if already loaded
      if (img.classList.contains('loaded')) return;
      
      // Use small placeholder for initial load
      const smallSrc = img.dataset.small || img.src;
      const actualSrc = img.dataset.src || img.src;
      
      // Load small image first
      const tempImg = new Image();
      tempImg.src = smallSrc;
      tempImg.onload = () => {
        img.src = smallSrc;
        img.classList.add('loaded');
        
        // Then load full quality
        setTimeout(() => {
          const fullImg = new Image();
          fullImg.src = actualSrc;
          fullImg.onload = () => {
            img.src = actualSrc;
            updateMasonryLayout();
          };
        }, 300);
      };
    });
  };

  // 3. Filter Functionality
  const applyFilters = () => {
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Update active button
        filterButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-pressed', 'true');
        
        // Filter items
        const filterValue = this.dataset.filter;
        masonryItems.forEach(item => {
          const match = filterValue === 'all' || 
                       item.dataset.category === filterValue;
          
          item.style.display = match ? 'flex' : 'none';
          item.setAttribute('aria-hidden', !match);
        });
        
        // Update layout after filtering
        setTimeout(updateMasonryLayout, 50);
      });
    });
  };

  // 4. Masonry Layout Calculator
  const updateMasonryLayout = () => {
    if (!masonryGrid || window.innerWidth <= 768) return;
    
    const rowHeight = parseInt(getComputedStyle(masonryGrid).gridAutoRows);
    const rowGap = parseInt(getComputedStyle(masonryGrid).gridRowGap);
    
    document.querySelectorAll('.masonry-item:nth-child(3n+1)').forEach(item => {
      if (item.style.display === 'none') return;
      
      const contentHeight = item.querySelector('.image-container').offsetHeight + 
                          item.querySelector('.masonry-content').offsetHeight;
      
      const rowSpan = Math.ceil((contentHeight + rowGap) / (rowHeight + rowGap));
      item.style.gridRowEnd = `span ${rowSpan}`;
    });
  };

  // 5. Click Handlers with Loading States
  const setupItemInteractions = () => {
    masonryItems.forEach(item => {
      // Accessibility
      item.setAttribute('tabindex', '0');
      
      // Click handler
      item.addEventListener('click', function(e) {
        if (e.target.closest('.explore-button')) {
          e.preventDefault();
          const button = e.target.closest('.explore-button');
          
          // Loading state
          button.innerHTML = `
            <span>Loading...</span>
            <i class="fas fa-spinner fa-spin"></i>
          `;
          button.style.pointerEvents = 'none';
          
          // Simulate loading delay
          setTimeout(() => {
            window.location.href = this.href;
          }, 500);
        }
      });
      
      // Keyboard support
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          this.click();
        }
      });
    });
  };

  // 6. Intersection Observer for Lazy Loading
  const initIntersectionObserver = () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = entry.target;
          observer.unobserve(item);
          
          // Load images for this item
          const img = item.querySelector('.masonry-image');
          if (img && !img.classList.contains('loaded')) {
            img.src = img.dataset.src || img.src;
            img.onload = () => {
              img.classList.add('loaded');
              updateMasonryLayout();
            };
          }
        }
      });
    }, {
      rootMargin: '200px 0px',
      threshold: 0.01
    });
    
    masonryItems.forEach(item => {
      observer.observe(item);
    });
  };

  // 7. Window Resize Handler
  const handleResize = () => {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      updateMasonryLayout();
    }, 100);
  };

  // Initialize Everything
  const initCultureSection = () => {
    applyFilters();
    setupItemInteractions();
    initIntersectionObserver();
    updateMasonryLayout();
    
    // Set default filter
    document.querySelector('.culture-filter .filter-btn[data-filter="all"]')?.click();
    
    // Event listeners
    window.addEventListener('resize', handleResize);
    
    // Initial image load for visible items
    setTimeout(loadImages, 300);
  };

  initCultureSection();
});




// FOOD SECTION - COMPLETE JAVASCRIPT 
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

  // 5. Updated "View Places" Button Handling with unique links
  document.querySelectorAll('.food-button').forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      const link = this.getAttribute('data-link');
      if (link) {
        window.location.href = link;
      }
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

    document.addEventListener('DOMContentLoaded', function() {
  const parallaxItems = document.querySelectorAll('.parallax-item');
  let lastScrollPos = 0;
  let ticking = false;

  // Combined functionality
  function updateParallax() {
    const scrollTop = window.pageYOffset;
    parallaxItems.forEach(item => {
      const speed = parseFloat(item.dataset.speed) || 0.1;
      const img = item.querySelector('.parallax-image');
      const content = item.querySelector('.parallax-content');
      const rect = item.getBoundingClientRect();
      
      // Only animate when in viewport (performance optimization)
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        // Parallax effect
        if (img) {
          const yPos = -(scrollTop * speed * 0.5); // Reduced intensity
          img.style.transform = `translateY(${yPos}px)`;
        }
        
        // Content reveal
        if (content) {
          const revealPoint = window.innerHeight * 0.8;
          if (rect.top < revealPoint) {
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
            
            // Animate button separately with delay
            const button = item.querySelector('.landmark-button');
            if (button) {
              setTimeout(() => {
                button.style.transform = 'translateY(0)';
                button.style.opacity = '1';
              }, 200);
            }
          }
        }
      }
    });
    ticking = false;
  }

  // Scroll handler with requestAnimationFrame
  window.addEventListener('scroll', function() {
    if (!ticking && window.innerWidth > 768) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  });

  // Initialize mobile state
  if (window.innerWidth <= 768) {
    parallaxItems.forEach(item => {
      const content = item.querySelector('.parallax-content');
      const button = item.querySelector('.landmark-button');
      if (content) content.style.opacity = '1';
      if (button) {
        button.style.opacity = '1';
        button.style.transform = 'none';
        button.style.pointerEvents = 'auto';
      }
    });
  }

  // Click handling with improved feedback
  parallaxItems.forEach(card => {
    card.addEventListener('click', function(e) {
      if (!e.target.closest('.landmark-button') && this.href) {
        e.preventDefault();
        this.style.transform = 'scale(0.97)';
        setTimeout(() => {
          window.location.href = this.href;
        }, 200);
      }
    });

    // Keyboard navigation
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && this.href) {
        window.location.href = this.href;
      }
    });

    // Hover effects (desktop only)
    if (window.innerWidth > 768) {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    }
  });

  // Initial animation trigger
  updateParallax();
});

// Scroll to Top Button with Progress Indicator
document.addEventListener('DOMContentLoaded', function() {
  const scrollTopBtn = document.querySelector('.scroll-top');

  if (scrollTopBtn) {
      function updateScrollProgress() {
          const scrollHeight = document.documentElement.scrollHeight;
          const clientHeight = document.documentElement.clientHeight;
          const scrollable = scrollHeight - clientHeight;
          const scrolled = window.scrollY;
          
          // Update button visibility
          if (scrolled > 300) {
              scrollTopBtn.classList.add('show');
          } else {
              scrollTopBtn.classList.remove('show');
          }
          
          // Update progress circle
          const progress = scrolled / scrollable;
          const circumference = 307.919; // This matches your SVG path length
          const offset = circumference - (progress * circumference);
          
          const path = scrollTopBtn.querySelector('path');
          path.style.strokeDashoffset = offset;
      }

      function scrollToTop() {
          window.scrollTo({
              top: 0,
              behavior: 'smooth'
          });
      }

      // Event Listeners
      window.addEventListener('scroll', updateScrollProgress);
      scrollTopBtn.addEventListener('click', scrollToTop);

      // Initialize on load
      updateScrollProgress();
  }
});



// Disable keyboard shortcuts for dev tools
document.addEventListener('keydown', function(e) {
  // Disable F12
  if (e.key === 'F12') {
    e.preventDefault();
    alert('F12 is disabled');
  }
  
  // Disable Ctrl+Shift+I (Chrome, Firefox, Edge)
  if (e.ctrlKey && e.shiftKey && e.key === 'I') {
    e.preventDefault();
    alert('Developer tools are disabled');
  }
  
  // Disable Ctrl+Shift+J (Chrome)
  if (e.ctrlKey && e.shiftKey && e.key === 'J') {
    e.preventDefault();
    alert('Developer tools are disabled');
  }
  
  // Disable Ctrl+U (View source)
  if (e.ctrlKey && e.key === 'u') {
    e.preventDefault();
    alert('View source is disabled');
  }
});



// Cultural Events Calendar
document.addEventListener('DOMContentLoaded', function() {
  // Sample events data (in production, you would fetch this from an API)
  const events = [
      {
          id: 1,
          title: "Broadway Night at Times Square",
          date: new Date(2023, 4, 15),
          time: "7:00 PM",
          location: "Times Square",
          category: "performance"
      },
      {
          id: 2,
          title: "Metropolitan Museum Tour",
          date: new Date(2023, 4, 18),
          time: "10:00 AM",
          location: "The Met",
          category: "art"
      },

      {
          id: 4,
          title: "Chinatown Food Festival",
          date: new Date(2023, 4, 22),
          time: "12:00 PM",
          location: "Chinatown",
          category: "food"
      },
      {
          id: 5,
          title: "Brooklyn Street Art Walk",
          date: new Date(2023, 4, 25),
          time: "2:00 PM",
          location: "Bushwick Collective",
          category: "art"
      }
  ];

  // Calendar variables
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();
  let selectedDate = new Date();

  // DOM elements
  const calendarDays = document.getElementById('calendar-days');
  const currentMonthElement = document.getElementById('current-month');
  const prevMonthBtn = document.getElementById('prev-month');
  const nextMonthBtn = document.getElementById('next-month');
  const eventsContainer = document.querySelector('.events-list');

  // Initialize calendar
  renderCalendar(currentMonth, currentYear);
  renderEvents(selectedDate);

  // Event listeners
  prevMonthBtn.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
      }
      renderCalendar(currentMonth, currentYear);
  });

  nextMonthBtn.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
      }
      renderCalendar(currentMonth, currentYear);
  });

  // Render calendar
  function renderCalendar(month, year) {
      // Update month/year display
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      currentMonthElement.textContent = `${monthNames[month]} ${year}`;

      // Clear previous days
      calendarDays.innerHTML = '';

      // Get first day of month and total days
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const today = new Date();

      // Add empty cells for days before first day of month
      for (let i = 0; i < firstDay; i++) {
          const emptyDay = document.createElement('div');
          emptyDay.className = 'calendar-day other-month';
          calendarDays.appendChild(emptyDay);
      }

      // Add days of month
      for (let day = 1; day <= daysInMonth; day++) {
          const dayElement = document.createElement('div');
          dayElement.className = 'calendar-day';
          dayElement.innerHTML = `<span class="calendar-day-number">${day}</span>`;

          const currentDate = new Date(year, month, day);

          // Check if day is today
          if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
              dayElement.classList.add('today');
          }

          // Check if day has events
          if (hasEvents(currentDate)) {
              dayElement.classList.add('has-event');
          }

          // Check if day is selected
          if (day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
              dayElement.classList.add('selected');
          }

          // Add click event
          dayElement.addEventListener('click', () => {
              selectedDate = new Date(year, month, day);
              renderCalendar(currentMonth, currentYear);
              renderEvents(selectedDate);
          });

          calendarDays.appendChild(dayElement);
      }
  }

  // Check if date has events
  function hasEvents(date) {
      return events.some(event => 
          event.date.getDate() === date.getDate() &&
          event.date.getMonth() === date.getMonth() &&
          event.date.getFullYear() === date.getFullYear()
      );
  }

  // Render events for selected date
  function renderEvents(date) {
      // Clear previous events
      eventsContainer.innerHTML = '';

      // Filter events for selected date
      const dayEvents = events.filter(event => 
          event.date.getDate() === date.getDate() &&
          event.date.getMonth() === date.getMonth() &&
          event.date.getFullYear() === date.getFullYear()
      );

      // Display events or "no events" message
      if (dayEvents.length > 0) {
          dayEvents.forEach(event => {
              const eventElement = document.createElement('div');
              eventElement.className = 'event-item';
              eventElement.innerHTML = `
                  <div class="event-date">
                      <span class="event-date-month">${event.date.toLocaleString('default', { month: 'short' })}</span>
                      <span class="event-date-day">${event.date.getDate()}</span>
                  </div>
                  <div class="event-details">
                      <h4 class="event-title">${event.title}</h4>
                      <div class="event-time">
                          <i class="far fa-clock"></i> ${event.time}
                      </div>
                      <div class="event-location">
                          <i class="fas fa-map-marker-alt"></i> ${event.location}
                      </div>
                  </div>
              `;
              eventsContainer.appendChild(eventElement);
          });
      } else {
          const noEvents = document.createElement('div');
          noEvents.className = 'no-events';
          noEvents.textContent = 'No events scheduled for this date';
          eventsContainer.appendChild(noEvents);
      }
  }

  // Event submission (example functionality)
  document.getElementById('add-event-btn').addEventListener('click', function() {
      // In a real implementation, this would open a modal or redirect to a form
      alert('Event submission form would open here. In production, you would connect this to your backend.');
  });
});

// Search Functionality
document.addEventListener('DOMContentLoaded', function() {
  const searchForm = document.querySelector('.search-form');
  
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const searchInput = this.querySelector('.search-input');
      const query = searchInput.value.trim();
      
      if (query) {
        // Here you would implement your search functionality
        // For now, we'll just log it and scroll to matching sections
        console.log('Searching for:', query);
        
        // Simple content matching - in a real implementation, you'd want a more robust search
        const matchingSections = Array.from(document.querySelectorAll('section')).filter(section => {
          return section.textContent.toLowerCase().includes(query.toLowerCase());
        });
        
        if (matchingSections.length > 0) {
          // Scroll to first matching section
          matchingSections[0].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          
          // Highlight matching sections temporarily
          matchingSections.forEach(section => {
            section.style.boxShadow = '0 0 0 3px var(--accent-color)';
            setTimeout(() => {
              section.style.boxShadow = 'none';
            }, 3000);
          });
        } else {
          // No results found
          alert(`No results found for "${query}". Try a different search term.`);
        }
        
        // Track search in analytics
        if (typeof gtag === 'function') {
          gtag('event', 'search', {
            'search_term': query
          });
        }
      }
    });
  }
  
  // Mobile search toggle (optional)
  const mobileMenuButton = document.getElementById('mobile-menu');
  const searchContainer = document.querySelector('.search-container');
  
  if (mobileMenuButton && searchContainer) {
    mobileMenuButton.addEventListener('click', function() {
      // On mobile, hide search when menu is open for better UX
      if (window.innerWidth <= 992) {
        if (this.classList.contains('active')) {
          searchContainer.style.display = 'none';
        } else {
          searchContainer.style.display = 'block';
        }
      }
    });
  }
});

// NYC-themed search suggestions
const nycSearchSuggestions = [
  { text: "Times Square", category: "landmark", icon: "fa-landmark" },
  { text: "Statue of Liberty", category: "landmark", icon: "fa-monument" },
  { text: "Central Park", category: "park", icon: "fa-tree" },
  { text: "Broadway", category: "arts", icon: "fa-theater-masks", url: "broadway.html" },
  { text: "Metropolitan Museum", category: "museum", icon: "fa-university" },
  { text: "Pizza Places", category: "food", icon: "fa-pizza-slice" },
  { text: "Brooklyn Bridge", category: "landmark", icon: "fa-bridge" }, 
  { text: "Chinatown Restaurants", category: "food", icon: "fa-utensils" },
  { text: "Subway Map", category: "transport", icon: "fa-subway" },
  { text: "Nightlife", category: "entertainment", icon: "fa-cocktail" },
  { text: "Street Art", category: "art", icon: "fa-paint-brush" },
  { text: "Yankee Stadium", category: "sports", icon: "fa-baseball-ball" },
  { text: "Bagels", category: "food", icon: "fa-bread-slice" },
  { text: "Skyline Views", category: "photo", icon: "fa-camera" },
  { text: "Williamsburg", category: "neighborhood", icon: "fa-map-marker-alt" },
  { text: "MoMA", category: "museum", icon: "fa-palette" },
  { text: "High Line", category: "park", icon: "fa-tree" },
  { text: "Greenwich Village", category: "neighborhood", icon: "fa-map-marker-alt" },
  { text: "Brooklyn Heights", category: "neighborhood", icon: "fa-map-marker-alt" },
  { text: "Pizza", category: "food", icon: "fa-pizza-slice", url: "nyc-pizza.html" },
  { text: "Bagels", category: "food", icon: "fa-bread-slice", url: "nyc-bagels.html" },
  { text: "Hot Dogs", category: "food", icon: "fa-hotdog", url: "nyc-hotdogs.html" },
  { text: "International Food", category: "food", icon: "fa-globe-americas", url: "international-food.html" },
];

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.querySelector('.search-input');
  const searchSuggestions = document.querySelector('.search-suggestions');
  
  if (searchInput && searchSuggestions) {
    // Show suggestions when input is focused
    searchInput.addEventListener('focus', function() {
      showAllSuggestions();
    });
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.search-input-wrapper')) {
        searchSuggestions.classList.remove('visible');
      }
    });
    
    // Handle input for dynamic suggestions
    searchInput.addEventListener('input', function() {
      const query = this.value.trim().toLowerCase();
      
      if (query.length > 0) {
        showFilteredSuggestions(query);
      } else {
        showAllSuggestions();
      }
    });
    
    // Keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
      const activeSuggestion = document.querySelector('.search-suggestion-item.highlighted');
      
      // Arrow down
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!activeSuggestion) {
          highlightFirstSuggestion();
        } else {
          highlightNextSuggestion(activeSuggestion);
        }
      }
      
      // Arrow up
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (activeSuggestion) {
          highlightPreviousSuggestion(activeSuggestion);
        }
      }
      
      // Enter
      if (e.key === 'Enter' && activeSuggestion) {
        e.preventDefault();
        searchInput.value = activeSuggestion.textContent;
        searchInput.focus();
        searchSuggestions.classList.remove('visible');
      }
    });
    
    // Handle form submission
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        performSearch(searchInput.value.trim());
      });
    }
  }
  
  function showAllSuggestions() {
    renderSuggestions(nycSearchSuggestions);
    searchSuggestions.classList.add('visible');
  }
  
  function showFilteredSuggestions(query) {
    const filtered = nycSearchSuggestions.filter(item => 
      item.text.toLowerCase().includes(query)
    );
    renderSuggestions(filtered);
    searchSuggestions.classList.add('visible');
  }
  
  function renderSuggestions(items) {
    searchSuggestions.innerHTML = '';
    
    if (items.length === 0) {
      searchSuggestions.innerHTML = `
        <div class="search-suggestion-item no-results">
          <i class="fas fa-search"></i>
          No matching suggestions found
        </div>
      `;
      return;
    }
    
    items.forEach(item => {
      const suggestion = document.createElement('div');
      suggestion.className = 'search-suggestion-item';
      suggestion.innerHTML = `
        <i class="fas ${item.icon}"></i>
        ${item.text}
      `;
      
      suggestion.addEventListener('click', function() {
        searchInput.value = item.text;
        performSearch(item.text);
        searchSuggestions.classList.remove('visible');
      });
      
      searchSuggestions.appendChild(suggestion);
    });
  }
  
  function highlightFirstSuggestion() {
    const first = searchSuggestions.querySelector('.search-suggestion-item');
    if (first) {
      first.classList.add('highlighted');
    }
  }
  
  function highlightNextSuggestion(current) {
    current.classList.remove('highlighted');
    const next = current.nextElementSibling;
    if (next) {
      next.classList.add('highlighted');
      next.scrollIntoView({ block: 'nearest' });
    } else {
      highlightFirstSuggestion();
    }
  }
  
  function highlightPreviousSuggestion(current) {
    current.classList.remove('highlighted');
    const prev = current.previousElementSibling;
    if (prev) {
      prev.classList.add('highlighted');
      prev.scrollIntoView({ block: 'nearest' });
    }
  }
  
  function performSearch(query) {
    if (!query) return;
    
    // In a real implementation, you would:
    // 1. Search your content or call an API
    // 2. Display results on a search page or highlight matches
    
    console.log('Searching for:', query);
    
    // Simple implementation - scroll to matching section
    const matchingSection = Array.from(document.querySelectorAll('section')).find(section => 
      section.textContent.toLowerCase().includes(query.toLowerCase())
    );
    
    if (matchingSection) {
      matchingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Temporary highlight
      matchingSection.style.boxShadow = '0 0 0 3px var(--accent-color)';
      setTimeout(() => {
        matchingSection.style.boxShadow = 'none';
      }, 3000);
    } else {
      alert(`No results found for "${query}". Try a different search term.`);
    }
    
    // Track in analytics
    if (typeof gtag === 'function') {
      gtag('event', 'search', {
        'search_term': query
      });
    }
  }
});

// blogs section



document.addEventListener('DOMContentLoaded', function() {
  const carousel = document.querySelector('.blog-carousel');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const cards = document.querySelectorAll('.blog-card');
  const cardWidth = cards[0].offsetWidth + 25; // Width + gap
  
  // Scroll to next set of cards
  nextBtn.addEventListener('click', () => {
    carousel.scrollBy({
      left: cardWidth * 2, // Scroll 2 cards at a time
      behavior: 'smooth'
    });
  });
  
  // Scroll to previous set of cards
  prevBtn.addEventListener('click', () => {
    carousel.scrollBy({
      left: -cardWidth * 2, // Scroll 2 cards at a time
      behavior: 'smooth'
    });
  });
  
  // Update button visibility based on scroll position
  carousel.addEventListener('scroll', () => {
    const scrollPos = carousel.scrollLeft;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    
    prevBtn.style.opacity = scrollPos > 10 ? '1' : '0.5';
    nextBtn.style.opacity = scrollPos < maxScroll - 10 ? '1' : '0.5';
  });
  
  // Touch/swipe support for mobile
  let isDragging = false;
  let startX;
  let scrollLeft;
  
  carousel.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
    carousel.style.cursor = 'grabbing';
    carousel.style.scrollBehavior = 'auto';
  });
  
  carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
  });
  
  const endDrag = () => {
    isDragging = false;
    carousel.style.cursor = 'grab';
    carousel.style.scrollBehavior = 'smooth';
  };
  
  carousel.addEventListener('mouseup', endDrag);
  carousel.addEventListener('mouseleave', endDrag);
  
  // Touch events for mobile
  carousel.addEventListener('touchstart', (e) => {
    isDragging = true;
    startX = e.touches[0].pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });
  
  carousel.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
  });
  
  carousel.addEventListener('touchend', endDrag);
});



// Auto-hide Navbar Logic
document.addEventListener('DOMContentLoaded', function() {
  const navbar = document.querySelector('.navbar');
  const scrollThreshold = 100; // Pixels to scroll before hiding
  let lastScroll = 0;
  
  // Mobile menu check (if you have one)
  const mobileMenu = document.querySelector('.navbar-menu');
  let isMobileMenuOpen = false;
  
  if (mobileMenu) {
    mobileMenu.addEventListener('click', function() {
      isMobileMenuOpen = this.classList.contains('active');
    });
  }

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    // At top of page or mobile menu open - always show
    if (currentScroll <= 0 || isMobileMenuOpen) {
      navbar.classList.remove('hide');
      return;
    }
    
    // Scrolling DOWN - hide
    if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
      navbar.classList.add('hide');
    } 
    // Scrolling UP - show
    else if (currentScroll < lastScroll) {
      navbar.classList.remove('hide');
    }
    
    lastScroll = currentScroll;
  });
});