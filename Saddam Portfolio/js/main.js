/* ==========================================================================
   Saddam Hussain Sahito — English Language & Teaching Portfolio
   Complete script  ·  js/main.js   (no libraries, every feature is optional)
   ========================================================================== */
(() => {
  'use strict';

  const d = document, root = d.documentElement;
  root.classList.add('js');

  const $  = (s, r = d) => r.querySelector(s);
  const $$ = (s, r = d) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine   = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const clamp  = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------- 1. Hero / page headings: words slide up one by one ---------- */
  if (!reduce) {
    $$('.hero h1, .phead h1').forEach(h => {
      if (h.children.length) return;
      const text = h.textContent.trim();
      h.setAttribute('aria-label', text);
      h.textContent = '';
      text.split(/\s+/).forEach((word, i, arr) => {
        const w = d.createElement('span');
        w.className = 'w';
        w.setAttribute('aria-hidden', 'true');
        w.style.setProperty('--i', i);
        const s = d.createElement('span');
        s.textContent = word;
        w.appendChild(s);
        h.appendChild(w);
        if (i < arr.length - 1) h.appendChild(d.createTextNode(' '));
      });
    });
  }

  /* ---------- 2. Ambient UI injected by script (progress bar, glow, back-to-top) ---------- */
  const bar = d.createElement('div');
  bar.className = 'progress';
  bar.setAttribute('aria-hidden', 'true');
  d.body.appendChild(bar);

  const top = d.createElement('button');
  top.type = 'button';
  top.className = 'totop';
  top.setAttribute('aria-label', 'Back to top');
  top.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
  d.body.appendChild(top);

  let glow = null;
  if (fine && !reduce) {
    glow = d.createElement('div');
    glow.className = 'cglow';
    glow.setAttribute('aria-hidden', 'true');
    d.body.appendChild(glow);
  }

  /* ---------- 3. One scroll handler: progress, header, back-to-top, parallax, timeline ---------- */
  const header = $('header');
  const tl = $('.tl');
  const steps = $$('.step');
  let ticking = false;

  function onScroll() {
    ticking = false;
    const y = scrollY;
    const max = root.scrollHeight - innerHeight;
    bar.style.setProperty('--p', max > 0 ? clamp(y / max, 0, 1).toFixed(4) : 0);
    if (header) header.classList.toggle('scrolled', y > 24);
    top.classList.toggle('show', y > 700);
    if (!reduce) root.style.setProperty('--py', Math.round(y));

    if (tl) {
      const r = tl.getBoundingClientRect();
      const mid = innerHeight * 0.62;
      tl.style.setProperty('--tlp', clamp((mid - r.top) / r.height, 0, 1).toFixed(4));
      steps.forEach(s => s.classList.toggle('on', s.getBoundingClientRect().top < mid));
    }
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- 4. Scroll reveal (staggered, then "settled" so hover transitions are instant) ---------- */
  const reveals = $$('.reveal');
  const show = el => {
    el.classList.add('in');
    const delay = parseFloat((el.style.getPropertyValue('--d') || '0').replace('s', '')) || 0;
    setTimeout(() => el.classList.add('settled'), (reduce ? 0 : 1000 + delay * 1000));
  };
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
    }), { threshold: .12, rootMargin: '0px 0px -5% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(show);
  }

  /* ---------- 5. Animated counters (home page stats) ---------- */
  const count = el => {
    const t = +el.dataset.count, s = el.dataset.suffix || '';
    if (reduce) { el.textContent = t + s; return; }
    const st = performance.now(), dur = 1800;
    (function f(n) {
      const p = Math.min((n - st) / dur, 1);
      el.textContent = Math.round(t * (1 - Math.pow(1 - p, 3))) + s;
      if (p < 1) requestAnimationFrame(f);
    })(st);
  };
  const counters = $$('[data-count]');
  if (counters.length) {
    counters.forEach(el => { el.textContent = '0' + (el.dataset.suffix || ''); });
    if ('IntersectionObserver' in window) {
      const co = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { count(e.target); co.unobserve(e.target); }
      }), { threshold: .6 });
      counters.forEach(el => co.observe(el));
    } else counters.forEach(count);
  }

  /* ---------- 6. Mobile menu ---------- */
  const menu = $('.menu'), list = $('nav ul');
  if (menu && list) {
    const setOpen = o => {
      list.classList.toggle('open', o);
      menu.setAttribute('aria-expanded', String(o));
      menu.textContent = o ? 'Close' : 'Menu';
    };
    menu.addEventListener('click', () => setOpen(!list.classList.contains('open')));
    list.addEventListener('click', e => { if (e.target.closest('a')) setOpen(false); });
    d.addEventListener('click', e => { if (!e.target.closest('header')) setOpen(false); });
    d.addEventListener('keydown', e => { if (e.key === 'Escape') setOpen(false); });
    addEventListener('resize', () => { if (innerWidth > 900) setOpen(false); });
  }

  /* ---------- 7. Pointer effects: card spotlight, cursor glow, magnetic buttons, photo tilt ---------- */
  if (fine) {
    let raf = 0, mx = 0, my = 0, target = null;
    d.addEventListener('pointermove', e => {
      mx = e.clientX; my = e.clientY; target = e.target;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (glow) { glow.style.setProperty('--cx', mx + 'px'); glow.style.setProperty('--cy', my + 'px'); }
        const card = target && target.closest && target.closest('.card');
        if (card) {
          const r = card.getBoundingClientRect();
          card.style.setProperty('--mx', (mx - r.left) + 'px');
          card.style.setProperty('--my', (my - r.top) + 'px');
        }
      });
    }, { passive: true });

    if (!reduce) {
      $$('.btn.fill, .btn.line').forEach(b => {
        b.addEventListener('pointermove', e => {
          const r = b.getBoundingClientRect();
          b.style.setProperty('--tx', ((e.clientX - r.left - r.width / 2) * .18).toFixed(1) + 'px');
          b.style.setProperty('--ty', ((e.clientY - r.top - r.height / 2) * .28).toFixed(1) + 'px');
        });
        b.addEventListener('pointerleave', () => { b.style.setProperty('--tx', '0px'); b.style.setProperty('--ty', '0px'); });
      });
      $$('.frame').forEach(f => {
        f.addEventListener('pointermove', e => {
          const r = f.getBoundingClientRect();
          f.style.setProperty('--ry', (((e.clientX - r.left) / r.width - .5) * 12).toFixed(2) + 'deg');
          f.style.setProperty('--rx', ((.5 - (e.clientY - r.top) / r.height) * 12).toFixed(2) + 'deg');
        });
        f.addEventListener('pointerleave', () => { f.style.setProperty('--rx', '0deg'); f.style.setProperty('--ry', '0deg'); });
      });
    }
  }

  /* ---------- 8. Smooth page transition between pages ---------- */
  d.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href]');
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    let u;
    try { u = new URL(a.href, location.href); } catch (_) { return; }
    if (u.origin !== location.origin || !/\.html?$/i.test(u.pathname)) return;
    if (u.pathname === location.pathname && u.search === location.search) return;
    e.preventDefault();
    root.classList.add('leaving');
    setTimeout(() => { location.href = u.href; }, reduce ? 0 : 260);
    setTimeout(() => root.classList.remove('leaving'), 2500);
  });
  addEventListener('pageshow', () => root.classList.remove('leaving'));

  /* ---------- 9. Photo gallery: staggered reveal, 3D tilt, lightbox (internship page) ---------- */
  (function gallery() {
    const grid = d.getElementById('gx');
    if (!grid) return;
    const items = $$('.gx-item', grid);

    items.forEach((el, i) => el.classList.add(i % 2 ? 'fl2' : 'fl1'));

    grid.classList.add('ready');
    if ('IntersectionObserver' in window) {
      const gio = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); gio.unobserve(e.target); }
      }), { threshold: .05, rootMargin: '0px 0px -4% 0px' });
      items.forEach(el => gio.observe(el));
    } else items.forEach(el => el.classList.add('in'));

    items.forEach(el => {
      const im = $('img', el);
      if (im) im.addEventListener('error', () => el.classList.add('broken'));
    });

    if (!reduce && fine) {
      items.forEach(el => {
        const b = $('.gx-btn', el);
        el.addEventListener('pointermove', e => {
          const r = el.getBoundingClientRect();
          b.style.setProperty('--ry', (((e.clientX - r.left) / r.width - .5) * 9).toFixed(2) + 'deg');
          b.style.setProperty('--rx', ((.5 - (e.clientY - r.top) / r.height) * 9).toFixed(2) + 'deg');
        });
        el.addEventListener('pointerleave', () => { b.style.setProperty('--rx', '0deg'); b.style.setProperty('--ry', '0deg'); });
      });
    }

    const lb = d.createElement('div');
    lb.className = 'gxlb';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Photo viewer');
    lb.innerHTML =
      '<button type="button" class="gxlb-b gxlb-close" aria-label="Close">&times;</button>' +
      '<button type="button" class="gxlb-b gxlb-prev" aria-label="Previous photo">&#8249;</button>' +
      '<button type="button" class="gxlb-b gxlb-next" aria-label="Next photo">&#8250;</button>' +
      '<div class="gxlb-stage"><img class="gxlb-img" alt=""><div class="gxlb-count"></div><div class="gxlb-bar"><i></i></div></div>';
    d.body.appendChild(lb);

    const img = $('.gxlb-img', lb), cnt = $('.gxlb-count', lb), prog = $('.gxlb-bar i', lb);
    let cur = 0, last = null;

    function showPhoto(i, dir) {
      cur = (i + items.length) % items.length;
      const src = $('img', items[cur]);
      img.style.setProperty('--sx', (dir || 1) * 30 + 'px');
      img.classList.add('swap');
      setTimeout(() => {
        img.src = src.currentSrc || src.src;
        img.alt = src.alt;
        cnt.textContent = String(cur + 1).padStart(2, '0') + ' / ' + String(items.length).padStart(2, '0');
        prog.style.width = ((cur + 1) / items.length * 100) + '%';
        img.classList.remove('swap');
      }, reduce ? 0 : 180);
    }
    function openPhoto(i) {
      last = d.activeElement;
      lb.classList.add('open');
      d.body.style.overflow = 'hidden';
      showPhoto(i, 1);
      $('.gxlb-close', lb).focus();
    }
    function closePhoto() {
      lb.classList.remove('open');
      d.body.style.overflow = '';
      if (last) last.focus();
    }

    items.forEach((el, i) => $('.gx-btn', el).addEventListener('click', () => openPhoto(i)));
    $('.gxlb-close', lb).addEventListener('click', closePhoto);
    $('.gxlb-prev', lb).addEventListener('click', () => showPhoto(cur - 1, -1));
    $('.gxlb-next', lb).addEventListener('click', () => showPhoto(cur + 1, 1));
    lb.addEventListener('click', e => { if (e.target === lb || e.target.classList.contains('gxlb-stage')) closePhoto(); });
    d.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closePhoto();
      if (e.key === 'ArrowLeft') showPhoto(cur - 1, -1);
      if (e.key === 'ArrowRight') showPhoto(cur + 1, 1);
    });
    let sx = 0;
    lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) showPhoto(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    });
  })();

  /* ---------- 10. PDF preview window (internship documents) ---------- */
  (function documents() {
    const links = $$('[data-preview]');
    if (!links.length) return;
    const wide = matchMedia('(min-width:901px) and (hover:hover)');

    const dv = d.createElement('div');
    dv.className = 'dvw';
    dv.setAttribute('role', 'dialog');
    dv.setAttribute('aria-modal', 'true');
    dv.setAttribute('aria-label', 'Document preview');
    dv.innerHTML =
      '<div class="dvw-box"><div class="dvw-top"><span class="dvw-title"></span>' +
      '<a class="dvw-open" target="_blank" rel="noopener"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/></svg><span>Open in new tab</span></a>' +
      '<a class="dvw-dl" download><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11M7 11l5 5 5-5M5 20h14"/></svg><span>Download</span></a>' +
      '<button type="button" class="dvw-x" aria-label="Close preview">&times; Close</button></div>' +
      '<iframe class="dvw-frame" title="Document preview"></iframe></div>';
    d.body.appendChild(dv);

    const frame = $('.dvw-frame', dv), title = $('.dvw-title', dv), openA = $('.dvw-open', dv), dlA = $('.dvw-dl', dv);
    let last = null;

    function openDoc(url, name) {
      last = d.activeElement;
      title.textContent = name || 'Document';
      openA.href = url; dlA.href = url;
      frame.src = url + '#view=FitH';
      dv.classList.add('open');
      d.body.style.overflow = 'hidden';
      $('.dvw-x', dv).focus();
    }
    function closeDoc() {
      dv.classList.remove('open');
      d.body.style.overflow = '';
      setTimeout(() => { frame.src = 'about:blank'; }, 350);
      if (last) last.focus();
    }

    links.forEach(a => a.addEventListener('click', e => {
      if (!wide.matches) return;            /* phones and tablets: open the PDF in a new tab */
      e.preventDefault();
      openDoc(a.getAttribute('href'), a.dataset.title);
    }));
    $('.dvw-x', dv).addEventListener('click', closeDoc);
    dv.addEventListener('click', e => { if (e.target === dv) closeDoc(); });
    d.addEventListener('keydown', e => { if (e.key === 'Escape' && dv.classList.contains('open')) closeDoc(); });
  })();
})();