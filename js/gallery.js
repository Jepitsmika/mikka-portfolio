/**
 * MIKKA - Avant-Garde Photography Portfolio
 * gallery.js - IntersectionObserver lazy loading & fullscreen lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  initLazyLoading();
  initLightbox();
});

/**
 * Lazy loading using IntersectionObserver
 */
function initLazyLoading() {
  const lazyImages = document.querySelectorAll('.gallery-item img[data-src]');
  if (!lazyImages.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          loadImage(img);
          obs.unobserve(img);
        }
      });
    }, {
      rootMargin: '250px 0px 250px 0px',
      threshold: 0.01
    });

    lazyImages.forEach(img => observer.observe(img));
  } else {
    // Fallback for environments without IntersectionObserver
    lazyImages.forEach(img => loadImage(img));
  }

  function loadImage(img) {
    const src = img.getAttribute('data-src');
    if (!src) return;

    img.src = src;
    img.addEventListener('load', () => {
      img.classList.add('is-loaded');
    });

    // Check if already cached/completed
    if (img.complete) {
      img.classList.add('is-loaded');
    }
  }
}

/**
 * Fullscreen Lightbox with prev/next navigation, keyboard & swipe controls
 */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const closeBtn = document.querySelector('.lightbox-close');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');
  const backdrop = document.querySelector('.lightbox-backdrop');

  if (!lightbox || !lightboxImg) return;

  const items = Array.from(document.querySelectorAll('.gallery-item'));
  if (!items.length) return;

  let currentIndex = -1;
  const preloadedImages = new Map();

  function preloadImage(url) {
    if (!url || preloadedImages.has(url)) return;
    const preload = new Image();
    preload.src = url;
    preloadedImages.set(url, preload);
  }

  function updateLightbox(index) {
    if (index < 0 || index >= items.length) return;
    currentIndex = index;

    const currentItem = items[currentIndex];
    const fullSrc = currentItem.getAttribute('data-full');
    const altText = currentItem.querySelector('img')?.getAttribute('alt') || 'Photography by Mikka';

    // Smooth switch
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = fullSrc;
      lightboxImg.alt = altText;
      lightboxImg.onload = () => {
        lightboxImg.style.opacity = '1';
      };
      if (lightboxImg.complete) {
        lightboxImg.style.opacity = '1';
      }
    }, 150);

    if (lightboxCounter) {
      const formattedCurrent = String(currentIndex + 1).padStart(2, '0');
      const formattedTotal = String(items.length).padStart(2, '0');
      lightboxCounter.textContent = `${formattedCurrent} / ${formattedTotal}`;
    }

    // Preload neighbors
    const prevIndex = (currentIndex - 1 + items.length) % items.length;
    const nextIndex = (currentIndex + 1) % items.length;
    preloadImage(items[prevIndex].getAttribute('data-full'));
    preloadImage(items[nextIndex].getAttribute('data-full'));
  }

  function openLightbox(index) {
    updateLightbox(index);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
  }

  function closeLightbox() {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
  }

  function showPrev() {
    const newIndex = (currentIndex - 1 + items.length) % items.length;
    updateLightbox(newIndex);
  }

  function showNext() {
    const newIndex = (currentIndex + 1) % items.length;
    updateLightbox(newIndex);
  }

  // Attach click listener to each gallery item
  items.forEach((item, index) => {
    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  // Close handlers
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (backdrop) backdrop.addEventListener('click', closeLightbox);

  // Prev / Next button handlers
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showPrev();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      showNext();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      showPrev();
    } else if (e.key === 'ArrowRight') {
      showNext();
    }
  });

  // Touch Swipe Support for mobile devices
  let touchStartX = 0;
  let touchStartY = 0;

  lightbox.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    if (e.changedTouches.length === 1) {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;

      // Ensure horizontal swipe dominant over vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX > 0) {
          showPrev();
        } else {
          showNext();
        }
      }
    }
  }, { passive: true });
}
