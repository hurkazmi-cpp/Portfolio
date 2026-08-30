// enhancements.js — additive polish layer.
// Everything here is additive and defensive (checks elements exist before
// touching them) so it never conflicts with the existing script.js logic
// for the hero, certifications carousel, or mobile menu.

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- 3D tilt on project cards ---------------- */
  if (!prefersReducedMotion && window.VanillaTilt) {
    const tiltEls = document.querySelectorAll('.project-tilt');
    if (tiltEls.length) {
      window.VanillaTilt.init(tiltEls, {
        max: 6,
        speed: 400,
        glare: true,
        'max-glare': 0.12,
        scale: 1.02,
        perspective: 1200,
        gyroscope: false
      });
    }
  }

  /* ---------------- Scroll progress bar ---------------- */
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    if (!progressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${pct}%`;
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------------- Ripple effect on primary buttons ---------------- */
  const rippleTargets = document.querySelectorAll('.btn-aura, .cert-nav-btn');
  rippleTargets.forEach((el) => {
    el.classList.add('ripple-el');
    el.addEventListener('click', (e) => {
      if (prefersReducedMotion) return;
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.4;
      const span = document.createElement('span');
      span.className = 'ripple-span';
      span.style.width = `${size}px`;
      span.style.height = `${size}px`;
      span.style.left = `${e.clientX - rect.left - size / 2}px`;
      span.style.top = `${e.clientY - rect.top - size / 2}px`;
      el.appendChild(span);
      span.addEventListener('animationend', () => span.remove());
    });
  });

  /* ---------------- Project category filter ---------------- */
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('#projects .project-tilt[data-category]');

  if (filterBtns.length && projectCards.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        projectCards.forEach((card) => {
          const matches = filter === 'all' || card.dataset.category === filter;

          if (matches) {
            card.style.display = '';
            // Force reflow so the transition triggers even if it was just
            // toggled from display:none.
            void card.offsetWidth;
            card.classList.remove('project-hidden');
          } else {
            card.classList.add('project-hidden');
            const hideAfterTransition = () => {
              if (card.classList.contains('project-hidden')) {
                card.style.display = 'none';
              }
              card.removeEventListener('transitionend', hideAfterTransition);
            };
            card.addEventListener('transitionend', hideAfterTransition);
            // Fallback in case transitionend doesn't fire (e.g. reduced motion).
            setTimeout(hideAfterTransition, prefersReducedMotion ? 0 : 400);
          }
        });
      });
    });
  }

  /* ---------------- Easter egg: Konami code ---------------- */
  const KONAMI = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];
  let konamiProgress = 0;

  function showEasterEggToast() {
    const toast = document.getElementById('easter-egg-toast');
    if (!toast) return;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 3200);
  }

  function burstConfetti() {
    if (prefersReducedMotion) return;
    const colors = ['#6366f1', '#a855f7', '#e8a33d', '#7fa37a', '#ffffff'];
    const count = 80;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDuration = `${2.2 + Math.random() * 1.6}s`;
      piece.style.opacity = String(0.7 + Math.random() * 0.3);
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(piece);
      piece.addEventListener('animationend', () => piece.remove());
    }
  }

  function triggerEasterEgg() {
    showEasterEggToast();
    burstConfetti();
    console.log(
      '%c🎮 Konami code activated. Nice one.',
      'color:#6366f1;font-weight:bold;font-size:14px;'
    );
  }

  window.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (key === KONAMI[konamiProgress]) {
      konamiProgress += 1;
      if (konamiProgress === KONAMI.length) {
        triggerEasterEgg();
        konamiProgress = 0;
      }
    } else {
      konamiProgress = key === KONAMI[0] ? 1 : 0;
    }
  });

  /* ---------------- Playful console signature for curious devs ---------------- */
  console.log(
    '%cHey, fellow developer 👋',
    'color:#a855f7;font-weight:bold;font-size:16px;'
  );
  console.log(
    '%cLike what you see under the hood? Scroll to the contact section, or find me on LinkedIn.',
    'color:#6366f1;font-size:12px;'
  );
  console.log('%cPsst — try the Konami code.', 'color:#8a8c9a;font-size:11px;font-style:italic;');
});
