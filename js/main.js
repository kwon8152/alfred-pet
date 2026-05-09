document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.section').forEach(s => observer.observe(s));

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
