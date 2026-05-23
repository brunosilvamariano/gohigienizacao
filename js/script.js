/* ══════════════════════════════════════════
   GOCLEAN — script.js
   Navbar · Scroll · Reveal · Counters
   Before/After · Video Modal · Chatbot
══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Navbar scroll ── */
  const nav   = document.getElementById('nav');
  const stBtn = document.getElementById('stBtn');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('sc', scrollY > 60);
    stBtn.classList.toggle('on', scrollY > 400);
  }, { passive: true });

  stBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));

  /* ── Mobile menu ── */
  const hbg    = document.getElementById('hbg');
  const drawer = document.getElementById('drawer');

  if (hbg) {
    // Toggle drawer + accessible state and visual class on the button
    hbg.addEventListener('click', () => {
      const opened = drawer.classList.toggle('op');
      hbg.setAttribute('aria-expanded', opened ? 'true' : 'false');
      hbg.classList.toggle('active', opened);
      document.body.classList.toggle('drawer-open', opened);
    });

    drawer.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        drawer.classList.remove('op');
        hbg.setAttribute('aria-expanded', 'false');
        hbg.classList.remove('active');
        document.body.classList.remove('drawer-open');
      })
    );
  }

  // Close button inside drawer (explicit close control)
  const drawerClose = document.getElementById('drawerClose');
  if (drawerClose) {
    drawerClose.addEventListener('click', () => {
      drawer.classList.remove('op');
      if (hbg) { hbg.setAttribute('aria-expanded', 'false'); hbg.classList.remove('active'); }
      document.body.classList.remove('drawer-open');
    });
  }

  /* ── Smooth scroll ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Reveal on scroll ── */
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('vis');
        ro.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('[data-r]').forEach(el => ro.observe(el));

  /* ── Animated counters ── */
  function animCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const dur    = 1800;
    let start    = null;

    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      el.textContent = prefix + Math.floor(p * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target + suffix;
    };
    requestAnimationFrame(step);
  }

  const co = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.querySelectorAll('[data-target]').forEach(el => {
        if (!el.dataset.animated) {
          el.dataset.animated = '1';
          animCount(el);
        }
      });
      co.unobserve(e.target);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.stats-strip, .hero-stats').forEach(s => co.observe(s));

  /* ── Before / After slider ── */
  document.querySelectorAll('.ba-container').forEach(c => {
    const slider = c.querySelector('.ba-slider');
    const after  = c.querySelector('.ba-after');
    let drag = false;

    const set = x => {
      const r = c.getBoundingClientRect();
      const p = Math.min(Math.max((x - r.left) / r.width, 0.02), 0.98);
      slider.style.left        = p * 100 + '%';
      after.style.clipPath     = `inset(0 0 0 ${p * 100}%)`;
    };

    slider.addEventListener('mousedown',  ()  => { drag = true; });
    window.addEventListener('mouseup',    ()  => { drag = false; });
    window.addEventListener('mousemove',  e   => { if (drag) set(e.clientX); });
    slider.addEventListener('touchstart', ()  => { drag = true; }, { passive: true });
    window.addEventListener('touchend',   ()  => { drag = false; });
    window.addEventListener('touchmove',  e   => { if (drag) set(e.touches[0].clientX); }, { passive: false });
  });

  /* Video modal removed */

}); // end DOMContentLoaded