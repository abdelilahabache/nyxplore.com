document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    // State
    let currentIndex = 0;
    let isAnimating = false;
    let touchStartX = 0;
  
    // Open Lightbox
    function openLightbox(index) {
      currentIndex = index;
      updateLightbox();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  
    // Update Lightbox Content
    function updateLightbox(direction = null) {
      if (isAnimating) return;
      isAnimating = true;
      
      // Apply direction class if provided
      if (direction === 'prev') {
        lightboxImg.classList.add('slide-right');
      } else if (direction === 'next') {
        lightboxImg.classList.add('slide-left');
      }
      
      // Update content
      const activeItem = galleryItems[currentIndex];
      const imgSrc = activeItem.querySelector('img').dataset.src;
      const imgAlt = activeItem.querySelector('img').alt;
      
      lightboxImg.src = imgSrc;
      lightboxImg.alt = imgAlt;
      lightboxCaption.textContent = imgAlt;
      
      // Reset animation after load
      lightboxImg.onload = function() {
        setTimeout(() => {
          lightboxImg.classList.remove('slide-left', 'slide-right');
          isAnimating = false;
        }, 20);
      };
    }
  
    // Navigation
    function navigate(direction) {
      currentIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;
      updateLightbox(direction > 0 ? 'next' : 'prev');
    }
  
    // Event Listeners
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });
  
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      navigate(-1);
    });
  
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      navigate(1);
    });
  
    lightboxClose.addEventListener('click', () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = 'auto';
    });
  
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
      }
    });
  
    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      
      switch(e.key) {
        case 'ArrowLeft': navigate(-1); break;
        case 'ArrowRight': navigate(1); break;
        case 'Escape':
          lightbox.classList.remove('active');
          document.body.style.overflow = 'auto';
          break;
      }
    });
  
    // Touch Events
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
  
    lightbox.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      
      if (Math.abs(diff) > 50) { // Minimum swipe distance
        diff > 0 ? navigate(1) : navigate(-1);
      }
    }, { passive: true });
  });