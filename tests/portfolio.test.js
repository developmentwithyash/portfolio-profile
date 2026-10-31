// Automated assertion suite for Yash's Freelance Portfolio
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Portfolio Data Integrity & Schema Validation', async () => {
  const dataPath = path.join(rootDir, 'data', 'portfolio-data.js');
  assert.ok(fs.existsSync(dataPath), 'portfolio-data.js must exist');

  const { portfolioData } = await import(`file://${dataPath}`);
  assert.ok(portfolioData, 'portfolioData export must be defined');

  // Verify Developer profile
  assert.equal(typeof portfolioData.developer.name, 'string');
  assert.ok(portfolioData.developer.email.includes('@'), 'Valid contact email');
  assert.equal(portfolioData.developer.email, 'work.developmentwithyash@gmail.com');
  assert.ok(portfolioData.developer.stats.length >= 3, 'At least 3 proof metrics');

  // Verify Projects
  assert.ok(Array.isArray(portfolioData.projects), 'Projects must be an array');
  assert.ok(portfolioData.projects.length >= 5, 'Must contain at least 5 flagship projects');

  const validCategories = new Set(portfolioData.categories.map(c => c.id));
  portfolioData.projects.forEach((proj, idx) => {
    assert.ok(proj.id, `Project [${idx}] must have an id`);
    assert.ok(proj.title, `Project [${idx}] must have a title`);
    assert.ok(proj.tagline, `Project [${idx}] must have a tagline`);
    assert.ok(validCategories.has(proj.category), `Project [${proj.id}] category '${proj.category}' must be in categories`);
    assert.ok(proj.metrics && proj.metrics.length > 0, `Project [${proj.id}] must feature key technical metrics`);
    assert.ok(proj.stack && proj.stack.length > 0, `Project [${proj.id}] must list tech stack`);
    assert.ok(proj.image, `Project [${proj.id}] must have an image path`);
    
    // Check image file existence
    const imgPath = path.join(rootDir, proj.image);
    assert.ok(fs.existsSync(imgPath), `Project image file must exist: ${proj.image}`);
  });

  // Verify Services
  assert.ok(Array.isArray(portfolioData.services), 'Services must be an array');
  assert.ok(portfolioData.services.length >= 4, 'Must offer at least 4 core engineering services');

  // Verify Testimonials & Process
  assert.ok(Array.isArray(portfolioData.testimonials), 'Testimonials must be defined');
  assert.ok(Array.isArray(portfolioData.process), 'Process steps must be defined');
});

test('Semantic HTML & Accessibility Structure Validation', () => {
  const htmlPath = path.join(rootDir, 'index.html');
  assert.ok(fs.existsSync(htmlPath), 'index.html must exist');
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Single H1 rule
  const h1Matches = html.match(/<h1[\s>]/g) || [];
  assert.equal(h1Matches.length, 1, 'Page must have exactly one <h1> heading');

  // Semantic landmark tags
  assert.ok(html.includes('<header'), 'Semantic <header> landmark required');
  assert.ok(html.includes('<main'), 'Semantic <main> landmark required');
  assert.ok(html.includes('<footer'), 'Semantic <footer> landmark required');
  assert.ok(html.includes('<nav'), 'Semantic <nav> landmark required');

  // Modern Web Guidance scroll progress indicator
  assert.ok(html.includes('id="scroll-progress"'), 'Scroll progress element required');
  assert.ok(html.includes('aria-hidden="true"'), 'Scroll progress element must have aria-hidden="true"');

  // Modal dialog accessibility
  assert.ok(html.includes('role="dialog"') || html.includes('<dialog'), 'Accessible modal element required');
  assert.ok(html.includes('aria-modal="true"'), 'Modal must declare aria-modal="true"');
});

test('CSS & Motion Styling System Validation', () => {
  const cssPath = path.join(rootDir, 'css', 'styles.css');
  assert.ok(fs.existsSync(cssPath), 'styles.css must exist');
  const css = fs.readFileSync(cssPath, 'utf8');

  // Reduced motion support
  assert.ok(css.includes('@media (prefers-reduced-motion'), 'Must support prefers-reduced-motion');

  // Spring & compositor animation tokens
  assert.ok(css.includes('--ease-spring') || css.includes('--spring'), 'Must declare spring timing tokens');
  assert.ok(css.includes('backdrop-filter'), 'Must use modern backdrop-filter glassmorphism');
  assert.ok(css.includes(':focus-visible'), 'Must have accessible focus-visible rings');

  // Distinctive Brand Color System verification (Cream Background, Oxford Navy, Terracotta Amber)
  assert.ok(css.includes('--canvas-primary') && css.includes('#FAF7EE'), 'Must define Warm Cream primary canvas token (#FAF7EE)');
  assert.ok(css.includes('--accent-primary') && css.includes('#D45524'), 'Must define Warm Terracotta Amber primary accent token (#D45524)');
  assert.ok(css.includes('--text-light-primary') && css.includes('#0B192C'), 'Must define Deep Oxford Navy primary text token (#0B192C)');
  assert.ok(css.includes('--text-light-muted') && css.includes('#384C66'), 'Must define Slate Navy muted text token (#384C66)');

  // Accent & Hairline verification
  assert.ok(css.includes('--accent-primary'), 'Must define accent tokens');
  assert.ok(css.includes('linear-gradient'), 'Must define gradient tokens');
  assert.ok(css.includes('--border-accent'), 'Must define accent border hairlines');

  // Scrolled Navbar & Modal Color Integrity (No Old Plum or Obsidian Black Remnants in active tokens)
  assert.ok(!css.includes('33, 26, 44') && !css.includes('#211A2C'), 'No old plum color should remain in CSS');
});

test('Modern Product Architecture & Interaction Verification', () => {
  const htmlPath = path.join(rootDir, 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  // Verify Hero proof metrics & CTA
  assert.ok(html.includes('class="proof-metrics-grid"'), 'Proof metrics grid required in hero');
  assert.ok(html.includes('id="btn-copy-email"'), 'Direct email copy button required');
  assert.ok(html.includes('work.developmentwithyash@gmail.com'), 'Direct contact email must be present');

  // Bento project showcase & filter system
  assert.ok(html.includes('id="projects-grid"'), 'Projects bento grid container required');
  assert.ok(html.includes('id="category-filter-bar"'), 'Category filter bar required');
  assert.ok(html.includes('id="filter-pill-indicator"'), 'Spring pill indicator element required');

  // Core product sections
  assert.ok(html.includes('id="philosophy"'), 'Systems philosophy section required');
  assert.ok(html.includes('id="services"'), 'Capabilities & services section required');
  assert.ok(html.includes('id="process"'), 'Methodology & process section required');
  assert.ok(html.includes('id="testimonials"'), 'Client proof & testimonials section required');
  assert.ok(html.includes('id="faq"'), 'FAQ accordion section required');
  assert.ok(html.includes('id="contact"'), 'Contact section required');

  // Accessible Modal Dialog
  assert.ok(html.includes('id="project-modal"'), 'Project deep-dive modal required');
  assert.ok(html.includes('id="modal-close-btn"'), 'Modal close button required');
  assert.ok(html.includes('id="modal-architecture-box"'), 'Modal architecture box required');

  // Ambient Spotlight & Scroll Progress
  assert.ok(html.includes('id="ambient-spotlight"'), 'GPU ambient spotlight required');
  assert.ok(html.includes('id="scroll-progress"'), 'Compositor scroll progress required');

  // Script modules
  assert.ok(/src="js\/vendor\/lenis\.min\.js(\?[^"]+)?"/.test(html), 'Lenis vendor script must be loaded');
  assert.ok(/type="module"\s+src="js\/main\.js(\?[^"]+)?"/.test(html), 'ES module main.js must be loaded');
});

test('Commercial Apple Product Shoot Assets & Shadow Integrity', () => {
  const cssPath = path.join(rootDir, 'css', 'styles.css');
  const css = fs.readFileSync(cssPath, 'utf8');
  assert.ok(!css.includes('18, 14, 25'), 'No old plum shadow RGB remnants should remain in CSS');

  const expectedAssets = [
    'assets/yaan-preview.jpg',
    'assets/examprep-preview.jpg',
    'assets/driftbound-preview.jpg',
    'assets/bridge-preview.jpg',
    'assets/eos-preview.jpg'
  ];

  expectedAssets.forEach((assetRelPath) => {
    const fullPath = path.join(rootDir, assetRelPath);
    assert.ok(fs.existsSync(fullPath), `Asset must exist: ${assetRelPath}`);
    const stat = fs.statSync(fullPath);
    assert.ok(stat.size > 200000, `Asset ${assetRelPath} must be high-resolution commercial quality (> 200KB, actual: ${stat.size} bytes)`);
  });

  const expectedCutouts = [
    'assets/yaan-preview.png',
    'assets/examprep-preview.png',
    'assets/driftbound-preview.png'
  ];

  expectedCutouts.forEach((assetRelPath) => {
    const fullPath = path.join(rootDir, assetRelPath);
    assert.ok(fs.existsSync(fullPath), `Transparent cutout asset must exist: ${assetRelPath}`);
    const stat = fs.statSync(fullPath);
    assert.ok(stat.size > 200000, `Transparent cutout ${assetRelPath} must be high-resolution (> 200KB, actual: ${stat.size} bytes)`);
  });
});

test('Smooth Scrolling & Phone Demonstration Architecture Verification', () => {
  const mainJsPath = path.join(rootDir, 'js', 'main.js');
  const mainJs = fs.readFileSync(mainJsPath, 'utf8');

  // Verify Lenis lerp configuration
  assert.ok(mainJs.includes('lerp: 0.1'), 'Lenis must use lerp: 0.1 for buttery-smooth scrolling without rubber-banding');
  assert.ok(mainJs.includes('lenis.raf(time * 1000)'), 'Single central GSAP ticker for Lenis');
  assert.ok(mainJs.includes('window.ScrollTrigger.update'), 'ScrollTrigger update bound to Lenis scroll event');

  const cssPath = path.join(rootDir, 'css', 'styles.css');
  const css = fs.readFileSync(cssPath, 'utf8');
  assert.ok(!css.includes('scroll-behavior: smooth'), 'Must NOT have native CSS scroll-behavior: smooth fighting Lenis');

  const phoneJsPath = path.join(rootDir, 'js', 'phone-demo.js');
  assert.ok(fs.existsSync(phoneJsPath), 'phone-demo.js must exist');
  const phoneJs = fs.readFileSync(phoneJsPath, 'utf8');
  assert.ok(!phoneJs.includes('lenis.raf'), 'phone-demo.js must NOT create duplicate lenis.raf ticker dispatchers');
  assert.ok(phoneJs.includes('_glideToPanel'), 'phone-demo.js must support smooth phone docking to active information panel');

  const htmlPath = path.join(rootDir, 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');
  assert.ok(html.includes('--canvas-primary: #FAF7EE !important'), 'index.html must have critical inline style preventing black background cache flash');
  assert.ok(html.includes('background-color: #FAF7EE !important'), 'body must have inline warm cream background color');
  assert.ok(html.includes('floating-phone-media'), 'index.html must include phone media presentation containers');
  assert.ok(phoneJs.includes('demo-stage'), 'phone-demo.js must construct interactive phone demonstration stage');
});




