/* Saddam Hussain Sahito — Portfolio JavaScript */
(() => {
  'use strict';

  const doc = document;
  const root = doc.documentElement;

  root.classList.add('js');

  const $ = (s, r = doc) => r.querySelector(s);
  const $$ = (s, r = doc) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover:hover) and (pointer:fine)').matches;

  const clamp = (v, min, max) =>
    Math.min(max, Math.max(min, v));

  /* =========================================
     1. MOBILE NAVIGATION — FIXED
  ========================================= */

  const menuButton = $('header .menu');
  const primaryNav = $('header nav ul');

  if (menuButton && primaryNav) {
    if (!primaryNav.id) {
      primaryNav.id = 'primary-navigation';
    }

    menuButton.type = 'button';
    menuButton.setAttribute('aria-controls', primaryNav.id);

    const setMenu = (open) => {
      primaryNav.classList.toggle('open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.textContent = open ? 'Close' : 'Menu';
    };

    setMenu(false);

    menuButton.addEventListener('click', (event) => {
      event.preventDefault();

      setMenu(
        menuButton.getAttribute('aria-expanded') !== 'true'
      );
    });

    primaryNav.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        setMenu(false);
      }
    });

    doc.addEventListener('click', (event) => {
      if (!event.target.closest('header')) {
        setMenu(false);
      }
    });

    doc.addEventListener('keydown', (event) => {
      if (
        event.key === 'Escape' &&
        menuButton.getAttribute('aria-expanded') === 'true'
      ) {
        setMenu(false);
        menuButton.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) {
        setMenu(false);
      }
    });
  }

  /* =========================================
     2. HERO HEADING ANIMATION
  ========================================= */

  if (!reduceMotion) {
    $$('.hero h1, .phead h1').forEach((heading) => {
      if (heading.children.length) return;

      const words = heading.textContent.trim().split(/\s+/);

      heading.setAttribute('aria-label', words.join(' '));
      heading.textContent = '';

      words.forEach((word, index) => {
        const outer = doc.createElement('span');
        outer.className = 'w';
        outer.setAttribute('aria-hidden', 'true');
        outer.style.setProperty('--i', index);

        const inner = doc.createElement('span');
        inner.textContent = word;

        outer.append(inner);
        heading.append(outer);

        if (index < words.length - 1) {
          heading.append(doc.createTextNode(' '));
        }
      });
    });
  }

  /* =========================================
     3. SCROLL REVEAL ANIMATIONS
  ========================================= */

  const revealItems = $$('.reveal');

  const reveal = (element) => {
    element.classList.add('in');
    element.classList.add('settled');
  };

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(reveal);
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          reveal(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -4% 0px'
      }
    );

    revealItems.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  /* =========================================
     4. ANIMATED NUMBER COUNTERS
  ========================================= */

  const counters = $$('[data-count]');

  const runCounter = (element) => {
    if (element.dataset.counted === 'true') return;

    const target = Number(element.dataset.count);

    if (!Number.isFinite(target)) return;

    element.dataset.counted = 'true';

    const prefix = element.dataset.prefix || '';
    const suffix = element.dataset.suffix || '';

    const decimals = Number.isInteger(target)
      ? 0
      : (String(target).split('.')[1] || '').length;

    const format = (number) =>
      number.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });

    if (reduceMotion || target === 0) {
      element.textContent =
        `${prefix}${format(target)}${suffix}`;
      return;
    }

    const duration = 1450;
    const start = performance.now();

    const tick = (now) => {
      const progress = clamp(
        (now - start) / duration,
        0,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      element.textContent =
        `${prefix}${format(target * eased)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        element.textContent =
          `${prefix}${format(target)}${suffix}`;
      }
    };

    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window && !reduceMotion) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          runCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.25 }
    );

    counters.forEach((counter) => {
      counterObserver.observe(counter);
    });
  } else {
    counters.forEach(runCounter);
  }

  /* =========================================
     5. IMAGE REVEAL ANIMATIONS
  ========================================= */

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const images = $$('main img:not(.gxlb-img)');

    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('image-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08 }
    );

    images.forEach((image) => {
      if (image.complete) {
        image.classList.add('image-ready');
      } else {
        image.addEventListener(
          'load',
          () => image.classList.add('image-ready'),
          { once: true }
        );
      }

      imageObserver.observe(image);
    });
  }

  /* =========================================
     6. INTERNSHIP GALLERY LIGHTBOX
  ========================================= */

  const gallery = $('.gx');
  const lightbox = $('.gxlb');

  if (gallery && lightbox) {
    const galleryButtons = $$('.gx-btn', gallery);

    const image = $('.gxlb-img', lightbox);
    const count = $('.gxlb-count', lightbox);

    const closeButton = $('.gxlb-close', lightbox);
    const previousButton = $('.gxlb-prev', lightbox);
    const nextButton = $('.gxlb-next', lightbox);

    let currentIndex = 0;
    let returnFocus = null;
    let touchStartX = 0;

    const imageSource = (button) => {
      const img = $('img', button);

      return img ? img.currentSrc || img.src : '';
    };

    const showImage = (index, direction = 1) => {
      if (!galleryButtons.length) return;

      currentIndex =
        (index + galleryButtons.length) % galleryButtons.length;

      const button = galleryButtons[currentIndex];
      const source = imageSource(button);
      const sourceImg = $('img', button);

      if (source && image) {
        image.classList.add('swap');

        window.setTimeout(() => {
          image.src = source;

          image.alt = sourceImg
            ? sourceImg.alt
            : 'Internship gallery image';

          image.style.setProperty(
            '--sx',
            `${direction * 22}px`
          );

          image.classList.remove('swap');
        }, reduceMotion ? 0 : 130);
      }

      if (count) {
        count.textContent =
          `${currentIndex + 1} / ${galleryButtons.length}`;
      }
    };

    const openLightbox = (index) => {
      returnFocus = doc.activeElement;

      showImage(index, 1);

      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');

      doc.body.classList.add('modal-open');

      if (closeButton) closeButton.focus();
    };

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');

      doc.body.classList.remove('modal-open');

      if (returnFocus) returnFocus.focus();
    };

    galleryButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        openLightbox(index);
      });
    });

    if (closeButton) {
      closeButton.addEventListener('click', closeLightbox);
    }

    if (previousButton) {
      previousButton.addEventListener('click', () => {
        showImage(currentIndex - 1, -1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        showImage(currentIndex + 1, 1);
      });
    }

    lightbox.addEventListener('click', (event) => {
      if (
        event.target === lightbox ||
        event.target.classList.contains('gxlb-stage')
      ) {
        closeLightbox();
      }
    });

    doc.addEventListener('keydown', (event) => {
      if (!lightbox.classList.contains('open')) return;

      if (event.key === 'Escape') {
        closeLightbox();
      }

      if (event.key === 'ArrowLeft') {
        showImage(currentIndex - 1, -1);
      }

      if (event.key === 'ArrowRight') {
        showImage(currentIndex + 1, 1);
      }
    });

    lightbox.addEventListener(
      'touchstart',
      (event) => {
        touchStartX = event.touches[0].clientX;
      },
      { passive: true }
    );

    lightbox.addEventListener(
      'touchend',
      (event) => {
        const delta =
          event.changedTouches[0].clientX - touchStartX;

        if (Math.abs(delta) > 50) {
          showImage(
            currentIndex + (delta < 0 ? 1 : -1),
            delta < 0 ? 1 : -1
          );
        }
      },
      { passive: true }
    );
  }

  /* =========================================
     7. PDF DOCUMENT PREVIEW
  ========================================= */

  const previewLinks = $$('[data-preview]');

  if (previewLinks.length) {
    const dialog = doc.createElement('div');

    dialog.className = 'dvw';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-label', 'Document preview');
    dialog.setAttribute('aria-hidden', 'true');

    dialog.innerHTML = `
      <div class="dvw-box">
        <div class="dvw-top">
          <span class="dvw-title"></span>
          <a class="dvw-open" target="_blank" rel="noopener">
            Open in new tab
          </a>
          <a class="dvw-dl" download>Download</a>
          <button type="button" class="dvw-x">Close</button>
        </div>
        <iframe class="dvw-frame" title="Document preview"></iframe>
      </div>
    `;

    doc.body.append(dialog);

    const frame = $('.dvw-frame', dialog);
    const title = $('.dvw-title', dialog);
    const openLink = $('.dvw-open', dialog);
    const downloadLink = $('.dvw-dl', dialog);
    const close = $('.dvw-x', dialog);

    let previousFocus = null;

    const closePreview = () => {
      dialog.classList.remove('open');
      dialog.setAttribute('aria-hidden', 'true');

      doc.body.classList.remove('modal-open');

      frame.removeAttribute('src');

      if (previousFocus) previousFocus.focus();
    };

    previewLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        const url =
          link.dataset.preview || link.getAttribute('href');

        if (!url) return;

        event.preventDefault();

        previousFocus = doc.activeElement;

        title.textContent =
          link.dataset.title ||
          link.textContent.trim() ||
          'Document';

        openLink.href = url;
        downloadLink.href = url;

        frame.src = `${url}#view=FitH`;

        dialog.classList.add('open');
        dialog.setAttribute('aria-hidden', 'false');

        doc.body.classList.add('modal-open');

        close.focus();
      });
    });

    close.addEventListener('click', closePreview);

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closePreview();
    });

    doc.addEventListener('keydown', (event) => {
      if (
        event.key === 'Escape' &&
        dialog.classList.contains('open')
      ) {
        closePreview();
      }
    });
  }

  /* =========================================
     8. SCROLL PROGRESS BAR
  ========================================= */

  const progress = doc.createElement('div');

  progress.className = 'progress';
  progress.setAttribute('aria-hidden', 'true');

  doc.body.append(progress);

  /* =========================================
     9. BACK TO TOP BUTTON
  ========================================= */

  const backToTop = doc.createElement('button');

  backToTop.type = 'button';
  backToTop.className = 'totop';
  backToTop.setAttribute('aria-label', 'Back to top');

  backToTop.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>
  `;

  backToTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
  });

  doc.body.append(backToTop);

  /* =========================================
     10. TIMELINE AND SCROLL EFFECTS
  ========================================= */

  const header = $('header');
  const timeline = $('.tl');
  const timelineSteps = $$('.step');

  let scrollQueued = false;

  const updateScroll = () => {
    scrollQueued = false;

    const y = window.scrollY;

    const max =
      root.scrollHeight - window.innerHeight;

    progress.style.setProperty(
      '--p',
      max > 0 ? clamp(y / max, 0, 1) : 0
    );

    if (header) {
      header.classList.toggle('scrolled', y > 24);
    }

    backToTop.classList.toggle('show', y > 650);

    if (timeline) {
      const rect = timeline.getBoundingClientRect();
      const midpoint = window.innerHeight * 0.62;

      timeline.style.setProperty(
        '--tlp',
        clamp(
          (midpoint - rect.top) / Math.max(rect.height, 1),
          0,
          1
        )
      );

      timelineSteps.forEach((step) => {
        step.classList.toggle(
          'on',
          step.getBoundingClientRect().top < midpoint
        );
      });
    }
  };

  const queueScroll = () => {
    if (scrollQueued) return;

    scrollQueued = true;

    requestAnimationFrame(updateScroll);
  };

  window.addEventListener('scroll', queueScroll, {
    passive: true
  });

  window.addEventListener('resize', queueScroll, {
    passive: true
  });

  updateScroll();

  /* =========================================
     11. DESKTOP CURSOR GLOW
  ========================================= */

  if (finePointer && !reduceMotion) {
    const glow = doc.createElement('div');

    glow.className = 'cglow';
    glow.setAttribute('aria-hidden', 'true');

    doc.body.append(glow);

    let pointerFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let pointerTarget = null;

    doc.addEventListener(
      'pointermove',
      (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        pointerTarget = event.target;

        if (pointerFrame) return;

        pointerFrame = requestAnimationFrame(() => {
          pointerFrame = 0;

          glow.style.setProperty('--cx', `${pointerX}px`);
          glow.style.setProperty('--cy', `${pointerY}px`);

          const card =
            pointerTarget &&
            pointerTarget.closest &&
            pointerTarget.closest('.card');

          if (card) {
            const rect = card.getBoundingClientRect();

            card.style.setProperty(
              '--mx',
              `${pointerX - rect.left}px`
            );

            card.style.setProperty(
              '--my',
              `${pointerY - rect.top}px`
            );
          }
        });
      },
      { passive: true }
    );
  }

})();
