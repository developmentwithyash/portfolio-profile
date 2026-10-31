/**
 * YASH — MASTER PRODUCT PORTFOLIO CLIENT SCRIPT
 * Silky 120 FPS Native Interaction, Emil Kowalski Springs & Accessibility
 */

import { portfolioData } from '../data/portfolio-data.js';
import { initPhoneDemos } from './phone-demo.js';

document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initCursorSpotlight();
  initHeaderScroll();
  initCategoryFilters();
  renderProjects('all');
  renderServices();
  renderProcess();
  renderTestimonials();
  renderFAQs();
  initCopyEmailButtons();
  initModalListeners();
  initFloatingPhoneParallax();
  initPhoneDemos();
});

/**
 * Lenis Inertial Smooth Scrolling System (Cupertino Caliber)
 */
function initLenis() {
  if (typeof window.Lenis === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lenis = new window.Lenis({
    lerp: 0.1, // Silky, responsive 120 FPS linear interpolation with zero input lag
    smoothWheel: true,
    syncTouch: false, // Let native inertia handle touch smoothly without JS conflict
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
  });

  window.__lenis = lenis;

  // Synchronize Lenis scroll position with GSAP ScrollTrigger
  if (window.ScrollTrigger) {
    lenis.on('scroll', window.ScrollTrigger.update);
  }

  // Single unified frame loop: drive Lenis via GSAP's ticker if available, or fall back to RAF
  if (window.gsap && window.gsap.ticker) {
    window.gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    window.gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Synchronize scroll progress bar
  const progress = document.getElementById('scroll-progress');
  lenis.on('scroll', (e) => {
    if (progress && e.limit > 0) {
      const p = Math.min(1, Math.max(0, e.scroll / e.limit));
      progress.style.transform = `scaleX(${p})`;
    }
  });

  // Smooth anchor navigation
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href && href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -70 });
        }
      }
    });
  });
}

/**
 * GPU-Accelerated Cursor Spotlight (Zero Scroll Overhead)
 */
function initCursorSpotlight() {
  const spotlight = document.getElementById('ambient-spotlight');
  if (!spotlight || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let ticking = false;

  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!ticking) {
      requestAnimationFrame(updateSpotlight);
      ticking = true;
    }
  }, { passive: true });

  function updateSpotlight() {
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;
    spotlight.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

    if (Math.hypot(mouseX - currentX, mouseY - currentY) > 0.5) {
      requestAnimationFrame(updateSpotlight);
    } else {
      ticking = false;
    }
  }
}

/**
 * Header Scroll Hairline Trigger
 */
function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const onScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * Category Filter Tabs with Sliding Spring Pill Indicator
 */
let activeCategory = 'all';

function initCategoryFilters() {
  const filterBar = document.getElementById('category-filter-bar');
  const indicator = document.getElementById('filter-pill-indicator');
  if (!filterBar || !indicator) return;

  filterBar.innerHTML = '';
  filterBar.appendChild(indicator);

  portfolioData.categories.forEach((cat) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `filter-btn ${cat.id === activeCategory ? 'active' : ''}`;
    btn.id = `tab-${cat.id}`;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', cat.id === activeCategory ? 'true' : 'false');
    btn.setAttribute('aria-controls', 'projects-grid');
    btn.textContent = cat.label;

    btn.addEventListener('click', () => {
      if (activeCategory === cat.id) return;
      activeCategory = cat.id;

      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      updatePillIndicator(btn);
      renderProjects(cat.id);
    });

    filterBar.appendChild(btn);
  });

  // Initial pill positioning
  setTimeout(() => {
    const firstTab = document.getElementById(`tab-${activeCategory}`);
    if (firstTab) updatePillIndicator(firstTab);
  }, 100);

  window.addEventListener('resize', () => {
    const activeTab = document.querySelector('.filter-btn.active');
    if (activeTab) updatePillIndicator(activeTab);
  }, { passive: true });
}

function updatePillIndicator(tabEl) {
  const indicator = document.getElementById('filter-pill-indicator');
  if (!indicator || !tabEl) return;

  indicator.style.transform = `translateX(${tabEl.offsetLeft}px)`;
  indicator.style.width = `${tabEl.offsetWidth}px`;
}

/**
 * Render Projects into Bento Grid
 */
function renderProjects(categoryId) {
  const grid = document.getElementById('projects-grid');
  const counter = document.getElementById('project-counter-badge');
  if (!grid) return;

  const filtered = categoryId === 'all'
    ? portfolioData.projects
    : portfolioData.projects.filter(p => p.category === categoryId);

  if (counter) {
    counter.textContent = `Showing ${filtered.length} of ${portfolioData.projects.length} projects`;
  }

  // Smooth render
  grid.style.opacity = '0';
  grid.style.transform = 'translateY(6px)';
  grid.style.transition = 'opacity 0.2s ease, transform 0.2s ease';

  setTimeout(() => {
    grid.innerHTML = filtered.map((proj, idx) => {
      const isHero = idx === 0 && proj.featured;
      const heroClass = isHero ? 'featured-hero' : '';

      return `
        <article class="project-card ${heroClass}" data-id="${proj.id}" tabindex="0" role="button" aria-label="View deep-dive for ${proj.title}">
          <div class="card-media">
            <span class="card-badge">${proj.badge}</span>
            <img src="${proj.image}" alt="${proj.title} preview" loading="lazy">
            <div class="card-media-overlay"></div>
          </div>
          <div class="card-content">
            <div class="card-title-row">
              <h3 class="card-title">${proj.title}</h3>
              <span class="card-year">${proj.year}</span>
            </div>
            <p class="card-tagline">${proj.tagline}</p>
            
            <div class="card-metrics-row">
              ${proj.metrics.map(m => `
                <div class="metric-pill">
                  <span class="metric-pill-label">${m.label}:</span>
                  <span class="metric-pill-value">${m.value}</span>
                </div>
              `).join('')}
            </div>

            <div class="card-stack">
              ${proj.stack.slice(0, 4).map(tech => `
                <span class="stack-tag">${tech}</span>
              `).join('')}
              ${proj.stack.length > 4 ? `<span class="stack-tag">+${proj.stack.length - 4}</span>` : ''}
            </div>

            <div class="card-footer">
              <span>Deep-dive Architecture</span>
              <span class="arrow-glyph" aria-hidden="true">→</span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach click and enter listeners
    document.querySelectorAll('.project-card').forEach(card => {
      const id = card.getAttribute('data-id');
      const openModal = () => openProjectModal(id);

      card.addEventListener('click', openModal);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal();
        }
      });
    });

    grid.style.opacity = '1';
    grid.style.transform = 'translateY(0)';
  }, 120);
}

/**
 * Render Core Engineering Services
 */
function renderServices() {
  const container = document.getElementById('services-grid');
  if (!container) return;

  const icons = {
    smartphone: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>`,
    sparkles: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>`,
    cpu: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`,
    boxes: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l6 3.43a2 2 0 0 0 1.96 0l6-3.43a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71l-6-3.43a2 2 0 0 0-1.96 0l-6 3.43z"/><path d="m12 21.8-6-3.43"/><path d="m12 15 6 3.4"/><path d="m18 10 3.86-2.2a2 2 0 0 0 0-3.46L13.9.4a2 2 0 0 0-1.8 0L4.14 4.34a2 2 0 0 0 0 3.46L8 10"/></svg>`
  };

  container.innerHTML = portfolioData.services.map(svc => `
    <div class="service-box">
      <div class="service-icon-wrap" aria-hidden="true">
        ${icons[svc.icon] || icons.sparkles}
      </div>
      <h3 class="service-title">${svc.title}</h3>
      <div class="service-tagline">${svc.tagline}</div>
      <p class="service-desc">${svc.description}</p>
      
      <ul class="deliverables-list" aria-label="Included Deliverables">
        ${svc.deliverables.map(deliv => `<li>${deliv}</li>`).join('')}
      </ul>
    </div>
  `).join('');
}

/**
 * Render Process Timeline
 */
function renderProcess() {
  const container = document.getElementById('process-grid');
  if (!container) return;

  container.innerHTML = portfolioData.process.map(step => `
    <div class="process-card">
      <div class="step-num">${step.step}</div>
      <h3 class="step-title">${step.title}</h3>
      <p class="step-desc">${step.description}</p>
    </div>
  `).join('');
}

/**
 * Render Testimonials
 */
function renderTestimonials() {
  const container = document.getElementById('testimonials-grid');
  if (!container) return;

  container.innerHTML = portfolioData.testimonials.map(item => `
    <div class="testimonial-card">
      <p class="testimonial-quote">${item.quote}</p>
      <div class="author-meta">
        <div class="author-glyph" aria-hidden="true">${item.author.charAt(0)}</div>
        <div>
          <div class="author-name">${item.author}</div>
          <div class="author-role">${item.role} • ${item.company}</div>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Render FAQ Accordions
 */
function renderFAQs() {
  const container = document.getElementById('faq-list');
  if (!container) return;

  container.innerHTML = portfolioData.faqs.map((faq, idx) => `
    <div class="faq-row" id="faq-row-${idx}">
      <button class="faq-btn" id="faq-q-${idx}" aria-expanded="false" aria-controls="faq-p-${idx}">
        <span>${faq.q}</span>
        <span class="faq-icon" aria-hidden="true">+</span>
      </button>
      <div class="faq-panel" id="faq-p-${idx}" role="region" aria-labelledby="faq-q-${idx}">
        <div class="faq-inner">${faq.a}</div>
      </div>
    </div>
  `).join('');

  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const panel = item.querySelector('.faq-panel');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Close other rows
      document.querySelectorAll('.faq-row').forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-btn').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-panel').style.maxHeight = null;
        }
      });

      if (!isExpanded) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      } else {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
      }
    });
  });
}

/**
 * Copy Email Buttons (Hero & Contact Section)
 */
function initCopyEmailButtons() {
  const buttons = [
    { btn: document.getElementById('btn-copy-email'), text: document.getElementById('copy-btn-text') },
    { btn: document.getElementById('btn-copy-email-bottom'), text: document.getElementById('copy-btn-text-bottom') }
  ];

  buttons.forEach(({ btn, text }) => {
    if (!btn || !text) return;

    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(portfolioData.developer.email);
        text.textContent = 'COPIED TO CLIPBOARD!';
        btn.style.borderColor = 'var(--accent-yellow)';
        btn.style.color = 'var(--accent-yellow)';
        btn.style.transform = 'scale(1.03)';

        setTimeout(() => {
          text.textContent = 'Copy Email';
          btn.style.borderColor = '';
          btn.style.color = '';
          btn.style.transform = '';
        }, 2500);
      } catch {
        text.textContent = 'COPIED!';
        setTimeout(() => { text.textContent = 'Copy Email'; }, 2000);
      }
    });
  });
}

/**
 * Accessible Project Modal Dialog Handlers
 */
let lastFocusedElement = null;

function initModalListeners() {
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (!modal || !closeBtn) return;

  closeBtn.addEventListener('click', closeProjectModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeProjectModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeProjectModal();
    }
  });

  window.__openProjectModalDirect = openProjectModal;
}

function openProjectModal(projectId) {
  const proj = portfolioData.projects.find(p => p.id === projectId);
  if (!proj) return;

  lastFocusedElement = document.activeElement;

  const modal = document.getElementById('project-modal');
  const badge = document.getElementById('modal-badge');
  const title = document.getElementById('modal-title');
  const tagline = document.getElementById('modal-tagline');
  const img = document.getElementById('modal-img');
  const metrics = document.getElementById('modal-metrics');
  const desc = document.getElementById('modal-desc');
  const highlights = document.getElementById('modal-highlights');
  const archBox = document.getElementById('modal-architecture-box');
  const stack = document.getElementById('modal-stack');
  const githubLink = document.getElementById('modal-github-link');
  const liveLink = document.getElementById('modal-live-link');

  badge.textContent = proj.badge;
  title.textContent = proj.title;
  tagline.textContent = proj.tagline;
  img.src = proj.image;
  img.alt = `${proj.title} architecture screenshot`;
  desc.textContent = proj.description;
  archBox.textContent = proj.architectureNotes;

  metrics.innerHTML = proj.metrics.map(m => `
    <div class="metric-pill">
      <span class="metric-pill-label">${m.label}:</span>
      <span class="metric-pill-value">${m.value}</span>
    </div>
  `).join('');

  highlights.innerHTML = proj.highlights.map(h => `<li>${h}</li>`).join('');

  stack.innerHTML = proj.stack.map(s => `<span class="stack-tag">${s}</span>`).join('');

  githubLink.href = proj.githubUrl;
  liveLink.href = proj.liveUrl;

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (window.__lenis) window.__lenis.stop();

  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) closeBtn.focus();
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (window.__lenis) window.__lenis.start();

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
}

/**
 * 3D Interactive Floating Phone Parallax (Cupertino Keynote Depth)
 * Attaches smooth spring tilt physics to all floating hardware stages.
 */
function initFloatingPhoneParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || 'ontouchstart' in window) return;

  const stages = document.querySelectorAll('.hero-stage-3d');
  if (!stages.length) return;

  stages.forEach((stage) => {
    const device = stage.querySelector('.hero-floating-device');
    if (!device) return;

    let rafId = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovered = false;

    function updateTransform() {
      if (!isHovered) {
        currentX += (0 - currentX) * 0.08;
        currentY += (0 - currentY) * 0.08;
        if (Math.abs(currentX) > 0.01 || Math.abs(currentY) > 0.01) {
          device.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
          rafId = requestAnimationFrame(updateTransform);
        } else {
          device.style.transform = '';
          rafId = null;
        }
        return;
      }

      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;
      device.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
      rafId = requestAnimationFrame(updateTransform);
    }

    stage.addEventListener('mousemove', (e) => {
      const rect = stage.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetY = x * 12;
      targetX = -y * 10;
      isHovered = true;
      if (!rafId) rafId = requestAnimationFrame(updateTransform);
    }, { passive: true });

    stage.addEventListener('mouseleave', () => {
      isHovered = false;
      targetX = 0;
      targetY = 0;
      if (!rafId) rafId = requestAnimationFrame(updateTransform);
    }, { passive: true });
  });
}

