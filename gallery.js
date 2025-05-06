document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const playPauseBtn = document.getElementById('playPauseBtn');
    
    // State
    let currentIndex = 0;
    let slideshowInterval;
    let slideshowSpeed = 5000; // 5 seconds per slide
    let isPlaying = true;
    let progressInterval;
    
    // Open Lightbox
    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        startSlideshow();
        applyKenBurnsEffect();
    }
    
    // Update Lightbox Content
    function updateLightbox(direction = null) {
        const activeItem = galleryItems[currentIndex];
        const imgSrc = activeItem.querySelector('img').src;
        const imgAlt = activeItem.querySelector('img').alt;
        
        // Apply fade transition
        lightboxImg.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImg.src = imgSrc;
            lightboxImg.alt = imgAlt;
            lightboxCaption.textContent = imgAlt;
            lightboxImg.style.opacity = '1';
        }, 300);
    }
    
    // Start Auto-Slideshow
    function startSlideshow() {
        if (slideshowInterval) clearInterval(slideshowInterval);
        if (progressInterval) clearInterval(progressInterval);
        
        isPlaying = true;
        playPauseBtn.classList.add('playing');
        
        // Progress bar animation
        let startTime = Date.now();
        progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = (elapsed % slideshowSpeed) / slideshowSpeed * 100;
            document.querySelector('.progress').style.width = `${progress}%`;
        }, 50);
        
        // Auto-advance slides
        slideshowInterval = setInterval(() => {
            navigate(1);
            startTime = Date.now(); // Reset progress bar
        }, slideshowSpeed);
    }
    
    // Pause Slideshow
    function pauseSlideshow() {
        clearInterval(slideshowInterval);
        clearInterval(progressInterval);
        isPlaying = false;
        playPauseBtn.classList.remove('playing');
    }
    
    // Toggle Play/Pause
    function toggleSlideshow() {
        if (isPlaying) {
            pauseSlideshow();
        } else {
            startSlideshow();
        }
    }
    
    // Apply Ken Burns Effect (randomly)
    function applyKenBurnsEffect() {
        if (Math.random() > 0.5) {
            lightboxImg.classList.add('ken-burns');
        } else {
            lightboxImg.classList.remove('ken-burns');
        }
    }
    
    // Navigate Between Images
    function navigate(direction) {
        currentIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;
        updateLightbox();
        applyKenBurnsEffect();
    }
    
    // Event Listeners
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });
    
    lightboxPrev.addEventListener('click', () => {
        pauseSlideshow();
        navigate(-1);
    });
    
    lightboxNext.addEventListener('click', () => {
        pauseSlideshow();
        navigate(1);
    });
    
    lightboxClose.addEventListener('click', () => {
        pauseSlideshow();
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    playPauseBtn.addEventListener('click', toggleSlideshow);
    
    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'ArrowLeft': 
                pauseSlideshow();
                navigate(-1);
                break;
            case 'ArrowRight': 
                pauseSlideshow();
                navigate(1);
                break;
            case ' ':
                toggleSlideshow();
                break;
            case 'Escape':
                lightbox.classList.remove('active');
                document.body.style.overflow = 'auto';
                pauseSlideshow();
                break;
        }
    });
    
    // Touch Events for Mobile Swiping
    let touchStartX = 0;
    
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    
    lightbox.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > 75) {
            pauseSlideshow();
            diff > 0 ? navigate(1) : navigate(-1);
        }
    }, { passive: true });
});