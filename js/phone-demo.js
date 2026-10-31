/**
 * YASH PORTFOLIO — SCROLL-DRIVEN PHONE PRODUCT DEMO ENGINE
 * =========================================================================
 * Transforms static portfolio mockups into interactive, scroll-driven
 * smartphone demonstrations displaying authentic Android emulator captures
 * of live compiled projects (YAAN, ExamPrepOS, DRIFTBOUND).
 *
 * Architecture:
 *   - Flagship Smartphone Chassis with authentic bezel, camera punch, speaker
 *   - Stacked emulator screen layers inside phone with smooth cross-fade
 *   - GSAP ScrollTrigger synchronizing editorial panels with phone screen states
 *   - Dual Mode: Presentation (scroll-driven) | Explore (interactive 1080x2400 scroll)
 *   - Quick-select screen pill navigation below phone
 *   - Damped 3D pointer parallax tilt on desktop
 *   - Intersection Observer for lazy execution & viewport pause
 *   - prefers-reduced-motion fully honored
 * =========================================================================
 */

const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function safeScrollTo(element, offset = 0) {
  if (!element) return;
  // If element is already nicely visible in viewport, avoid jarring scroll jump
  const rect = element.getBoundingClientRect();
  const isVisible = rect.top >= 50 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) - 50;
  if (isVisible) return;

  if (window.__lenis && typeof window.__lenis.scrollTo === 'function') {
    try {
      window.__lenis.scrollTo(element, { offset, immediate: false, lock: false });
      return;
    } catch (_) {}
  }
  try {
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (_) {
    element.scrollIntoView();
  }
}

/**
 * Register GSAP plugins once (idempotent)
 */
function ensureGSAP() {
  if (!window.gsap || !window.ScrollTrigger) {
    console.warn('[PhoneDemo] GSAP or ScrollTrigger not available. Static fallback active.');
    return false;
  }
  window.gsap.registerPlugin(window.ScrollTrigger);
  return true;
}

/* =========================================================================
   STATUS BAR & HARDWARE AFFORDANCES
   ========================================================================= */

const STATUS_ICONS = `
  <svg width="12" height="8" viewBox="0 0 12 8" fill="currentColor" opacity="0.85">
    <rect x="0" y="2" width="2" height="6" rx="0.5"/>
    <rect x="3" y="1" width="2" height="7" rx="0.5"/>
    <rect x="6" y="0" width="2" height="8" rx="0.5"/>
    <rect x="9" y="0" width="3" height="8" rx="0.5" opacity="0.3"/>
  </svg>
  <span class="phone-status-network">5G</span>
  <svg width="18" height="9" viewBox="0 0 18 9" fill="none" opacity="0.85">
    <rect x="0" y="1" width="15" height="7" rx="1.5" stroke="currentColor" stroke-width="1"/>
    <rect x="15.5" y="3" width="2" height="3" rx="1" fill="currentColor" opacity="0.5"/>
    <rect x="1" y="2" width="11" height="5" rx="0.8" fill="currentColor"/>
  </svg>
`;

function statusBar(time = '09:41') {
  return `
    <div class="phone-status-bar" aria-hidden="true">
      <span class="phone-status-time">${time}</span>
      <div class="phone-status-icons">${STATUS_ICONS}</div>
    </div>
  `;
}

/* =========================================================================
   DRIFTBOUND SCREEN BUILDERS (Real-time 3D Graphics Simulation)
   ========================================================================= */

function buildDriftStartScreen() {
  return `
    <div class="drift-screen screen-body" style="padding:0;height:100%;">
      ${statusBar('10:09')}
      <div class="drift-game-view">
        <div class="drift-game-bg">
          <div class="drift-sky-glow"></div>
          <div class="drift-mountains"></div>
          <div class="drift-road"></div>
          <div class="drift-road-center"></div>
          <div class="drift-car">
            <div class="drift-car-body"></div>
          </div>
        </div>
        <div class="drift-hud">
          <div class="drift-hud-top">
            <div class="drift-game-title">DRIFTBOUND</div>
            <div class="drift-player-id">SIM_PILOT_01</div>
          </div>
          <div class="drift-hud-bottom">
            <div class="drift-score">SCORE: 0</div>
            <div style="text-align:right;">
              <div class="drift-speed" style="color:rgba(244,246,244,0.5);">0</div>
              <div class="drift-speed-unit">KM/H</div>
            </div>
          </div>
        </div>
      </div>
      <div class="drift-telemetry">
        <div class="drift-tel-row">
          <div class="drift-tel-label">RPM</div>
          <div class="drift-tel-bar-wrap"><div class="drift-tel-bar rpm-bar" style="width:12%;"></div></div>
          <div class="drift-tel-value">1.2K</div>
        </div>
        <div class="drift-tel-row">
          <div class="drift-tel-label">GRIP</div>
          <div class="drift-tel-bar-wrap"><div class="drift-tel-bar grip-bar" style="width:95%;"></div></div>
          <div class="drift-tel-value">MAX</div>
        </div>
      </div>
      <div class="drift-gc-badge">
        <div class="drift-gc-dot"></div>
        GC ALLOC: 0 B / FRAME · 60 FPS
      </div>
    </div>
  `;
}

function buildDriftActiveScreen() {
  return `
    <div class="drift-screen screen-body" style="padding:0;height:100%;">
      ${statusBar('10:09')}
      <div class="drift-game-view">
        <div class="drift-game-bg">
          <div class="drift-sky-glow"></div>
          <div class="drift-mountains"></div>
          <div class="drift-road" style="transform:translateX(-35%) rotate(-8deg);"></div>
          <div class="drift-road-center"></div>
          <div class="drift-car" style="transform:translateX(-40%) rotate(-14deg);">
            <div class="drift-car-body" style="box-shadow: 0 0 14px rgba(255,50,50,0.7);"></div>
          </div>
          <div class="drift-smoke">
            <div class="drift-smoke-puff" style="width:10px;height:10px;"></div>
            <div class="drift-smoke-puff" style="width:8px;height:8px;opacity:0.7;"></div>
            <div class="drift-smoke-puff" style="opacity:0.4;"></div>
          </div>
        </div>
        <div class="drift-hud">
          <div class="drift-hud-top">
            <div class="drift-game-title">DRIFTBOUND</div>
            <div class="drift-player-id">SIM_PILOT_01</div>
          </div>
          <div class="drift-hud-bottom">
            <div>
              <div class="drift-score">SCORE: 34,250</div>
              <div class="drift-drift-indicator">DRIFTING</div>
            </div>
            <div class="drift-speed-block">
              <div class="drift-speed">148</div>
              <div class="drift-speed-unit">KM/H</div>
              <div class="drift-gear">4TH</div>
            </div>
          </div>
        </div>
      </div>
      <div class="drift-telemetry">
        <div class="drift-tel-row">
          <div class="drift-tel-label">RPM</div>
          <div class="drift-tel-bar-wrap"><div class="drift-tel-bar rpm-bar" style="width:82%;"></div></div>
          <div class="drift-tel-value">7.8K</div>
        </div>
        <div class="drift-tel-row">
          <div class="drift-tel-label">GRIP</div>
          <div class="drift-tel-bar-wrap"><div class="drift-tel-bar grip-bar" style="width:28%;"></div></div>
          <div class="drift-tel-value">28%</div>
        </div>
      </div>
      <div class="drift-gc-badge">
        <div class="drift-gc-dot"></div>
        GC ALLOC: 0 B / FRAME · 60 FPS
      </div>
    </div>
  `;
}

function buildDriftTelemetryScreen() {
  return `
    <div class="drift-screen screen-body" style="padding:0;height:100%;">
      ${statusBar('10:09')}
      <div style="padding:0.75rem 0.75rem 0.25rem;">
        <div style="font-size:0.625rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(56,189,248,0.7);margin-bottom:0.4rem;">FRAME TELEMETRY</div>
        <div style="font-size:1rem;font-weight:700;color:#F4F6F4;font-family:'JetBrains Mono',monospace;">Unity 6 LTS — URP</div>
      </div>
      <div class="drift-telemetry">
        <div class="drift-tel-row">
          <div class="drift-tel-label">TARGET</div>
          <div class="drift-tel-bar-wrap"><div class="drift-tel-bar rpm-bar" style="width:100%;"></div></div>
          <div class="drift-tel-value">60fps</div>
        </div>
        <div class="drift-tel-row">
          <div class="drift-tel-label">ACTUAL</div>
          <div class="drift-tel-bar-wrap"><div class="drift-tel-bar rpm-bar" style="width:98%;"></div></div>
          <div class="drift-tel-value">59fps</div>
        </div>
        <div class="drift-tel-row">
          <div class="drift-tel-label">FRAME</div>
          <div class="drift-tel-bar-wrap"><div class="drift-tel-bar grip-bar" style="width:25%;background:linear-gradient(90deg,#5EB38A,#5EB38A);"></div></div>
          <div class="drift-tel-value">7.8ms</div>
        </div>
        <div class="drift-tel-row">
          <div class="drift-tel-label">GC</div>
          <div class="drift-tel-bar-wrap"><div class="drift-tel-bar" style="width:0%;"></div></div>
          <div class="drift-tel-value" style="color:#5EB38A;">0 B</div>
        </div>
      </div>
      <div style="padding:0.5rem 0.75rem;display:flex;flex-direction:column;gap:0.3rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.35rem 0.5rem;background:rgba(255,255,255,0.03);border-radius:6px;border:1px solid rgba(255,255,255,0.06);">
          <span style="font-size:0.625rem;color:rgba(244,246,244,0.4);letter-spacing:0.1em;text-transform:uppercase;">GRAPHICS API</span>
          <span style="font-size:0.6875rem;font-weight:600;color:#38bdf8;font-family:'JetBrains Mono',monospace;">Vulkan / Metal</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.35rem 0.5rem;background:rgba(255,255,255,0.03);border-radius:6px;border:1px solid rgba(255,255,255,0.06);">
          <span style="font-size:0.625rem;color:rgba(244,246,244,0.4);letter-spacing:0.1em;text-transform:uppercase;">PHYSICS SIM</span>
          <span style="font-size:0.6875rem;font-weight:600;color:#F4F6F4;font-family:'JetBrains Mono',monospace;">60Hz Fixed Step</span>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.35rem 0.5rem;background:rgba(255,255,255,0.03);border-radius:6px;border:1px solid rgba(255,255,255,0.06);">
          <span style="font-size:0.625rem;color:rgba(244,246,244,0.4);letter-spacing:0.1em;text-transform:uppercase;">DRAW CALLS</span>
          <span style="font-size:0.6875rem;font-weight:600;color:#F4F6F4;font-family:'JetBrains Mono',monospace;">142 / frame</span>
        </div>
      </div>
      <div class="drift-gc-badge">
        <div class="drift-gc-dot"></div>
        VERIFIED: 0 B / FRAME ALLOCATION
      </div>
    </div>
  `;
}

/* =========================================================================
   PROJECT DEMO CONFIGURATIONS — Real Emulator Captures & Screens
   ========================================================================= */

const DEMO_CONFIGS = {

  yaan: {
    glowClass: 'glow-green',
    eyebrowClass: '',
    deviceHardwareLabel: 'PIXEL 6 · ANDROID 14 · KMP',
    panels: [
      {
        id: 'yaan-panel-1',
        featureName: 'Daily Briefing & Conflict Detection',
        featureDesc: 'Autonomous agenda triage running on-device. Identifies Google Calendar meeting collisions, resolves commitments, and presents unified daily priorities with zero cloud dependencies.',
        specs: ['< 150ms Triage', 'Calendar Grounding', 'Conflict Resolution', '0ms Latency'],
        deviceBadge: 'LIVE EMULATOR · YAAN',
        imgSrc: 'assets/emulator/yaan-daily-briefing.png',
        altText: 'YAAN Sovereign Mobile OS — Live Daily Briefing Screen captured on Android Emulator',
      },
      {
        id: 'yaan-panel-2',
        featureName: 'Ask YAAN Executive Intelligence',
        featureDesc: 'Autonomous action proposal engine. Formulates structured calendar rescheduling proposals via local neural inference, held behind an affirmative user confirmation gate.',
        specs: ['0ms Local Inference', 'Affirmative User Gate', 'Action Proposal', 'Local Enclave'],
        deviceBadge: '0ms INFERENCE · LOCAL VAULT',
        imgSrc: 'assets/emulator/yaan-ask-intelligence.png',
        altText: 'YAAN Executive Intelligence Screen captured on Android Emulator',
      },
      {
        id: 'yaan-panel-3',
        featureName: 'Zero-Knowledge Core & Local Vault',
        featureDesc: '100% offline hardware-backed encryption with AES-GCM-256 keys held in Android KeyStore. DPDP Act 2023 & COPPA compliant local profile isolation.',
        specs: ['AES-GCM-256', 'DPDP Act 2023', 'Offline Keychain', 'Zero Telemetry'],
        deviceBadge: 'AES-GCM-256 · HARDWARE ENCLAVE',
        imgSrc: 'assets/emulator/yaan-vault-setup.png',
        altText: 'YAAN Zero-Knowledge Local Vault screen captured on Android Emulator',
      },
      {
        id: 'yaan-panel-4',
        featureName: 'Sovereign Neural Onboarding',
        featureDesc: 'Zero-knowledge onboarding flow establishing local cryptographic identity, zero tracker beacons, and localized neural engine verification without cloud roundtrips.',
        specs: ['Zero-Knowledge', 'On-Device Neural Engine', 'No Cloud Auth', 'Compose Multiplatform'],
        deviceBadge: 'ZERO-KNOWLEDGE CORE',
        imgSrc: 'assets/emulator/yaan-onboarding.png',
        altText: 'YAAN Sovereign Identity Onboarding captured on Android Emulator',
      },
    ],
  },

  examprep: {
    glowClass: 'glow-red',
    eyebrowClass: 'eyebrow-red',
    deviceHardwareLabel: 'PIXEL 6 · ANDROID 14 · OLED',
    panels: [
      {
        id: 'exam-panel-1',
        featureName: 'Aspirant Home & Spaced Repetition',
        featureDesc: 'Distraction-free OLED dashboard displaying exam countdown (89 days to SSC CGL), active streak, and SuperMemo SM-2 spaced repetition queue with instant recall gating.',
        specs: ['120 FPS / 8ms Pacing', 'SuperMemo SM-2', 'Distraction-Free OLED', 'Room SQLite'],
        deviceBadge: 'LIVE EMULATOR · EXAMPREP',
        imgSrc: 'assets/emulator/examprep-dashboard.png',
        altText: 'ExamPrepOS Aspirant Home Dashboard captured on Android Emulator',
      },
      {
        id: 'exam-panel-2',
        featureName: 'Syllabus Mastery & Statistical Gating',
        featureDesc: 'Quantitative mastery model enforcing a strict 5-attempt minimum sample size per topic before granting proficiency confidence, eliminating false positive readiness.',
        specs: ['Statistical Gating', '5-Attempt Threshold', 'Arithmetic & Commerce', 'Zero Jitter'],
        deviceBadge: 'STATISTICAL GATING · 120 FPS',
        imgSrc: 'assets/emulator/examprep-practice.png',
        altText: 'ExamPrepOS Syllabus and Topic Mastery captured on Android Emulator',
      },
      {
        id: 'exam-panel-3',
        featureName: 'Mistake Vault & Error Remediation',
        featureDesc: 'Offline SQLite error database classifying mistakes into Conceptual Gap, Formula Confusion, or Careless Calculation with targeted spaced remediation loops.',
        specs: ['Offline Room DB', 'Taxonomy Classification', '25% Error Resolution', 'Auto-Reschedule'],
        deviceBadge: 'ROOM SQLITE · OFFLINE-FIRST',
        imgSrc: 'assets/emulator/examprep-vault.png',
        altText: 'ExamPrepOS Mistake Vault captured on Android Emulator',
      },
      {
        id: 'exam-panel-4',
        featureName: 'Pre-Flight Mock Test Calibration',
        featureDesc: 'Full-screen examination lockdown with automated DND/Airplane Mode detection, timer calibration, and simulated high-stakes test environment.',
        specs: ['Strict Lockdown', 'Distraction Blocker', 'Exam Simulation', 'Hardware Intent'],
        deviceBadge: 'DND HARDWARE LOCKDOWN',
        imgSrc: 'assets/emulator/examprep-preflight-mock.png',
        altText: 'ExamPrepOS Pre-Flight Mock Test Calibration captured on Android Emulator',
      },
      {
        id: 'exam-panel-5',
        featureName: 'Examination Performance Report',
        featureDesc: 'Post-test analytics engine powered by BFPRT Median-of-Medians percentile calculation, subject breakdown, and AI Rank Accelerator recommendations.',
        specs: ['BFPRT Algorithm', 'Percentile Ranking', 'Micro-Practice Engine', 'Zero Latency'],
        deviceBadge: 'ALGORITHMIC ASSESSMENT',
        imgSrc: 'assets/emulator/examprep-assessment.png',
        altText: 'ExamPrepOS Examination Performance Report captured on Android Emulator',
      },
    ],
  },

  driftbound: {
    glowClass: 'glow-cyan',
    eyebrowClass: 'eyebrow-cyan',
    deviceHardwareLabel: 'UNITY 6 LTS · VULKAN · METAL',
    panels: [
      {
        id: 'drift-panel-1',
        featureName: 'Race Start & Simulation Loop',
        featureDesc: 'Stylized 3D open-world mobile street racing in Unity 6 LTS. Zero-allocation simulation loop initialized with fixed 60Hz physics timestep.',
        specs: ['Unity 6 LTS URP', '0 B/frame GC Churn', '60Hz Fixed Step', 'Vulkan / Metal'],
        deviceBadge: 'UNITY 6 LTS · VULKAN',
        screen: buildDriftStartScreen,
      },
      {
        id: 'drift-panel-2',
        featureName: '148 KM/H Active Drift Mechanics',
        featureDesc: 'Real-time physics calculation of slip angles, tire friction coefficients, and drift scores with zero garbage collection allocations per frame.',
        specs: ['Slip Angle Physics', 'Dynamic Tire Smoke', 'Vulkan Render Target', '148 KM/H'],
        deviceBadge: '60 FPS NATIVE · ZERO GC',
        screen: buildDriftActiveScreen,
      },
      {
        id: 'drift-panel-3',
        featureName: 'Physics Telemetry & GPU Profiler',
        featureDesc: 'Deep hardware profiler telemetry confirming 7.8ms frame time (well within 16.6ms 60 FPS budget), 142 draw calls, and zero GC allocation spikes.',
        specs: ['7.8ms Frame Budget', '142 Draw Calls', 'Memory Stability', 'Zero GC Pause'],
        deviceBadge: 'GPU PROFILER TELEMETRY',
        screen: buildDriftTelemetryScreen,
      },
    ],
  },

};

/* =========================================================================
   DOM BUILDER — Flagship Smartphone Chassis + Stacked Real Screens
   ========================================================================= */

function buildPinnedSmartphone(projectKey, config) {
  const screensHTML = config.panels.map((panel, idx) => {
    const isActive = idx === 0 ? 'active' : '';
    let innerContent = '';
    if (panel.imgSrc) {
      innerContent = `
        <div class="phone-screen-scroll-wrap" tabindex="0" role="region" aria-label="${panel.altText} — scrollable emulator screen">
          <img
            src="${panel.imgSrc}"
            alt="${panel.altText}"
            class="phone-screen-img"
            loading="lazy"
            decoding="async"
            width="1080"
            height="2400"
          >
        </div>
      `;
    } else if (panel.screen) {
      innerContent = `
        <div class="phone-screen-dom-wrap">
          ${panel.screen()}
        </div>
      `;
    }

    return `
      <div class="phone-screen-layer ${isActive}" data-screen-index="${idx}" id="phone-screen-${projectKey}-${idx}">
        ${innerContent}
      </div>
    `;
  }).join('');

  const quickPillsHTML = config.panels.map((panel, idx) => `
    <button
      type="button"
      class="phone-quick-pill ${idx === 0 ? 'active' : ''}"
      data-project="${projectKey}"
      data-screen-index="${idx}"
      title="${panel.featureName}"
      aria-label="View ${panel.featureName} on phone"
    >
      <span class="phone-pill-dot"></span>
      <span class="phone-pill-num">0${idx + 1}</span>
    </button>
  `).join('');

  return `
    <div class="flagship-phone-chassis" id="phone-chassis-${projectKey}">
      <!-- Device Hardware Affordances -->
      <div class="phone-speaker-earpiece" aria-hidden="true"></div>
      <div class="phone-camera-punch" aria-hidden="true"></div>
      <div class="phone-glare-overlay" aria-hidden="true"></div>
      
      <!-- Live Emulator Status Strip -->
      <div class="phone-live-pill" id="phone-live-pill-${projectKey}" aria-hidden="true">
        <span class="phone-live-dot"></span>
        <span class="phone-live-text">${config.panels[0].deviceBadge || 'LIVE EMULATOR · ANDROID 14'}</span>
      </div>

      <!-- Phone Display Viewport (Authentic 1080x2400 Screen Area) -->
      <div class="phone-display-viewport" id="phone-display-${projectKey}">
        ${projectKey === 'driftbound' ? statusBar('10:09') : ''}

        <!-- The stacked screen layers -->
        <div class="phone-screens-deck">
          ${screensHTML}
        </div>

        ${projectKey === 'driftbound' ? '<div class="phone-home-indicator" aria-hidden="true"></div>' : ''}
      </div>

      <!-- Interactive Scroll Prompt (Visible in Explore Mode) -->
      <div class="phone-explore-prompt" id="phone-explore-prompt-${projectKey}" aria-hidden="true">
        <span>↕ Scroll screen to inspect</span>
      </div>
    </div>

    <!-- Phone Controls Under Chassis -->
    <div class="phone-controls-row">
      <div class="phone-quick-pills" role="tablist" aria-label="Select screen to display on phone">
        ${quickPillsHTML}
      </div>
      <div class="demo-mode-toggle" role="group" aria-label="Demo interaction mode">
        <button
          type="button"
          class="demo-mode-btn active"
          data-mode="presentation"
          data-project="${projectKey}"
          aria-pressed="true"
        >Presentation</button>
        <button
          type="button"
          class="demo-mode-btn"
          data-mode="explore"
          data-project="${projectKey}"
          aria-pressed="false"
        >Explore</button>
      </div>
    </div>
  `;
}

/**
 * Build the HTML for a full demo stage (phone left, editorial panels right)
 */
function buildDemoStageHTML(projectKey, projectMeta) {
  const config = DEMO_CONFIGS[projectKey];
  if (!config) return '';

  const smartphoneHTML = buildPinnedSmartphone(projectKey, config);

  const panelsHTML = config.panels.map((panel, idx) => {
    const specsHTML = (panel.specs || []).map(s => `<span class="demo-panel-spec-chip">${s}</span>`).join('');
    
    return `
    <div class="demo-panel" id="${panel.id}" data-panel-index="${idx}" data-project="${projectKey}">
      <div class="demo-panel-card">
        <div class="demo-panel-header">
          <div class="demo-feature-step" data-step="${idx + 1}">0${idx + 1}</div>
          <div class="demo-panel-status-pill ${idx === 0 ? 'active' : ''}" id="status-pill-${projectKey}-${idx}">
            <span class="status-dot"></span>
            <span class="status-text">${idx === 0 ? 'ON PHONE SCREEN' : 'STEP 0' + (idx + 1)}</span>
          </div>
        </div>
        
        <h3 class="demo-feature-name">${panel.featureName}</h3>
        <p class="demo-feature-desc">${panel.featureDesc}</p>
        
        <div class="demo-panel-specs">
          ${specsHTML}
        </div>

        <!-- Mobile Phone Dock Slot: docks phone directly inside the active card on mobile/tablet -->
        <div class="demo-mobile-dock-slot" data-slot-index="${idx}"></div>

        <div class="demo-panel-actions">
          <button
            type="button"
            class="demo-view-on-phone-btn ${idx === 0 ? 'active' : ''}"
            data-project="${projectKey}"
            data-screen-index="${idx}"
            aria-label="Display ${panel.featureName} on phone"
          >
            <span class="action-icon">📱</span>
            <span>View on Phone Screen</span>
          </button>
          <span class="demo-panel-hint">1080 × 2400 · Native Pixel 6 capture</span>
        </div>
      </div>
    </div>
  `;
  }).join('');

  const ctasHTML = projectMeta.ctas.map(cta => {
    if (cta.type === 'primary') {
      return `<button class="btn-apple-primary" type="button" onclick="${cta.action}">${cta.label}</button>`;
    }
    return `
      <a class="btn-apple-link" href="${cta.href}" target="${cta.external ? '_blank' : '_self'}" rel="${cta.external ? 'noopener noreferrer' : ''}">
        <span>${cta.label}</span>
        <span class="chevron" aria-hidden="true">›</span>
      </a>
    `;
  }).join('');

  return `
    <div class="demo-stage" id="demo-stage-${projectKey}" data-project="${projectKey}">

      <!-- ── LEFT: Pinned Smartphone with Real Emulator Screens ── -->
      <div class="demo-phone-col">
        <div class="demo-phone-dock" id="demo-phone-dock-${projectKey}">
          <div class="demo-phone-stage" id="demo-phone-stage-${projectKey}">
            <div class="demo-phone-glow ${config.glowClass}"></div>
            <div class="demo-phone-device" id="demo-phone-device-${projectKey}">
              ${smartphoneHTML}
            </div>
          </div>
          <div class="demo-phone-label">${config.deviceHardwareLabel || projectMeta.deviceLabel}</div>
          <div class="demo-progress-bar" aria-hidden="true">
            <div class="demo-progress-fill" id="demo-progress-${projectKey}"></div>
          </div>
        </div>
      </div>

      <!-- ── RIGHT: Scrolling Editorial Narrative Column ── -->
      <div class="demo-panels-col">
        <div class="demo-project-header" id="demo-header-${projectKey}">
          <div class="demo-project-eyebrow ${config.eyebrowClass}">${projectMeta.eyebrow}</div>
          <h2 class="demo-project-title">${projectMeta.title}</h2>
          <p class="demo-project-desc">${projectMeta.desc}</p>
          <div class="demo-project-ctas">${ctasHTML}</div>
        </div>

        ${panelsHTML}
      </div>
    </div>
  `;
}

/* =========================================================================
   SCROLL ANIMATION CONTROLLER
   ========================================================================= */

class PhoneDemoController {
  constructor(projectKey) {
    this.projectKey = projectKey;
    this.stage = document.getElementById(`demo-stage-${projectKey}`);
    this.triggers = [];
    this.mode = 'presentation'; // 'presentation' | 'explore'
    this.activeScreenIndex = 0;

    if (!this.stage) return;

    this.phoneDock = document.getElementById(`demo-phone-dock-${projectKey}`);
    this.phoneCol = this.stage.querySelector('.demo-phone-col');
    this.phoneDevice = document.getElementById(`demo-phone-device-${projectKey}`);
    this.phoneStage = document.getElementById(`demo-phone-stage-${projectKey}`);
    this.phoneChassis = document.getElementById(`phone-chassis-${projectKey}`);
    this.progressFill = document.getElementById(`demo-progress-${projectKey}`);
    this.liveBadge = document.getElementById(`phone-live-pill-${projectKey}`);
    this.panels = Array.from(this.stage.querySelectorAll('.demo-panel'));
    this.header = document.getElementById(`demo-header-${projectKey}`);
    this.screenLayers = Array.from(this.stage.querySelectorAll('.phone-screen-layer'));
    this.quickPills = Array.from(this.stage.querySelectorAll(`.phone-quick-pill[data-project="${projectKey}"]`));
    this.viewButtons = Array.from(this.stage.querySelectorAll(`.demo-view-on-phone-btn[data-project="${projectKey}"]`));

    this._initModeToggle();
    this._initQuickPills();
    this._initViewButtons();
    this._initTiltParallax();

    // Initial dock alignment beside card 0
    setTimeout(() => {
      this._dockForViewport(0, false);
    }, 60);

    window.addEventListener('resize', () => {
      this._dockForViewport(this.activeScreenIndex, false);
    }, { passive: true });

    if (REDUCED_MOTION) {
      this._showAllPanelsStatic();
      return;
    }

    if (!ensureGSAP()) {
      this._showAllPanelsStatic();
      return;
    }

    this._initScrollAnimations();
  }

  /**
   * Dock the phone either directly inside the card (mobile) or floating beside the card (desktop)
   */
  _dockForViewport(idx, isUserTap = false) {
    if (!this.phoneDock) return;
    const isMobile = window.innerWidth <= 960;

    if (isMobile) {
      // Mobile: Dock directly inside the particular information card that was clicked / is active
      const activePanel = this.panels[idx];
      const slot = activePanel?.querySelector('.demo-mobile-dock-slot');
      if (slot && this.phoneDock.parentElement !== slot) {
        slot.appendChild(this.phoneDock);
        this.phoneDock.style.transform = 'none';
        if (window.gsap) window.gsap.set(this.phoneDock, { y: 0 });
      }
    } else {
      // Desktop: Keep phoneDock in left column and glide to align with active card
      if (this.phoneCol && this.phoneDock.parentElement !== this.phoneCol) {
        this.phoneCol.appendChild(this.phoneDock);
      }
      this._glideToPanel(idx, isUserTap);
    }
  }

  /**
   * Desktop: Smoothly glide phone vertically to align directly beside the active card
   */
  _glideToPanel(idx, isUserTap = false) {
    if (!this.phoneDock || !this.stage) return;
    const panel = this.panels[idx];
    if (!panel) return;

    const panelCard = panel.querySelector('.demo-panel-card') || panel;

    // Decouple DOM geometry measurement from scroll tick to prevent layout thrashing
    requestAnimationFrame(() => {
      const stageRect = this.stage.getBoundingClientRect();
      const cardRect = panelCard.getBoundingClientRect();

      // Vertical center of the target card within the stage coordinate system
      const cardCenterStageY = (cardRect.top - stageRect.top) + (cardRect.height / 2);
      const dockHeight = this.phoneDock.offsetHeight || 600;
      let targetY = cardCenterStageY - (dockHeight / 2);

      // Keep within stage boundaries
      const maxTargetY = Math.max(0, this.stage.offsetHeight - dockHeight);
      targetY = Math.max(0, Math.min(targetY, maxTargetY));

      if (window.gsap) {
        window.gsap.to(this.phoneDock, {
          y: targetY,
          duration: isUserTap ? 0.6 : 0.4,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      } else {
        this.phoneDock.style.transform = `translate3d(0, ${targetY}px, 0)`;
      }
    });
  }

  /**
   * Sets the active screen on the phone chassis
   * @param {number} idx - Screen index
   * @param {boolean} scrollPanel - Whether to scroll the matching panel into view
   * @param {boolean} isUserTap - Whether triggered by explicit user interaction
   */
  setPhoneScreen(idx, scrollPanel = false, isUserTap = false) {
    const config = DEMO_CONFIGS[this.projectKey];
    if (!config || idx < 0 || idx >= config.panels.length) return;

    // If already on this screen and it's not a user tap, skip re-render
    if (this.activeScreenIndex === idx && !isUserTap && !scrollPanel) return;

    this.activeScreenIndex = idx;
    const panelMeta = config.panels[idx];

    // Dock the phone to the side of this particular information card
    this._dockForViewport(idx, isUserTap);

    // 1. Cross-fade screen layers and trigger pulse feedback on tap only
    this.screenLayers.forEach((layer, i) => {
      const isActive = i === idx;
      layer.classList.toggle('active', isActive);

      if (isActive) {
        if (isUserTap) {
          layer.classList.remove('pulse-screen');
          requestAnimationFrame(() => {
            layer.classList.add('pulse-screen');
          });
        }

        // Reset scroll position in presentation mode
        if (this.mode === 'presentation') {
          const scrollWrap = layer.querySelector('.phone-screen-scroll-wrap');
          if (scrollWrap) scrollWrap.scrollTop = 0;
        }
      }
    });

    // 2. Update hardware live pill text
    if (this.liveBadge && panelMeta.deviceBadge) {
      const textNode = this.liveBadge.querySelector('.phone-live-text');
      if (textNode) textNode.textContent = panelMeta.deviceBadge;
    }

    // 3. Update quick pills
    this.quickPills.forEach((pill, i) => {
      pill.classList.toggle('active', i === idx);
    });

    // 4. Update right column panel status badges and button text
    this.panels.forEach((p, i) => {
      const statusPill = document.getElementById(`status-pill-${this.projectKey}-${i}`);
      const btn = p.querySelector('.demo-view-on-phone-btn');
      const isCur = i === idx;

      if (statusPill) {
        statusPill.classList.toggle('active', isCur);
        const textSpan = statusPill.querySelector('.status-text');
        if (textSpan) {
          textSpan.textContent = isCur ? 'ON PHONE SCREEN' : `STEP 0${i + 1}`;
        }
      }

      if (btn) {
        btn.classList.toggle('active', isCur);
        btn.innerHTML = isCur
          ? '<span class="action-icon">✓</span><span>Active on Phone</span>'
          : '<span class="action-icon">📱</span><span>View on Phone Screen</span>';
      }
    });

    // 5. Update progress bar
    if (this.progressFill) {
      const pct = ((idx + 1) / config.panels.length) * 100;
      this.progressFill.style.width = `${pct}%`;
    }

    // 6. User Tap feedback: highlight phone chassis and ensure visibility
    if (isUserTap && this.phoneChassis) {
      this._userLockScreen = true;
      if (this._lockTimeout) clearTimeout(this._lockTimeout);
      this._lockTimeout = setTimeout(() => {
        this._userLockScreen = false;
      }, 800);

      this.phoneChassis.classList.remove('pulse-highlight');
      requestAnimationFrame(() => {
        this.phoneChassis?.classList.add('pulse-highlight');
      });
      setTimeout(() => this.phoneChassis?.classList.remove('pulse-highlight'), 1200);

      // Ensure active card is comfortably in view
      if (scrollPanel || isUserTap) {
        const targetCard = this.panels[idx]?.querySelector('.demo-panel-card') || this.panels[idx];
        if (targetCard) {
          safeScrollTo(targetCard, -80);
        }
      }
    }
  }

  /** Show all panels statically for reduced motion */
  _showAllPanelsStatic() {
    if (this.header) this.header.classList.add('visible');
    this.panels.forEach(p => p.classList.add('active'));
  }

  /** GSAP ScrollTrigger synchronization */
  _initScrollAnimations() {
    const { gsap, ScrollTrigger } = window;
    const config = DEMO_CONFIGS[this.projectKey];

    // Header reveal
    if (this.header) {
      const ht = ScrollTrigger.create({
        trigger: this.header,
        start: 'top 85%',
        once: true,
        onEnter: () => this.header.classList.add('visible'),
      });
      this.triggers.push(ht);
    }

    // Reveal each panel & switch the phone screen on the pinned device
    this.panels.forEach((panel, idx) => {
      const t = ScrollTrigger.create({
        trigger: panel,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => {
          panel.classList.add('active');
          if (this.mode === 'presentation' && !this._userLockScreen) this.setPhoneScreen(idx, false);
        },
        onEnterBack: () => {
          panel.classList.add('active');
          if (this.mode === 'presentation' && !this._userLockScreen) this.setPhoneScreen(idx, false);
        },
        onLeave: () => {
          if (this.mode === 'presentation') panel.classList.remove('active');
        },
        onLeaveBack: () => {
          if (this.mode === 'presentation') panel.classList.remove('active');
        },
      });
      this.triggers.push(t);
    });
  }

  /** Desktop mouse tilt parallax */
  _initTiltParallax() {
    if (!this.phoneStage || REDUCED_MOTION || 'ontouchstart' in window) return;

    let rafId = null;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHovered = false;
    let cachedRect = null;

    const update = () => {
      const damp = isHovered ? 0.08 : 0.06;
      const tx = isHovered ? targetX : 0;
      const ty = isHovered ? targetY : 0;

      currentX += (tx - currentX) * damp;
      currentY += (ty - currentY) * damp;

      if (this.phoneDevice) {
        this.phoneDevice.style.transform = `rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg)`;
      }

      const stillMoving = Math.abs(tx - currentX) > 0.02 || Math.abs(ty - currentY) > 0.02;
      if (stillMoving) {
        rafId = requestAnimationFrame(update);
      } else {
        rafId = null;
      }
    };

    const updateRect = () => {
      if (this.phoneStage) {
        cachedRect = this.phoneStage.getBoundingClientRect();
      }
    };

    this.phoneStage.addEventListener('mouseenter', updateRect, { passive: true });

    this.phoneStage.addEventListener('mousemove', (e) => {
      if (this.mode === 'explore') return; // Keep phone steady in Explore mode
      if (!cachedRect) updateRect();
      if (!cachedRect || cachedRect.width === 0 || cachedRect.height === 0) return;

      const x = (e.clientX - cachedRect.left) / cachedRect.width - 0.5;
      const y = (e.clientY - cachedRect.top) / cachedRect.height - 0.5;
      targetY = x * 8;
      targetX = -y * 6;
      isHovered = true;
      if (!rafId) rafId = requestAnimationFrame(update);
    }, { passive: true });

    this.phoneStage.addEventListener('mouseleave', () => {
      isHovered = false;
      cachedRect = null;
      if (!rafId) rafId = requestAnimationFrame(update);
    }, { passive: true });

    this._stopTilt = () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }

  /** Mode toggle: Presentation (scroll-driven) / Explore (interactive screen scroll) */
  _initModeToggle() {
    const btns = this.stage.querySelectorAll(`.demo-mode-btn[data-project="${this.projectKey}"]`);
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const newMode = btn.getAttribute('data-mode');
        if (newMode === this.mode) return;
        this.mode = newMode;

        btns.forEach(b => {
          const isActive = b.getAttribute('data-mode') === newMode;
          b.classList.toggle('active', isActive);
          b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });

        if (this.stage) {
          this.stage.classList.toggle('explore-mode', newMode === 'explore');
        }

        // Reset device transform when entering explore mode
        if (newMode === 'explore' && this.phoneDevice) {
          this.phoneDevice.style.transform = 'none';
        }

        if (newMode === 'explore') {
          // Reveal all panels for convenient browsing
          this.panels.forEach(p => p.classList.add('active'));
        }
      });
    });
  }

  /** Quick screen selector pills */
  _initQuickPills() {
    this.quickPills.forEach(pill => {
      const handlePill = (e) => {
        e.preventDefault();
        const idx = parseInt(pill.getAttribute('data-screen-index'), 10);
        if (!isNaN(idx)) {
          this.setPhoneScreen(idx, true, true);
        }
      };
      pill.addEventListener('click', handlePill);
    });
  }

  /** "View on Phone Screen" buttons inside each right panel */
  _initViewButtons() {
    this.viewButtons.forEach(btn => {
      const handleTap = (e) => {
        e.preventDefault();
        const idx = parseInt(btn.getAttribute('data-screen-index'), 10);
        if (!isNaN(idx)) {
          this.setPhoneScreen(idx, false, true);
        }
      };

      btn.addEventListener('click', handleTap);
    });
  }

  destroy() {
    this.triggers.forEach(t => t.kill?.());
    this.triggers = [];
    this._stopTilt?.();
  }
}

/* =========================================================================
   INJECTION — Transform Existing Billboard Sections into Demo Stages
   ========================================================================= */

const PROJECT_METAS = {
  yaan: {
    eyebrow: 'FLAGSHIP SYSTEM',
    title: 'YAAN. Sovereign Mobile OS.',
    desc: 'Privacy-first, local-first personal OS for high-output engineers. Offline encrypted vault with AES-GCM-256 and zero network latency.',
    imgSrc: 'assets/yaan-preview.png?v=3.3.0',
    imgAlt: 'YAAN Sovereign Mobile OS',
    deviceLabel: 'Kotlin Multiplatform · Compose · AES-GCM-256',
    ctas: [
      { type: 'primary', label: 'Explore Architecture', action: "window.__openProjectModalDirect?.('yaan')" },
      { type: 'link', label: 'View on GitHub', href: 'https://github.com/yashsiwacha/yaan', external: true },
    ],
  },
  examprep: {
    eyebrow: 'ANDROID NATIVE',
    title: 'ExamPrepOS. Distraction-Free.',
    desc: 'Intelligent mastery model with OLED distraction-free study operating system. 120 FPS frame pacing with Room DB local cache.',
    imgSrc: 'assets/examprep-preview.png?v=3.3.0',
    imgAlt: 'ExamPrepOS Android Native',
    deviceLabel: 'Kotlin 1.9 · Jetpack Compose M3 · Room DB',
    ctas: [
      { type: 'primary', label: 'Explore System', action: "window.__openProjectModalDirect?.('examprep')" },
      { type: 'link', label: 'Inspect Repository', href: 'https://github.com/yashsiwacha/ExamPrepOS', external: true },
    ],
  },
  driftbound: {
    eyebrow: 'REAL-TIME 3D GRAPHICS',
    title: 'DRIFTBOUND. Pure Physics.',
    desc: 'Stylized 3D open-world mobile street racing & drifting in Unity 6 LTS. Zero-allocation simulation loop with 0 B/frame GC churn.',
    imgSrc: 'assets/driftbound-preview.png?v=3.3.0',
    imgAlt: 'DRIFTBOUND Open Roads',
    deviceLabel: 'Unity 6 LTS · URP · Vulkan / Metal',
    ctas: [
      { type: 'primary', label: 'Inspect Engine', action: "window.__openProjectModalDirect?.('driftbound')" },
      { type: 'link', label: 'Request Demo Build', href: '#contact', external: false },
    ],
  },
};

function injectDemoIntoSection(sectionId, projectKey) {
  const section = document.getElementById(sectionId);
  if (!section) {
    console.warn(`[PhoneDemo] Section #${sectionId} not found.`);
    return null;
  }

  const meta = PROJECT_METAS[projectKey];
  if (!meta) return null;

  section.classList.add('demo-billboard');

  const stageHTML = buildDemoStageHTML(projectKey, meta);
  const billboard = section.querySelector('.billboard-content');
  if (billboard) {
    billboard.innerHTML = stageHTML;
  } else {
    section.innerHTML = stageHTML;
  }

  return new PhoneDemoController(projectKey);
}

/* =========================================================================
   ENTRY POINT
   ========================================================================= */

export function initPhoneDemos() {
  if (window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
  }

  const controllers = [];
  const c1 = injectDemoIntoSection('billboard-yaan', 'yaan');
  const c2 = injectDemoIntoSection('billboard-examprep', 'examprep');
  const c3 = injectDemoIntoSection('billboard-driftbound', 'driftbound');

  if (c1) controllers.push(c1);
  if (c2) controllers.push(c2);
  if (c3) controllers.push(c3);

  if (window.ScrollTrigger) {
    setTimeout(() => window.ScrollTrigger.refresh(), 200);
  }

  return controllers;
}
