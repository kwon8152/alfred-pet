document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  // Header scroll state
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Scroll reveal — observe both .section and any .reveal element
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal, .section').forEach(el => io.observe(el));
  }

  // Subtle magnetic effect on primary CTAs (desktop only)
  if (!prefersReduced && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.08}px, ${y * 0.12}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  // Contact form (Formspree) — graceful fallback if form id not configured
  const form = document.querySelector('.contact-form');
  if (form) {
    const status = form.querySelector('.form-status');
    const submit = form.querySelector('.form-submit');
    const t = (key, fallback) => {
      try {
        return translations[I18n.current]?.[key] || fallback;
      } catch (_) {
        return fallback;
      }
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.action || form.action.includes('REPLACE_WITH_FORM_ID')) {
        status.textContent = t('form.error', '폼이 아직 설정되지 않았습니다. info@alfred.pet 으로 메일 부탁드립니다.');
        status.className = 'form-status error';
        return;
      }
      const originalLabel = submit.textContent;
      submit.disabled = true;
      submit.textContent = t('form.sending', '전송 중...');
      status.textContent = '';
      status.className = 'form-status';
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          status.textContent = t('form.success', '문의가 정상적으로 접수되었습니다.');
          status.className = 'form-status success';
          form.reset();
        } else {
          throw new Error('non-ok');
        }
      } catch (_) {
        status.textContent = t('form.error', '전송 실패. 잠시 후 다시 시도해주세요.');
        status.className = 'form-status error';
      } finally {
        submit.disabled = false;
        submit.textContent = originalLabel;
      }
    });
  }
});
