// Animation Controller
class AnimationController {
  static init() {
    // Initialize all animations
    this.initParticles();
    this.init3DCards();
    this.initScrollAnimations();
    this.initGradientFollow();
    this.initMorphingNav();
    this.initMobileNavigation();
    this.initSmoothScrolling();
  }

  static initParticles() {
    const heroSection = document.querySelector('.hero');
    if (heroSection) new ParticleSystem(heroSection, 15);
  }

  static init3DCards() {
    document.querySelectorAll('.card-3d').forEach(card => {
      new Parallax3D(card);
    });
  }

  static initScrollAnimations() {
    new ScrollAnimator();
  }

  static initGradientFollow() {
    const gradientElement = document.querySelector('.morphing-bg');
    if (gradientElement) new GradientFollow(gradientElement);
  }

  static initMorphingNav() {
    const mainNav = document.querySelector('nav');
    if (mainNav) new MorphingNav(mainNav);
  }

  static initMobileNavigation() {
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navList = document.querySelector('nav ul');

    if (!mobileNavToggle || !navList) return;

    mobileNavToggle.addEventListener('click', () => {
      navList.classList.toggle('active');
      mobileNavToggle.innerHTML = navList.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('nav ul li a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('active');
        mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
    });
  }

  static initSmoothScrolling() {
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
  }
}

// Optimized Particle System
class ParticleSystem {
  constructor(container, count = 30) {
    this.container = container;
    this.count = count;
    this.particles = [];
    this.init();
  }

  init() {
    // Create document fragment for better performance
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < this.count; i++) {
      fragment.appendChild(this.createParticle());
    }
    
    this.container.appendChild(fragment);
  }

  createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random properties
    const size = Math.random() * 10 + 5;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 10 + 5;
    
    // Apply styles in one operation
    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${posX}%;
      top: ${posY}%;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      opacity: ${Math.random() * 0.5 + 0.1};
    `;
    
    return particle;
  }
}

// Enhanced 3D Parallax with throttling
class Parallax3D {
  constructor(element) {
    this.element = element;
    this.lastTime = 0;
    this.throttleDelay = 16; // ~60fps
    this.init();
  }

  init() {
    this.element.style.transformStyle = 'preserve-3d';
    this.element.style.willChange = 'transform';
    this.element.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.element.addEventListener('mouseleave', this.reset.bind(this));
  }

  handleMouseMove(e) {
    const now = Date.now();
    if (now - this.lastTime < this.throttleDelay) return;
    this.lastTime = now;

    const { offsetWidth: width, offsetHeight: height } = this.element;
    const { clientX: x, clientY: y } = e;
    const xPos = (x / width - 0.5) * 20;
    const yPos = (y / height - 0.5) * 20;
    
    this.element.style.transform = `
      rotateY(${xPos}deg)
      rotateX(${-yPos}deg)
      translateZ(20px)
    `;
  }

  reset() {
    this.element.style.transform = 'rotateY(0) rotateX(0) translateZ(0)';
  }
}

// Intersection Observer for Scroll Animations
class ScrollAnimator {
  constructor(threshold = 0.2) {
    this.threshold = threshold;
    this.observer = null;
    this.init();
  }

  init() {
    const elements = document.querySelectorAll('.scroll-animate');
    if (elements.length === 0) return;

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: this.threshold,
      rootMargin: '0px 0px -100px 0px'
    });

    elements.forEach(el => this.observer.observe(el));
  }
}

// Optimized Gradient Follow with requestAnimationFrame
class GradientFollow {
  constructor(element) {
    this.element = element;
    this.rafId = null;
    this.lastX = 0;
    this.lastY = 0;
    this.init();
  }

  init() {
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  handleMouseMove(e) {
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    
    if (!this.rafId) {
      this.rafId = requestAnimationFrame(() => {
        this.updateGradient();
        this.rafId = null;
      });
    }
  }

  updateGradient() {
    const { offsetWidth: width, offsetHeight: height } = document.body;
    const xPercent = this.lastX / width * 100;
    const yPercent = this.lastY / height * 100;
    
    this.element.style.background = `
      radial-gradient(
        circle at ${xPercent}% ${yPercent}%,
        rgba(255, 90, 95, 0.8) 0%,
        rgba(0, 58, 102, 0.6) 70%
      )
    `;
  }
}

// Morphing Navigation with improved performance
class MorphingNav {
  constructor(navElement) {
    this.nav = navElement;
    this.links = navElement.querySelectorAll('a');
    this.activeBg = document.createElement('div');
    this.activeBg.classList.add('nav-active-bg');
    this.nav.appendChild(this.activeBg);
    this.init();
  }

  init() {
    this.links.forEach(link => {
      link.addEventListener('mouseenter', (e) => this.activateLink(e));
      link.addEventListener('mouseleave', () => this.reset());
    });
  }

  activateLink(e) {
    const link = e.target;
    const linkRect = link.getBoundingClientRect();
    const navRect = this.nav.getBoundingClientRect();
    
    this.activeBg.style.cssText = `
      width: ${linkRect.width}px;
      height: ${linkRect.height}px;
      transform: translateX(${linkRect.left - navRect.left}px) translateY(${linkRect.top - navRect.top}px);
      opacity: 1;
    `;
  }

  reset() {
    this.activeBg.style.opacity = '0';
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  AnimationController.init();
  
  // Reset header buttons after click
  document.querySelectorAll('header a, header button').forEach(btn => {
    btn.addEventListener('click', function() {
      setTimeout(() => {
        this.style.cssText = 'transform: none; background-color: none;';
        this.blur();
      }, 300);
    });
  });
});
document.querySelector('.dark-mode-toggle').addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
});

