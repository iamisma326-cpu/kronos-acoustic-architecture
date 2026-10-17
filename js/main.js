document.addEventListener('DOMContentLoaded', () => {
  gsap.registerPlugin(ScrollTrigger);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Inicializar Lenis (Smooth Scroll) si no hay reducción de movimiento
  let lenis = null;
  if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // Navegación suave para anclas
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') {
        e.preventDefault();
        if (lenis) lenis.scrollTo(0);
        else window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        if (lenis) lenis.scrollTo(targetEl, { offset: -60 });
        else targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Si el usuario prefiere movimiento reducido, fijamos valores finales de contadores y salimos
  if (prefersReducedMotion) {
    document.querySelectorAll('.counter').forEach((counter) => {
      const target = parseFloat(counter.dataset.target || '0');
      const decimals = parseInt(counter.dataset.decimals || '0', 10);
      counter.textContent = target.toFixed(decimals);
    });
    return;
  }

  // 2. Barra de progreso de lectura global
  gsap.to('.scroll-progress__bar', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.2
    }
  });

  // 3. SplitType para textos expresivos
  let heroTitleSplit, manifestoSplit, footerTitleSplit;
  if (typeof SplitType !== 'undefined') {
    heroTitleSplit = new SplitType('.hero__title', { types: 'chars' });
    manifestoSplit = new SplitType('.manifesto__text', { types: 'words' });
    footerTitleSplit = new SplitType('.footer-cta__title', { types: 'chars' });
  }

  // 4. Animación de entrada del Hero
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl.from('.hero__img', {
    scale: 1.22,
    duration: 2.2,
    ease: 'power2.out'
  }, 0);

  heroTl.from('.hero__meta .eyebrow', {
    y: 20,
    opacity: 0,
    stagger: 0.15,
    duration: 1
  }, 0.3);

  if (heroTitleSplit && heroTitleSplit.chars) {
    heroTl.from(heroTitleSplit.chars, {
      yPercent: 100,
      opacity: 0,
      stagger: 0.025,
      duration: 1.1
    }, 0.4);
  }

  heroTl.from(['.hero__desc', '.scroll-indicator'], {
    y: 28,
    opacity: 0,
    stagger: 0.15,
    duration: 1
  }, 0.9);

  // Parallax imagen Hero al hacer scroll
  gsap.to('.hero__img', {
    yPercent: 18,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // 5. Revelado palabra por palabra del Manifiesto
  if (manifestoSplit && manifestoSplit.words) {
    gsap.from(manifestoSplit.words, {
      opacity: 0.18,
      y: 12,
      stagger: 0.04,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.manifesto__text-wrap',
        start: 'top 80%',
        end: 'bottom 45%',
        scrub: 0.6
      }
    });
  }

  // Parallax en tarjeta de filosofía
  gsap.fromTo('.parallax-img',
    { yPercent: -10 },
    {
      yPercent: 10,
      ease: 'none',
      scrollTrigger: {
        trigger: '.parallax-card',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    }
  );

  gsap.from('.manifesto__aside > *', {
    y: 35,
    opacity: 0,
    stagger: 0.15,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.manifesto__aside',
      start: 'top 80%'
    }
  });

  // 6. Sección Horizontal Fijada (Obras Monumentales) en Desktop
  const mm = gsap.matchMedia();

  mm.add('(min-width: 769px)', () => {
    const track = document.querySelector('.works-track');
    const pinWrap = document.querySelector('.works-pin-wrap');

    const getScrollAmount = () => {
      return -(track.scrollWidth - window.innerWidth + 64);
    };

    const horizontalTween = gsap.to(track, {
      x: getScrollAmount,
      ease: 'none',
      scrollTrigger: {
        trigger: '.works-section',
        pin: pinWrap,
        start: 'top top',
        end: () => `+=${track.scrollWidth - window.innerWidth}`,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set('.works-progress-fill', { scaleX: self.progress });
        }
      }
    });

    return () => {
      horizontalTween.kill();
    };
  });

  // En móvil revelamos las tarjetas verticalmente
  mm.add('(max-width: 768px)', () => {
    gsap.utils.toArray('.work-card').forEach((card) => {
      gsap.from(card, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%'
        }
      });
    });
  });

  // 7. Tarjetas de Proceso reveladas progresivamente
  gsap.utils.toArray('.step-card').forEach((card) => {
    gsap.from(card, {
      y: 50,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%'
      }
    });
  });

  // 8. Contadores animados en la sección de Métricas
  document.querySelectorAll('.counter').forEach((counter) => {
    const target = parseFloat(counter.dataset.target || '0');
    const decimals = parseInt(counter.dataset.decimals || '0', 10);
    const obj = { val: 0 };

    gsap.to(obj, {
      val: target,
      duration: 2.2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: counter,
        start: 'top 85%',
        once: true
      },
      onUpdate: () => {
        counter.textContent = obj.val.toFixed(decimals);
      }
    });
  });

  // 9. Banner Parallax de ancho completo
  gsap.fromTo('.full-bleed-banner__img',
    { yPercent: -12 },
    {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: '.full-bleed-banner',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    }
  );

  // 10. Animación de caracteres en el Footer
  if (footerTitleSplit && footerTitleSplit.chars) {
    gsap.from(footerTitleSplit.chars, {
      yPercent: 80,
      opacity: 0,
      stagger: 0.02,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.footer-cta',
        start: 'top 80%'
      }
    });
  }

  // 11. Cursor personalizado y microinteracciones magnéticas
  const cursor = document.querySelector('.custom-cursor');
  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.2, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.2, ease: 'power3' });

    window.addEventListener('mousemove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });

    document.querySelectorAll('a, button, .work-card').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-active'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-active'));
    });
  }

  // Botones y enlaces magnéticos
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, {
        x: x * 0.28,
        y: y * 0.28,
        duration: 0.35,
        ease: 'power2.out'
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.4)'
      });
    });
  });
});