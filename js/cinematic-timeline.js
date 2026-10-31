/**
 * YASH — CINEMATIC TIMELINE CONTROLLER
 * GSAP 3 & ScrollTrigger Deterministic Timeline Sequencing
 * Forward & Reverse Scroll Scrubbing across 7 Cinematic Scenes
 */

export class CinematicTimelineController {
  constructor(webglScene) {
    this.webglScene = webglScene;
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.currentChapter = 1;
    this.totalChapters = 7;

    this.initTimeline();
    this.initChapterHUD();
    this.initDirectNavigation();
  }

  initTimeline() {
    if (this.isReducedMotion) {
      // In reduced motion, skip scrub locks and show static layout
      document.body.classList.add('reduced-motion-mode');
      return;
    }

    const { gsap } = window;
    if (!gsap || !window.ScrollTrigger) {
      console.warn('GSAP or ScrollTrigger not loaded, falling back to static layout.');
      return;
    }

    gsap.registerPlugin(window.ScrollTrigger);

    // Initialize Lenis smooth scroll if available
    if (window.Lenis) {
      try {
        const lenis = new window.Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1,
          touchMultiplier: 1.5
        });

        lenis.on('scroll', window.ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
        this.lenis = lenis;
      } catch (err) {
        console.warn('Lenis initialization skipped:', err);
      }
    }

    // Master Timeline Scrubbing
    const masterTrigger = window.ScrollTrigger.create({
      trigger: '#film-wrapper',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      onUpdate: (self) => {
        const p = self.progress;
        if (this.webglScene) {
          this.webglScene.setScrollProgress(p);
        }
        this.updateHUD(p);
      }
    });

    // =========================================================================
    // SCENE 01: CINEMATIC OPENING (0.00 -> 0.14)
    // =========================================================================
    const s1Tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#scene-01',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: '#scene-01-inner',
        anticipatePin: 1
      }
    });

    s1Tl.to('#hero-monogram', {
      scale: 3.2,
      opacity: 0,
      z: 500,
      ease: 'power2.inOut'
    }, 0)
    .to('#hero-title-group', {
      y: -80,
      opacity: 0,
      ease: 'power2.in'
    }, 0)
    .to('#hero-scroll-cue', {
      opacity: 0,
      y: 40,
      ease: 'power1.out'
    }, 0);

    // =========================================================================
    // SCENE 02: IDENTITY TRANSFORMATION (0.14 -> 0.28)
    // =========================================================================
    const s2Tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#scene-02',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: '#scene-02-inner',
        anticipatePin: 1
      }
    });

    s2Tl.fromTo('#scene-02-headline', 
      { opacity: 0, y: 60, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, ease: 'power2.out', duration: 1 }
    )
    .fromTo('.identity-tenet', 
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, stagger: 0.4, ease: 'power2.out', duration: 1.5 },
      "-=0.5"
    )
    .fromTo('#identity-stats-row',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, ease: 'power2.out', duration: 1 },
      "-=0.5"
    );

    // =========================================================================
    // SCENE 03: CAPABILITIES AS MOTION GRAPHICS (0.28 -> 0.44)
    // =========================================================================
    const s3Tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#scene-03',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: '#scene-03-inner',
        anticipatePin: 1
      }
    });

    s3Tl.fromTo('#scene-03-title',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8 }
    )
    .fromTo('.capability-card',
      { opacity: 0, y: 60, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.5, ease: 'power2.out', duration: 2 },
      "-=0.3"
    )
    .fromTo('.circuit-trace-path',
      { strokeDashoffset: 1000 },
      { strokeDashoffset: 0, ease: 'none', duration: 1.5 },
      "-=1.5"
    );

    // =========================================================================
    // SCENE 04: PROJECTS AS CINEMATIC REVEALS (0.44 -> 0.76)
    // Horizontal Scrub Through 5 Flagship Systems
    // =========================================================================
    const projectTrack = document.getElementById('projects-cinematic-track');
    const projectCount = 5;
    
    if (projectTrack) {
      const s4Tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#scene-04',
          start: 'top top',
          end: `+=${projectCount * 120}%`,
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });

      // Horizontal transform across project slides
      s4Tl.to(projectTrack, {
        xPercent: - (100 / projectCount) * (projectCount - 1),
        ease: 'none'
      });

      // Synchronized depth and tilt per project slide
      document.querySelectorAll('.cinematic-project-slide').forEach((slide, idx) => {
        const media = slide.querySelector('.slide-media');
        const telemetry = slide.querySelector('.slide-telemetry');
        
        if (media && telemetry) {
          s4Tl.fromTo(media, 
            { scale: 0.9, rotateY: 8, opacity: 0.8 },
            { scale: 1.02, rotateY: 0, opacity: 1, ease: 'power1.out', duration: 0.5 },
            (idx / projectCount)
          );
        }
      });
    }

    // =========================================================================
    // SCENE 05: ENGINEERING DEPTH & SYSTEM FLOW (0.76 -> 0.86)
    // =========================================================================
    const s5Tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#scene-05',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: '#scene-05-inner',
        anticipatePin: 1
      }
    });

    s5Tl.fromTo('#system-flow-title', 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8 }
    )
    .fromTo('.pipeline-step',
      { opacity: 0.25, filter: 'grayscale(1)', scale: 0.95 },
      { opacity: 1, filter: 'grayscale(0)', scale: 1, stagger: 0.6, ease: 'power2.out', duration: 2 }
    )
    .fromTo('#pipeline-beam',
      { scaleX: 0 },
      { scaleX: 1, ease: 'none', duration: 2 },
      "-=2"
    );

    // =========================================================================
    // SCENE 06: METHODOLOGY & VERIFIED EVIDENCE (0.86 -> 0.94)
    // =========================================================================
    const s6Tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#scene-06',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: '#scene-06-inner',
        anticipatePin: 1
      }
    });

    s6Tl.fromTo('#scene-06-title', 
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8 }
    )
    .fromTo('.process-step-cinematic',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, stagger: 0.4, ease: 'power2.out', duration: 1.6 },
      "-=0.4"
    )
    .fromTo('.testimonial-marquee-card',
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, stagger: 0.3, ease: 'power2.out', duration: 1 },
      "-=0.8"
    );

    // =========================================================================
    // SCENE 07: CONTACT & FINALE (0.94 -> 1.00)
    // =========================================================================
    const s7Tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#scene-07',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        pin: '#scene-07-inner',
        anticipatePin: 1
      }
    });

    s7Tl.fromTo('#finale-glow',
      { scale: 0.5, opacity: 0 },
      { scale: 1.2, opacity: 0.35, duration: 1 }
    )
    .fromTo('#finale-headline',
      { opacity: 0, y: 60, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, ease: 'power2.out', duration: 1 },
      "-=0.6"
    )
    .fromTo('#finale-card',
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, ease: 'power2.out', duration: 0.8 },
      "-=0.4"
    );
  }

  /**
   * Chapter HUD updates with timecode & chapter names
   */
  initChapterHUD() {
    this.hudChapter = document.getElementById('hud-chapter-indicator');
    this.hudTimecode = document.getElementById('hud-timecode');
    this.hudProgressBar = document.getElementById('hud-timeline-progress');
  }

  updateHUD(progress) {
    // 7 chapters mapped across [0, 1]
    const chapterIndex = Math.min(7, Math.floor(progress * 7) + 1);
    const chapterNames = [
      'OPENING / PROLOGUE',
      'IDENTITY / PHILOSOPHY',
      'CAPABILITIES / NEXUS',
      'PROJECTS / CINEMATIC',
      'ENGINEERING / PIPELINE',
      'METHODOLOGY / EVIDENCE',
      'FINALE / CONTACT'
    ];

    if (this.hudChapter) {
      this.hudChapter.textContent = `CH. 0${chapterIndex} — ${chapterNames[chapterIndex - 1]}`;
    }

    if (this.hudTimecode) {
      const totalSeconds = 60; // 1-minute scrub timeline feel
      const elapsedSeconds = Math.floor(progress * totalSeconds);
      const mm = '00';
      const ss = String(elapsedSeconds).padStart(2, '0');
      this.hudTimecode.textContent = `${mm}:${ss} / 01:00`;
    }

    if (this.hudProgressBar) {
      this.hudProgressBar.style.transform = `scaleX(${progress})`;
    }
  }

  /**
   * Direct chapter navigation
   */
  initDirectNavigation() {
    document.querySelectorAll('.chapter-nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
}
