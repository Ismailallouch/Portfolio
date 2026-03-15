/* ═══════════════════════════════════════════
   ISMAIL ALLOUCH — Portfolio Script
   Typing, Particles, Scroll Card 3D, Reveal
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── TYPING ANIMATION ──────────────────── */
  const typedElem = document.getElementById('typed-output');
  if (typedElem) {
    const phrases = [
      'Agentic AI   ·   RAG Architect',
      'Multi-Agent Systems Builder',
      'LLM-Powered Automation',
      'Full-Stack AI Engineer',
      'Self-RAG   ·   MCP Protocol',
    ];
    let phraseIdx = 0, charIdx = 0, isDeleting = false, currentText = '';

    function tick() {
      const target = phrases[phraseIdx];
      if (!isDeleting) {
        currentText = target.substring(0, charIdx + 1);
        charIdx++;
      } else {
        currentText = target.substring(0, charIdx - 1);
        charIdx--;
      }

      typedElem.innerHTML = currentText + '<span class="cursor">|</span>';
      let speed = isDeleting ? 30 : 60 + Math.random() * 40;

      if (!isDeleting && charIdx === target.length) {
        speed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        speed = 400;
      }
      setTimeout(tick, speed);
    }
    setTimeout(tick, 800);
  }

  /* ── PARTICLE CANVAS ───────────────────── */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: -999, y: -999 };
    let animationId;

    function resize() {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.parentElement.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.parentElement.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.6 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.speedY = (Math.random() - 0.5) * 0.25;
        this.opacity = Math.random() * 0.35 + 0.08;
        // Monochrome + amber particles
        const colors = ['rgba(212, 147, 74,', 'rgba(123, 143, 184,', 'rgba(200, 198, 195,'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
        const dx = mouse.x - this.x, dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.x -= dx * force * 0.02;
          this.y -= dy * force * 0.02;
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.fill();
      }
    }

    const count = Math.min(180, Math.floor((canvas.width * canvas.height) / 9000));
    for (let i = 0; i < count; i++) particles.push(new Particle());

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            const opacity = (1 - dist / 90) * 0.06;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(212, 147, 74, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      animationId = requestAnimationFrame(animate);
    }
    animate();

    const heroObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { if (!animationId) animate(); }
        else { cancelAnimationFrame(animationId); animationId = null; }
      });
    }, { threshold: 0.1 });
    heroObs.observe(canvas.parentElement);
  }

  /* ── SCROLL CARD — 3D Container Animation ── */
  const scrollCard = document.getElementById('scrollCard');
  const scrollHeader = document.getElementById('scrollHeader');
  const scrollSection = document.querySelector('.scroll-card-section');

  if (scrollCard && scrollSection) {
    const isMobile = window.innerWidth <= 768;

    function updateScrollCard() {
      const rect = scrollSection.getBoundingClientRect();
      const sectionH = scrollSection.offsetHeight;
      const viewH = window.innerHeight;

      // Progress: 0 when section enters viewport, 1 when top reaches viewport top
      const rawProgress = (viewH - rect.top) / (sectionH + viewH);
      const progress = Math.max(0, Math.min(1, rawProgress));

      // Rotate: 20° → 0°
      const rotateX = 20 * (1 - progress);

      // Scale: 0.7/1.05 → 0.9/1.0
      const scaleFrom = isMobile ? 0.7 : 1.05;
      const scaleTo = isMobile ? 0.9 : 1.0;
      const scale = scaleFrom + (scaleTo - scaleFrom) * progress;

      // Header translateY: 0 → -100px
      const translateY = -100 * progress;

      scrollCard.style.transform = `rotateX(${rotateX}deg) scale(${scale})`;

      if (scrollHeader) {
        scrollHeader.style.transform = `translateY(${translateY}px)`;
      }
    }

    window.addEventListener('scroll', updateScrollCard, { passive: true });
    updateScrollCard(); // initial
  }

  /* ── NAVBAR SCROLL ─────────────────────── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ── MOBILE MENU ───────────────────────── */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
    navLinks.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => navLinks.classList.remove('open'))
    );
  }

  /* ── SCROLL REVEAL ─────────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── SMOOTH ANCHOR ─────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ── ACTIVE NAV ────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 150) current = s.id; });
    navAnchors.forEach(a => {
      a.style.color = '';
      if (a.getAttribute('href') === `#${current}`) a.style.color = 'var(--accent)';
    });
  }, { passive: true });

});
