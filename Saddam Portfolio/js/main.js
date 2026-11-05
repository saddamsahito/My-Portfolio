
/* ==========================================================================
   Saddam Hussain Sahito — Portfolio
   Complete main.js
   ========================================================================== */
(() => {
  'use strict';

  const d = document, root = d.documentElement;
  root.classList.add('js');

  const $ = (s, r = d) => r.querySelector(s);
  const $$ = (s, r = d) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* 1. Hero heading animation */
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

  /* 2. Progress bar and back-to-top */
  const bar = d.createElement('div');
  bar.className = 'progress';
  bar.setAttribute('aria-hidden', 'true');
  d.body.appendChild(bar);

  const top = d.createElement('button');
  top.type = 'button';
  top.className = 'totop';
  top.setAttribute('aria-label', 'Back to top');
  top.innerHTML =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';

  top.addEventListener('click', () => {
    scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });

  d.body.appendChild(top);

  let glow = null;

  if (fine && !reduce) {
    glow = d.createElement('div');
    glow.className = 'cglow';
    glow.setAttribute('aria-hidden', 'true');
    d.body.appendChild(glow);
  }

  /* 3. Scroll handling */
  const header = $('header');
  const tl = $('.tl');
  const steps = $$('.step');
  let ticking = false;

  function onScroll() {
    ticking = false;

    const y = scrollY;
    const max = root.scrollHeight - innerHeight;

    bar.style.setProperty(
      '--p',
      max > 0 ? clamp(y / max, 0, 1).toFixed(4) : 0
    );

    if (header) header.classList.toggle('scrolled', y > 24);

    top.classList.toggle('show', y > 700);

    if (!reduce) root.style.setProperty('--py', Math.round(y));

    if (tl) {
      const r = tl.getBoundingClientRect();
      const mid = innerHeight * 0.62;

      tl.style.setProperty(
        '--tlp',
        clamp((mid - r.top) / r.height, 0, 1).toFixed(4)
      );

      steps.forEach(s => {
        s.classList.toggle('on', s.getBoundingClientRect().top < mid);
      });
    }
  }

  addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  addEventListener('resize', onScroll);
  onScroll();

  /* 4. Scroll reveal */
  const reveals = $$('.reveal');

  const show = el => {
    el.classList.add('in');

    const delay =
      parseFloat((el.style.getPropertyValue('--d') || '0').replace('s', '')) || 0;

    setTimeout(() => {
      el.classList.add('settled');
    }, reduce ? 0 : 1000 + delay * 1000);
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          show(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, {
      threshold: .12,
      rootMargin: '0px 0px -5% 0px'
    });

    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(show);
  }

  /* 5. Professional image transitions */
  const imageStyle = d.createElement('style');
  imageStyle.id = 'portfolio-image-motion';

  imageStyle.textContent = `
    main img:not(.gxlb-img),
    .gx-item img,
    .frame img,
    .card img {
      transition:
        transform 650ms cubic-bezier(.2,.7,.2,1),
        filter 650ms cubic-bezier(.2,.7,.2,1),
        opacity 700ms ease;
      will-change: transform;
    }

    .gx-item,
    .frame,
    .card {
      overflow: hidden;
    }

    .gx-item img {
      transform: scale(1.015);
    }

    .gx-item.in img {
      animation: portfolioImageReveal 850ms cubic-bezier(.2,.7,.2,1) both;
    }

    .gx-item:hover img {
      transform: scale(1.065);
      filter: saturate(1.06) contrast(1.02);
    }

    .frame img {
      transform: scale(1.01);
    }

    .frame:hover img {
      transform: scale(1.045);
    }

    .card img {
      transform: scale(1);
    }

    .card:hover img {
      transform: scale(1.035);
    }

    @keyframes portfolioImageReveal {
      from {
        opacity: .45;
        transform: scale(1.07) translateY(12px);
        filter: blur(3px) saturate(.8);
      }

      to {
        opacity: 1;
        transform: scale(1.015) translateY(0);
        filter: blur(0) saturate(1);
      }
    }

    @media (prefers-reduced-motion: reduce) {
      main img:not(.gxlb-img),
      .gx-item img,
      .frame img,
      .card img {
        transition: none !important;
        transform: none !important;
      }
    }
  `;

  if (!$('#portfolio-image-motion')) {
    d.head.appendChild(imageStyle);
  }

  /* 6. Animated counters across portfolio pages */
  const statisticWords =
    /\b(semester|internship|hours?|students?|learners?|pupils?|teaching|levels?|responsibilit(?:y|ies)|experience|projects?|certificates?|courses?|workshops?|achievements?|awards?|classes?|lessons?|schools?|institutions?|subjects?|skills? taught|percentage|percent|trained|taught|completed|years?)\b/i;

  const statisticClasses =
    /\b(stat|stats|counter|metric|number|achievement|fact|highlight|score|experience|education|internship)\b/i;

  const generatedCounters = [];
  const numericToken = /\d+(?:,\d{3})*(?:\.\d+)?/g;

  function animateNumber(el, target, prefix = '', suffix = '') {
    if (el.dataset.counted === 'true') return;
    if (!Number.isFinite(target)) return;

    el.dataset.counted = 'true';

    const decimals = String(target).includes('.')
      ? String(target).split('.')[1].length
      : 0;

    const format = value => value.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });

    if (reduce || target === 0) {
      el.textContent = prefix + format(target) + suffix;
      return;
    }

    const duration = 1600;
    const start = performance.now();

    function frame(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      const value = progress === 1
        ? target
        : Math.round(target * eased * (10 ** decimals)) / (10 ** decimals);

      el.textContent = prefix + format(value) + suffix;

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.textContent = prefix + format(target) + suffix;
      }
    }

    requestAnimationFrame(frame);
  }

  /* Existing HTML counters */
  $$('[data-count]').forEach(el => {
    const target = Number(el.dataset.count);

    if (!Number.isFinite(target)) return;

    const original = el.textContent.trim();
    const match = original.match(/^([^\d]*)([\d,.]+)(.*)$/);

    const prefix = el.dataset.prefix ?? (match ? match[1] : '');
    const suffix = el.dataset.suffix ?? (match ? match[3] : '');

    el.textContent = prefix + '0' + suffix;
    el.dataset.counted = 'false';

    generatedCounters.push({
      el,
      target,
      prefix,
      suffix
    });
  });

  /* Detect numbers written beside statistic labels */
  const walker = d.createTreeWalker(
    d.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode(node) {
        const parent = node.parentElement;

        if (!parent || !node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }

        if (parent.closest(
          'script,style,noscript,svg,nav,footer,address,time,a[href^="tel:"],[data-no-counter],[data-count]'
        )) {
          return NodeFilter.FILTER_REJECT;
        }

        return /\d/.test(node.nodeValue)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    }
  );

  const textNodes = [];

  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach(node => {
    const parent = node.parentElement;
    const raw = node.nodeValue;

    const ancestors = [
      parent,
      parent.parentElement,
      parent.parentElement?.parentElement
    ].filter(Boolean);

    const context = ancestors.map(el => {
      const cls = typeof el.className === 'string'
        ? el.className
        : '';

      return cls + ' ' +
        (el.getAttribute('aria-label') || '') + ' ' +
        (el.innerText || el.textContent || '').slice(0, 350);
    }).join(' ');

    if (
      !statisticWords.test(context) &&
      !statisticClasses.test(context)
    ) return;

    const fragment = d.createDocumentFragment();
    let lastIndex = 0;
    let match;
    let changed = false;

    numericToken.lastIndex = 0;

    while ((match = numericToken.exec(raw)) !== null) {
      const valueText = match[0];
      const value = Number(valueText.replace(/,/g, ''));

      const before = raw.slice(
        Math.max(0, match.index - 1),
        match.index
      );

      const after = raw.slice(
        match.index + valueText.length,
        match.index + valueText.length + 5
      );

      /* Avoid years, dates, phone-like values and ordinary numbers */
      if (
        !Number.isFinite(value) ||
        value > 1000000 ||
        value < 0 ||
        (value >= 1900 && value <= 2099) ||
        /[\d/.-]$/.test(before) ||
        /^[\d/.-]/.test(after)
      ) continue;

      if (match.index > lastIndex) {
        fragment.appendChild(
          d.createTextNode(raw.slice(lastIndex, match.index))
        );
      }

      const counter = d.createElement('span');
      counter.className = 'portfolio-auto-counter';
      counter.textContent = '0';
      counter.dataset.counted = 'false';

      fragment.appendChild(counter);

      generatedCounters.push({
        el: counter,
        target: value,
        prefix: '',
        suffix: ''
      });

      lastIndex = match.index + valueText.length;
      changed = true;
    }

    if (changed) {
      if (lastIndex < raw.length) {
        fragment.appendChild(
          d.createTextNode(raw.slice(lastIndex))
        );
      }

      node.parentNode.replaceChild(fragment, node);
    }
  });

  /* Start each counter when it enters the screen */
  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const item = generatedCounters.find(
          counter => counter.el === entry.target
        );

        if (item) {
          animateNumber(
            item.el,
            item.target,
            item.prefix,
            item.suffix
          );
        }

        counterObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0,
      rootMargin: '0px'
    });

    generatedCounters.forEach(item => {
      counterObserver.observe(item.el);
    });
  } else {
    generatedCounters.forEach(item => {
      animateNumber(
        item.el,
        item.target,
        item.prefix,
        item.suffix
      );
    });
  }

  /* 7. Mobile navigation menu */
  const menu = $('header .menu') || $('.menu');
  const list = $('header nav ul') || $('nav ul');

  if (menu && list) {
    if (!list.id) list.id = 'primary-navigation';

    menu.setAttribute('type', 'button');
    menu.setAttribute('aria-controls', list.id);
    menu.setAttribute('aria-expanded', 'false');

    const mobileStyle = d.createElement('style');
    mobileStyle.id = 'portfolio-mobile-menu-fix';

    mobileStyle.textContent = `
      @media (max-width: 900px) {
        header {
          position: relative;
        }

        header nav ul.open,
        nav ul.open {
          display: flex !important;
          visibility: visible !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          flex-direction: column !important;
          align-items: stretch !important;
          position: absolute !important;
          top: calc(100% + 10px) !important;
          right: 12px !important;
          left: auto !important;
          width: min(280px, calc(100vw - 24px)) !important;
          max-height: calc(100vh - 100px) !important;
          overflow-y: auto !important;
          padding: 12px !important;
          margin: 0 !important;
          gap: 4px !important;
          z-index: 99999 !important;
          background: var(--card, var(--surface, #fff)) !important;
          border: 1px solid var(--line, rgba(0,0,0,.14)) !important;
          border-radius: 14px !important;
          box-shadow: 0 14px 35px rgba(0,0,0,.18) !important;
          transform: none !important;
        }

        header nav ul.open li,
        nav ul.open li {
          display: block !important;
          width: 100% !important;
        }

        header nav ul.open a,
        nav ul.open a {
          display: block !important;
          width: 100% !important;
          padding: 12px 14px !important;
          text-align: left !important;
        }
      }
    `;

    if (!$('#portfolio-mobile-menu-fix')) {
      d.head.appendChild(mobileStyle);
    }

    const setOpen = open => {
      list.classList.toggle('open', open);
      menu.setAttribute('aria-expanded', String(open));
      menu.textContent = open ? 'Close' : 'Menu';
    };

    if (innerWidth <= 900) setOpen(false);

    menu.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(!list.classList.contains('open'));
    });

    list.addEventListener('click', e => {
      if (e.target.closest('a')) setOpen(false);
    });

    d.addEventListener('click', e => {
      if (!e.target.closest('header')) setOpen(false);
    });

    d.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        setOpen(false);
        menu.focus();
      }
    });

    addEventListener('resize', () => {
      if (innerWidth > 900) setOpen(false);
    });
  }

  /* 8. Cursor glow, card spotlight and magnetic buttons */
  if (fine) {
    let raf = 0, mx = 0, my = 0, target = null;

    d.addEventListener('pointermove', e => {
      mx = e.clientX;
      my = e.clientY;
      target = e.target;

      if (raf) return;

      raf = requestAnimationFrame(() => {
        raf = 0;

        if (glow) {
          glow.style.setProperty('--cx', mx + 'px');
          glow.style.setProperty('--cy', my + 'px');
        }

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

          b.style.setProperty(
            '--tx',
            ((e.clientX - r.left - r.width / 2) * .18).toFixed(1) + 'px'
          );

          b.style.setProperty(
            '--ty',
            ((e.clientY - r.top - r.height / 2) * .28).toFixed(1) + 'px'
          );
        });

        b.addEventListener('pointerleave', () => {
          b.style.setProperty('--tx', '0px');
          b.style.setProperty('--ty', '0px');
        });
      });

      $$('.frame').forEach(f => {
        f.addEventListener('pointermove', e => {
          const r = f.getBoundingClientRect();

          f.style.setProperty(
            '--ry',
            (((e.clientX - r.left) / r.width - .5) * 12).toFixed(2) + 'deg'
          );

          f.style.setProperty(
            '--rx',
            ((.5 - (e.clientY - r.top) / r.height) * 12).toFixed(2) + 'deg'
          );
        });

        f.addEventListener('pointerleave', () => {
          f.style.setProperty('--rx', '0deg');
          f.style.setProperty('--ry', '0deg');
        });
      });
    }
  }

  /* 9. Page transitions */
  d.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href]');

    if (
      !a || e.defaultPrevented || e.button !== 0 ||
      e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
    ) return;

    if (a.target === '_blank' || a.hasAttribute('download')) return;

    let u;

    try {
      u = new URL(a.href, location.href);
    } catch (_) {
      return;
    }

    if (u.origin !== location.origin || !/\.html?$/i.test(u.pathname)) return;

    if (u.pathname === location.pathname && u.search === location.search) return;

    e.preventDefault();
    root.classList.add('leaving');

    setTimeout(() => {
      location.href = u.href;
    }, reduce ? 0 : 260);

    setTimeout(() => root.classList.remove('leaving'), 2500);
  });

  addEventListener('pageshow', () => {
    root.classList.remove('leaving');
  });

  /* 10. Internship photo gallery and lightbox */
  (function gallery() {
    const grid = d.getElementById('gx');
    if (!grid) return;

    const items = $$('.gx-item', grid);

    items.forEach((el, i) => {
      el.classList.add(i % 2 ? 'fl2' : 'fl1');
    });

    grid.classList.add('ready');

    if ('IntersectionObserver' in window) {
      const gio = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            gio.unobserve(entry.target);
          }
        });
      }, {
        threshold: .05,
        rootMargin: '0px 0px -4% 0px'
      });

      items.forEach(el => gio.observe(el));
    } else {
      items.forEach(el => el.classList.add('in'));
    }

    items.forEach(el => {
      const im = $('img', el);

      if (im) {
        im.addEventListener('error', () => {
          el.classList.add('broken');
        });
      }
    });

    if (!reduce && fine) {
      items.forEach(el => {
        const b = $('.gx-btn', el);
        if (!b) return;

        el.addEventListener('pointermove', e => {
          const r = el.getBoundingClientRect();

          b.style.setProperty(
            '--ry',
            (((e.clientX - r.left) / r.width - .5) * 9).toFixed(2) + 'deg'
          );

          b.style.setProperty(
            '--rx',
            ((.5 - (e.clientY - r.top) / r.height) * 9).toFixed(2) + 'deg'
          );
        });

        el.addEventListener('pointerleave', () => {
          b.style.setProperty('--rx', '0deg');
          b.style.setProperty('--ry', '0deg');
        });
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

    const img = $('.gxlb-img', lb);
    const cnt = $('.gxlb-count', lb);
    const prog = $('.gxlb-bar i', lb);

    let cur = 0;
    let last = null;

    function showPhoto(i, dir) {
      cur = (i + items.length) % items.length;

      const src = $('img', items[cur]);

      img.style.setProperty('--sx', (dir || 1) * 30 + 'px');
      img.classList.add('swap');

      setTimeout(() => {
        img.src = src.currentSrc || src.src;
        img.alt = src.alt;

        cnt.textContent =
          String(cur + 1).padStart(2, '0') + ' / ' +
          String(items.length).padStart(2, '0');

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

    items.forEach((el, i) => {
      const button = $('.gx-btn', el);

      if (button) {
        button.addEventListener('click', () => openPhoto(i));
      }
    });

    $('.gxlb-close', lb).addEventListener('click', closePhoto);

    $('.gxlb-prev', lb).addEventListener('click', () => {
      showPhoto(cur - 1, -1);
    });

    $('.gxlb-next', lb).addEventListener('click', () => {
      showPhoto(cur + 1, 1);
    });

    lb.addEventListener('click', e => {
      if (
        e.target === lb ||
        e.target.classList.contains('gxlb-stage')
      ) {
        closePhoto();
      }
    });

    d.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;

      if (e.key === 'Escape') closePhoto();
      if (e.key === 'ArrowLeft') showPhoto(cur - 1, -1);
      if (e.key === 'ArrowRight') showPhoto(cur + 1, 1);
    });

    let sx = 0;

    lb.addEventListener('touchstart', e => {
      sx = e.touches[0].clientX;
    }, { passive: true });

    lb.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx;

      if (Math.abs(dx) > 50) {
        showPhoto(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
      }
    });
  })();

  /* 11. PDF preview window */
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

    const frame = $('.dvw-frame', dv);
    const title = $('.dvw-title', dv);
    const openA = $('.dvw-open', dv);
    const dlA = $('.dvw-dl', dv);

    let last = null;

    function openDoc(url, name) {
      last = d.activeElement;

      title.textContent = name || 'Document';
      openA.href = url;
      dlA.href = url;
      frame.src = url + '#view=FitH';

      dv.classList.add('open');
      d.body.style.overflow = 'hidden';
      $('.dvw-x', dv).focus();
    }

    function closeDoc() {
      dv.classList.remove('open');
      d.body.style.overflow = '';

      setTimeout(() => {
        frame.src = 'about:blank';
      }, 350);

      if (last) last.focus();
    }

    links.forEach(a => {
      a.addEventListener('click', e => {
        if (!wide.matches) return;

        e.preventDefault();
        openDoc(a.getAttribute('href'), a.dataset.title);
      });
    });

    $('.dvw-x', dv).addEventListener('click', closeDoc);

    dv.addEventListener('click', e => {
      if (e.target === dv) closeDoc();
    });

    d.addEventListener('keydown', e => {
      if (
        e.key === 'Escape' &&
        dv.classList.contains('open')
      ) {
        closeDoc();
      }
    });
  })();

})();
