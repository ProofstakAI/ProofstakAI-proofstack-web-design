(() => {
  const d = document, root = d.documentElement;
  root.classList.remove('no-js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ribbon offset
  const rb = d.querySelector('.ribbon');
  const setRb = () => rb && root.style.setProperty('--ribbon-h', rb.offsetHeight + 'px');
  setRb(); addEventListener('resize', setRb);

  // header state + progress
  const hdr = d.querySelector('.hdr'), prog = d.querySelector('.progress');
  const onScroll = () => {
    const y = scrollY;
    hdr && hdr.classList.toggle('scrolled', y > 40);
    if (prog) { const h = d.body.scrollHeight - innerHeight; prog.style.transform = `scaleX(${h > 0 ? y / h : 0})`; }
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // mobile menu
  const mb = d.querySelector('.menu-btn');
  if (mb) {
    const close = () => { d.body.classList.remove('menu-open'); mb.setAttribute('aria-expanded', 'false'); };
    mb.addEventListener('click', () => {
      const open = d.body.classList.toggle('menu-open');
      mb.setAttribute('aria-expanded', String(open));
    });
    d.querySelectorAll('.mnav a').forEach(a => a.addEventListener('click', close));
    addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  // hero video
  const v = d.querySelector('.hero video'), vt = d.querySelector('.vid-toggle');
  if (v) {
    if (reduce) { v.removeAttribute('autoplay'); v.pause(); }
    const sync = () => {
      if (!vt) return;
      const paused = v.paused;
      vt.setAttribute('aria-pressed', String(paused));
      vt.querySelector('.lbl').textContent = paused ? 'Play film' : 'Pause film';
      vt.querySelector('.ic-pause').style.display = paused ? 'none' : '';
      vt.querySelector('.ic-play').style.display = paused ? '' : 'none';
    };
    v.addEventListener('play', sync); v.addEventListener('pause', sync);
    vt && vt.addEventListener('click', () => { v.paused ? v.play() : v.pause(); });
    if (!reduce) { const p = v.play(); p && p.catch(() => {}); }
    sync();
  }

  // reveal
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' }) : null;
  d.querySelectorAll('.rv').forEach(el => io ? io.observe(el) : el.classList.add('in'));

  // counters
  const cio = 'IntersectionObserver' in window ? new IntersectionObserver(es => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, end = +el.dataset.count, t0 = performance.now(), dur = 1400;
      cio.unobserve(el);
      if (reduce) { el.textContent = end; return; }
      const tick = t => { const k = Math.min(1, (t - t0) / dur); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
  }, { threshold: .5 }) : null;
  d.querySelectorAll('[data-count]').forEach(el => cio ? cio.observe(el) : (el.textContent = el.dataset.count));

  // card glow
  d.querySelectorAll('.glow').forEach(c => c.addEventListener('pointermove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  // parallax images
  const px = [...d.querySelectorAll('[data-parallax]')];
  if (px.length && !reduce) {
    const run = () => { px.forEach(img => { const r = img.parentElement.getBoundingClientRect(); const k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; img.style.transform = `translateY(${(-7 + k * -10).toFixed(2)}%)`; }); };
    addEventListener('scroll', () => requestAnimationFrame(run), { passive: true }); run();
  }

  // tabs (WAI-ARIA)
  d.querySelectorAll('[role=tablist]').forEach(list => {
    const tabs = [...list.querySelectorAll('[role=tab]')];
    const select = (t, focus) => {
      tabs.forEach(x => { const on = x === t; x.setAttribute('aria-selected', on); x.tabIndex = on ? 0 : -1; d.getElementById(x.getAttribute('aria-controls')).hidden = !on; });
      focus && t.focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', e => {
        const k = e.key; let n = null;
        if (k === 'ArrowRight' || k === 'ArrowDown') n = tabs[(i + 1) % tabs.length];
        if (k === 'ArrowLeft' || k === 'ArrowUp') n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (k === 'Home') n = tabs[0]; if (k === 'End') n = tabs[tabs.length - 1];
        if (n) { e.preventDefault(); select(n, true); }
      });
    });
  });

  // service cards -> preselect inquiry type
  d.querySelectorAll('[data-service]').forEach(c => {
    const go = () => {
      const val = c.dataset.service, inp = d.querySelector(`.chips input[value="${CSS.escape(val)}"]`);
      if (inp) inp.checked = true;
      d.getElementById('contact').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    };
    c.addEventListener('click', e => { if (e.target.closest('a')) e.preventDefault(); go(); });
    c.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
  });

  // form (demo mode)
  const f = d.querySelector('form.inq');
  if (f) {
    const sum = d.querySelector('.summary');
    const rules = {
      name: v => v.trim().length >= 2 || 'Please enter your name.',
      phone: v => v.replace(/\D/g, '').length >= 10 || 'Enter a 10-digit phone number.',
      email: v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email or leave blank.',
      details: v => v.trim().length >= 10 || 'A sentence or two about the job helps.'
    };
    const check = el => {
      const r = rules[el.name]; if (!r) return true;
      const res = r(el.value), fld = el.closest('.field'), err = fld.querySelector('.err');
      const ok = res === true; fld.classList.toggle('invalid', !ok); err.textContent = ok ? '' : res;
      el.setAttribute('aria-invalid', String(!ok)); return ok;
    };
    f.querySelectorAll('input,textarea').forEach(el => el.addEventListener('blur', () => check(el)));
    f.addEventListener('submit', e => {
      e.preventDefault();
      const els = [...f.querySelectorAll('input[name],textarea[name]')].filter(el => rules[el.name]);
      const okAll = els.map(check).every(Boolean);
      if (!okAll) { const first = f.querySelector('.invalid input,.invalid textarea'); first && first.focus(); return; }
      const fd = new FormData(f), esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
      const types = fd.getAll('type').join(', ') || 'Not specified';
      const ref = 'REQ-' + Date.now().toString(36).toUpperCase().slice(-6);
      sum.innerHTML = `<h4>Project summary · ${ref}</h4><dl>
        <dt>Name</dt><dd>${esc(fd.get('name'))}</dd>
        <dt>Phone</dt><dd>${esc(fd.get('phone'))}</dd>
        ${fd.get('email') ? `<dt>Email</dt><dd>${esc(fd.get('email'))}</dd>` : ''}
        <dt>Work</dt><dd>${esc(types)}</dd>
        ${fd.get('timeline') ? `<dt>Timeline</dt><dd>${esc(fd.get('timeline'))}</dd>` : ''}
        <dt>Details</dt><dd>${esc(fd.get('details'))}</dd></dl>
        <p class="muted" style="margin-top:1rem;font-size:.85rem">Demo mode: this summary was created in your browser and was not sent. In the live build, it would route to the shop's inbox and CRM with an instant text confirmation.</p>`;
      sum.classList.add('show'); sum.setAttribute('tabindex', '-1'); sum.focus();
    });
  }
  const yr = d.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
