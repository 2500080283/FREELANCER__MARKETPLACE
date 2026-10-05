/**
 * Intelligence Designed To Evolve
 * Vanilla JavaScript Implementation
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // Background Video Playback Safety
  // ==========================================
  const bgVideo = document.querySelector('.bg-video');
  if (bgVideo) {
    bgVideo.muted = true;
    const playPromise = bgVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // In case browser policy restricts autoplay, start upon first user interaction
        const startVideoOnInteraction = () => {
          bgVideo.play();
          document.removeEventListener('click', startVideoOnInteraction);
          document.removeEventListener('touchstart', startVideoOnInteraction);
        };
        document.addEventListener('click', startVideoOnInteraction);
        document.addEventListener('touchstart', startVideoOnInteraction);
      });
    }
  }

  // ==========================================
  // Stats Count-Up Animation
  // ==========================================
  const statsMetrics = [
    { target: 120, decimals: 0, suffix: 'ms' },
    { target: 99.99, decimals: 2, suffix: '%' },
    { target: 24, decimals: 0, suffix: '/7' },
    { target: 2.4, decimals: 1, suffix: 'M' },
  ];

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  let countUpTriggered = false;

  function runCountUpAnimation() {
    if (countUpTriggered) return;
    countUpTriggered = true;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const statElements = document.querySelectorAll('.stat-item');

    statElements.forEach((el, index) => {
      const metric = statsMetrics[index];
      if (!metric) return;

      const numEl = el.querySelector('.stat-val-num');
      if (!numEl) return;

      if (prefersReducedMotion) {
        numEl.textContent = metric.target.toFixed(metric.decimals);
        return;
      }

      const duration = 1500 + index * 80;
      const startOffset = 480 + index * 90;

      setTimeout(() => {
        let startTime = null;
        const initialValue = 0;

        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = easeOutCubic(progress);

          const currentValue = initialValue + (metric.target - initialValue) * easedProgress;
          numEl.textContent = currentValue.toFixed(metric.decimals);

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            numEl.textContent = metric.target.toFixed(metric.decimals);
          }
        }

        requestAnimationFrame(step);
      }, startOffset);
    });
  }

  const statsContainer = document.getElementById('statsFooter');
  if (statsContainer) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runCountUpAnimation();
              obs.disconnect();
            }
          });
        },
        { threshold: 0.25 }
      );
      observer.observe(statsContainer);
    } else {
      // Fallback for older browsers
      runCountUpAnimation();
    }
  }

  // ==========================================
  // Mobile Navigation (≤720px)
  // ==========================================
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-sheet a');

  function setMobileMenuState(isOpen) {
    if (!burgerBtn || !mobileMenu || !mobileOverlay) return;

    burgerBtn.setAttribute('aria-expanded', String(isOpen));

    if (isOpen) {
      mobileMenu.removeAttribute('hidden');
      mobileOverlay.removeAttribute('hidden');
      document.body.classList.add('menu-open');
    } else {
      mobileMenu.setAttribute('hidden', '');
      mobileOverlay.setAttribute('hidden', '');
      document.body.classList.remove('menu-open');
    }
  }

  if (burgerBtn) {
    burgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isCurrentlyOpen = burgerBtn.getAttribute('aria-expanded') === 'true';
      setMobileMenuState(!isCurrentlyOpen);
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', () => {
      setMobileMenuState(false);
    });
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setMobileMenuState(false);
    }
  });

  // Close on link click
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (link.classList.contains('mobile-nav-link')) {
        document.querySelectorAll('.mobile-nav-link').forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
      }
      setMobileMenuState(false);
    });
  });

  // Close on resize > 720px
  window.addEventListener('resize', () => {
    if (window.innerWidth > 720) {
      setMobileMenuState(false);
    }
  });

  // ==========================================
  // Desktop Nav Active State
  // ==========================================
  const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');
  desktopLinks.forEach((link) => {
    link.addEventListener('click', () => {
      desktopLinks.forEach((l) => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
});
