/**
 * MIKKA - Avant-Garde Photography Portfolio
 * main.js - Mobile navigation menu toggle and active page highlighting
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  highlightActiveNav();
});

/**
 * Mobile burger menu overlay toggle
 */
function initMobileMenu() {
  const burgerBtn = document.querySelector('.burger-btn');
  const menuOverlay = document.querySelector('.mobile-menu-overlay');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!burgerBtn || !menuOverlay) return;

  function toggleMenu(isOpen) {
    const shouldOpen = typeof isOpen === 'boolean' ? isOpen : !burgerBtn.classList.contains('is-active');
    
    if (shouldOpen) {
      burgerBtn.classList.add('is-active');
      burgerBtn.setAttribute('aria-expanded', 'true');
      menuOverlay.classList.add('is-open');
      menuOverlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
    } else {
      burgerBtn.classList.remove('is-active');
      burgerBtn.setAttribute('aria-expanded', 'false');
      menuOverlay.classList.remove('is-open');
      menuOverlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    }
  }

  burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOverlay.classList.contains('is-open')) {
      toggleMenu(false);
    }
  });
}

/**
 * Highlights the active navigation link based on the current window location
 */
function highlightActiveNav() {
  const path = window.location.pathname;
  let filename = path.substring(path.lastIndexOf('/') + 1);
  if (!filename || filename === '') {
    filename = 'index.html';
  }

  const navLinks = document.querySelectorAll('.sidebar-nav .nav-link, .mobile-nav .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const target = href.substring(href.lastIndexOf('/') + 1);

    if (target === filename || (filename === 'index.html' && (target === '' || target === './' || target === 'index.html'))) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}
