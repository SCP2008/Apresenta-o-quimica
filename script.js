/* ============================================================
   NYLON — Presentation Script
   Animações, navegação, partículas, polimerização interativa
   ============================================================ */

(() => {
  'use strict';

  // ───────── SLIDE NAVIGATION ─────────
  const slides   = document.querySelectorAll('.slide');
  const total    = slides.length;
  let current    = 0;

  const prevBtn  = document.getElementById('prev-btn');
  const nextBtn  = document.getElementById('next-btn');
  const dotsBox  = document.getElementById('nav-dots');
  const progBar  = document.getElementById('progress-bar');

  // Create dots
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.classList.add('nav-dot');
    dot.dataset.index = i;
    dot.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(dot);
  }
  const dots = dotsBox.querySelectorAll('.nav-dot');

  function goTo(index) {
    if (index < 0 || index >= total) return;
    current = index;
    slides[current].scrollIntoView({ behavior: 'smooth' });
    updateUI();
    triggerReveal(slides[current]);
  }

  function updateUI() {
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    progBar.style.width = ((current + 1) / total * 100) + '%';
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault(); goTo(current + 1);
    }
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault(); goTo(current - 1);
    }
    if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    if (e.key === 'End')  { e.preventDefault(); goTo(total - 1); }
  });

  // Scroll spy (debounced)
  let scrollTimer;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
        const idx = [...slides].indexOf(entry.target);
        if (idx !== current) {
          current = idx;
          updateUI();
        }
        triggerReveal(entry.target);
      }
    });
  }, { threshold: 0.5 });

  slides.forEach(s => observer.observe(s));

  // ───────── REVEAL ON VIEW ─────────
  function triggerReveal(slide) {
    const els = slide.querySelectorAll('.reveal-left, .reveal-right, .reveal-up, .reveal-scale');;
    els.forEach(el => el.classList.add('visible'));
    // Re-trigger chain drawing on slide 2
    if (slide.id === 'slide-2') animateChain();
    // Re-trigger polymerization on slide 3
    if (slide.id === 'slide-3') animatePolymerization();
  }

  // ───────── PARTICLES (Cover) ─────────
  function createParticles() {
    const container = document.getElementById('particles-1');
    if (!container) return;
    const colors = ['#06b6d4', '#8b5cf6', '#00ff88', '#00d4ff', '#c084fc'];
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      const size = Math.random() * 6 + 2;
      p.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random()*100}%;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        animation-duration:${Math.random()*8+5}s;
        animation-delay:${Math.random()*5}s;
        opacity:${Math.random()*0.5+0.2};
      `;
      container.appendChild(p);
    }
  }
  createParticles();

  // ───────── CHAIN ANIMATION (Slide 2) ─────────
  function animateChain() {
    const nodes = document.querySelectorAll('#slide-2 .chain-node');
    const bonds = document.querySelectorAll('#slide-2 .chain-bond');
    nodes.forEach((n, i) => {
      n.style.opacity = '0';
      setTimeout(() => {
        n.style.transition = 'opacity .3s ease';
        n.style.opacity = '1';
      }, i * 150);
    });
    bonds.forEach((b, i) => {
      b.style.strokeDashoffset = '20';
      b.style.strokeDasharray  = '20';
      setTimeout(() => {
        b.style.transition = 'stroke-dashoffset .5s ease';
        b.style.strokeDashoffset = '0';
      }, i * 150 + 100);
    });
  }

  // ───────── POLYMERIZATION ANIMATION (Slide 3) ─────────
  let polyAnimRan = false;
  function animatePolymerization() {
    if (polyAnimRan) return;
    polyAnimRan = true;

    const left    = document.getElementById('monomer-left');
    const right   = document.getElementById('monomer-right');
    const symbols = document.getElementById('reaction-symbols');
    const product = document.getElementById('product');
    const arrow   = document.querySelector('#slide-3 .arrow-react');

    // Step 1: monomers appear
    left.style.opacity  = '0'; right.style.opacity  = '0';
    symbols.style.opacity = '0';
    product.style.opacity = '0';
    arrow.style.opacity   = '0';

    left.style.transition  = 'opacity .6s ease, transform .6s ease';
    right.style.transition = 'opacity .6s ease, transform .6s ease';

    setTimeout(() => {
      left.style.opacity  = '1';
      left.style.transform = 'translateX(0)';
    }, 300);

    setTimeout(() => {
      symbols.style.transition = 'opacity .4s ease';
      symbols.style.opacity = '1';
    }, 800);

    setTimeout(() => {
      right.style.opacity  = '1';
      right.style.transform = 'translateX(0)';
    }, 1000);

    // Step 2: they move together
    setTimeout(() => {
      left.style.transform  = 'translateX(30px)';
      right.style.transform = 'translateX(-30px)';
    }, 1600);

    // Step 3: water releases, product appears
    setTimeout(() => {
      const water = document.querySelector('.water-release');
      if (water) {
        water.style.transition = 'transform .8s ease, opacity .8s ease';
        water.style.transform  = 'translateY(-30px)';
        water.style.opacity   = '.3';
      }
      symbols.querySelector('.plus').style.opacity = '0';
      left.style.opacity  = '0';
      right.style.opacity = '0';
    }, 2200);

    setTimeout(() => {
      arrow.style.transition = 'opacity .4s ease';
      arrow.style.opacity = '1';
    }, 2500);

    setTimeout(() => {
      product.style.transition = 'opacity .6s ease, transform .6s ease';
      product.style.opacity = '1';
      product.style.transform = 'scale(1.15)';
    }, 2800);

    setTimeout(() => {
      product.style.transform = 'scale(1)';
    }, 3400);
  }

  // ───────── INTERACTIVE HOVER — Pipeline (Slide 4) ─────────
  const pipeStages = document.querySelectorAll('.pipe-stage');
  pipeStages.forEach(stage => {
    stage.addEventListener('mouseenter', () => {
      stage.style.borderColor = 'var(--cyan)';
      stage.style.boxShadow   = '0 0 25px rgba(6,182,212,.2)';
    });
    stage.addEventListener('mouseleave', () => {
      stage.style.borderColor = 'rgba(255,255,255,.07)';
      stage.style.boxShadow   = 'none';
    });
  });

  // ───────── INTERACTIVE HOVER — Property badges (Slide 5) ─────────
  const propBadges = document.querySelectorAll('.prop-badge');
  const badgeGlows = ['#00ff88', '#06b6d4', '#8b5cf6', '#00d4ff', '#c084fc'];
  propBadges.forEach((badge, i) => {
    const glow = badgeGlows[i % badgeGlows.length];
    badge.addEventListener('mouseenter', () => {
      badge.style.boxShadow = `0 0 25px ${glow}40`;
      badge.style.borderColor = glow;
    });
    badge.addEventListener('mouseleave', () => {
      badge.style.boxShadow   = 'none';
      badge.style.borderColor = 'rgba(255,255,255,.07)';
    });
  });

  // ───────── CONCLUSION CARDS — Glow on hover (Slide 6) ─────────
  const cardPros = document.querySelector('.card-pros');
  const cardCons = document.querySelector('.card-cons');
  if (cardPros) {
    cardPros.addEventListener('mouseenter', () => {
      cardPros.style.boxShadow = '0 0 30px rgba(0,255,136,.12)';
    });
    cardPros.addEventListener('mouseleave', () => {
      cardPros.style.boxShadow = 'none';
    });
  }
  if (cardCons) {
    cardCons.addEventListener('mouseenter', () => {
      cardCons.style.boxShadow = '0 0 30px rgba(249,115,22,.12)';
    });
    cardCons.addEventListener('mouseleave', () => {
      cardCons.style.boxShadow = 'none';
    });
  }

  // ───────── MOUSE PARALLAX — Cover ─────────
  const cover = document.getElementById('slide-1');
  const molFloat = document.querySelector('.molecule-float');
  if (cover && molFloat) {
    cover.addEventListener('mousemove', (e) => {
      const rect = cover.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      molFloat.style.transform = `translate(${x*20}px, ${y*15 - 10}px) rotate(${x*10}deg)`;
    });
  }

  // ───────── TOUCH SWIPE ─────────
  let touchStartY = 0;
  document.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; });
  document.addEventListener('touchend', (e) => {
    const diff = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
    }
  });

  // ───────── INIT ─────────
  updateUI();
  triggerReveal(slides[0]);

  // Show keyboard hint briefly
  const hint = document.createElement('div');
  hint.classList.add('key-hint');
  hint.textContent = 'Use ← → ou scroll para navegar';
  document.body.appendChild(hint);
  setTimeout(() => hint.remove(), 8000);

})();