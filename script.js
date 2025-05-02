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

  soundToggle.addEventListener('click', function() {
      if (isSoundOn) {
          ambientSound.pause();
          soundToggle.innerHTML = '<i class="fas fa-volume-up"></i>';
      } else {
          ambientSound.play();
          soundToggle.innerHTML = '<i class="fas fa-volume-mute"></i>';
      }
      isSoundOn = !isSoundOn;
  });

  // Mobile Menu Toggle
  const mobileMenuButton = document.getElementById('mobile-menu');
  const navbarMenu = document.querySelector('.navbar-menu');

  mobileMenuButton.addEventListener('click', function() {
      mobileMenuButton.classList.toggle('active');
      navbarMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll('.navbar-link').forEach(link => {
      link.addEventListener('click', () => {
          mobileMenuButton.classList.remove('active');
          navbarMenu.classList.remove('active');
      });
  });

  // Sticky Navbar on Scroll
  window.addEventListener('scroll', function() {
      const navbar = document.querySelector('.navbar');
      navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Smooth Scrolling for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          if (targetElement) {
              window.scrollTo({
                  top: targetElement.offsetTop - 80,
                  behavior: 'smooth'
              });
          }
      });
  });

  // Parallax Effect
  const parallaxItems = document.querySelectorAll('.parallax-item');
  
  window.addEventListener('scroll', function() {
      parallaxItems.forEach(item => {
          const speed = parseFloat(item.getAttribute('data-speed'));
          const yPos = -(window.scrollY * speed);
          item.style.transform = `translateY(${yPos}px)`;
      });
  });

  // Intersection Observer for Scroll Animations
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
  };
  
  const fadeObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('appear');
              observer.unobserve(entry.target);
          }
      });
  }, observerOptions);
  
  fadeElements.forEach(element => {
      fadeObserver.observe(element);
  });

  // Gallery Lightbox
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  
  let currentImageIndex = 0;
  
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
  lightboxClose.addEventListener('click', () => {
      lightbox.style.display = 'none';
      document.body.style.overflow = 'auto';
  });
  
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
          lightbox.style.display = 'none';
          document.body.style.overflow = 'auto';
      }
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
      if (lightbox.style.display === 'block') {
          if (e.key === 'Escape') {
              lightbox.style.display = 'none';
              document.body.style.overflow = 'auto';
          } else if (e.key === 'ArrowLeft') {
              currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
              updateLightbox();
          } else if (e.key === 'ArrowRight') {
              currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
              updateLightbox();
          }
      }
  });
  
  function updateLightbox() {
      const imgSrc = galleryItems[currentImageIndex].querySelector('img').getAttribute('data-src');
      const imgAlt = galleryItems[currentImageIndex].querySelector('img').getAttribute('alt');
      
      lightboxImg.setAttribute('src', imgSrc);
      lightboxImg.setAttribute('alt', imgAlt);
      lightboxCaption.textContent = imgAlt;
  }

  // Interactive Map
  const mapAreas = document.querySelectorAll('.map-area');
  const mapMarkers = document.querySelectorAll('.map-marker');
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
  });

  // Lazy Loading Images
  const lazyImages = document.querySelectorAll('.lazy');
  
  const lazyObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              const img = entry.target;
              img.src = img.getAttribute('data-src');
              img.classList.remove('lazy');
              observer.unobserve(img);
          }
      });
  }, {
      rootMargin: '200px 0px'
  });
  
  lazyImages.forEach(img => {
      lazyObserver.observe(img);
  });

  // Newsletter Form
  const newsletterForm = document.getElementById('newsletter-form');
  
  newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      alert(`Thank you for subscribing with ${emailInput.value}! We'll keep you updated on NYC.`);
      this.reset();
  });
});