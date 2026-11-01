import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('TDD: Public Static Asset Pipeline Requirements', () => {
  const publicDir = path.join(rootDir, 'public');
  assert.ok(fs.existsSync(publicDir), 'public/ directory must exist for Vite static assets');

  const publicAssetsDir = path.join(publicDir, 'assets');
  assert.ok(fs.existsSync(publicAssetsDir), 'public/assets must exist');

  const publicEmulatorDir = path.join(publicAssetsDir, 'emulator');
  assert.ok(fs.existsSync(publicEmulatorDir), 'public/assets/emulator must exist');

  const requiredEmulatorImages = [
    'yaan-daily-briefing.png',
    'yaan-ask-intelligence.png',
    'yaan-vault-setup.png',
    'yaan-onboarding.png',
    'examprep-dashboard.png',
    'examprep-practice.png',
    'examprep-vault.png',
    'examprep-preflight-mock.png',
    'examprep-assessment.png'
  ];

  requiredEmulatorImages.forEach(img => {
    const imgPath = path.join(publicEmulatorDir, img);
    assert.ok(fs.existsSync(imgPath), `Emulator asset must exist in public/assets/emulator/${img}`);
  });

  const requiredProjectImages = [
    'bridge-preview.jpg',
    'driftbound-preview.png',
    'examprep-preview.png',
    'yaan-preview.png',
    'eos-preview.jpg'
  ];

  requiredProjectImages.forEach(img => {
    const imgPath = path.join(publicAssetsDir, img);
    assert.ok(fs.existsSync(imgPath), `Project preview asset must exist in public/assets/${img}`);
  });

  const publicVendorDir = path.join(publicDir, 'js', 'vendor');
  assert.ok(fs.existsSync(publicVendorDir), 'public/js/vendor must exist');
  assert.ok(fs.existsSync(path.join(publicVendorDir, 'gsap.min.js')), 'public/js/vendor/gsap.min.js must exist');
  assert.ok(fs.existsSync(path.join(publicVendorDir, 'ScrollTrigger.min.js')), 'public/js/vendor/ScrollTrigger.min.js must exist');
  assert.ok(fs.existsSync(path.join(publicVendorDir, 'lenis.min.js')), 'public/js/vendor/lenis.min.js must exist');
});

test('TDD: Touch Target Accessibility (Apple HIG / WCAG 2.1 AA)', () => {
  const cssPath = path.join(rootDir, 'css', 'styles.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  // Verify Apple Nav Link Touch Target (44px)
  assert.ok(
    css.includes('.apple-nav-link') && (css.includes('min-height: 44px') || css.includes('padding: 10px') || css.includes('padding: 0.75rem')),
    'apple-nav-link must have 44px min-height or adequate padding for touch targets'
  );

  // Verify Apple Nav Icon Link Touch Target (44px)
  assert.ok(
    css.includes('.apple-nav-icon-link') && (css.includes('min-width: 44px') || css.includes('width: 44px') || css.includes('padding: 8px')),
    'apple-nav-icon-link must meet 44px touch target requirement'
  );

  // Verify Filter Button Touch Target (44px)
  assert.ok(
    css.includes('.filter-btn') && (css.includes('min-height: 44px') || css.includes('padding: 0.65rem') || css.includes('padding: 0.75rem')),
    'filter-btn must have min-height 44px for easy thumb tapping on mobile'
  );

  // Verify Emil Kowalski tactile active press states
  assert.ok(
    css.includes(':active') && css.includes('scale(0.97)'),
    'Must include Emil Kowalski tactile scale(0.97) on button:active'
  );
});

test('TDD: Vite Build Static Preservation', () => {
  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    // Check that dist contains emulator assets and vendor scripts
    const distEmulator = path.join(distDir, 'assets', 'emulator');
    const distVendor = path.join(distDir, 'js', 'vendor');
    assert.ok(fs.existsSync(distEmulator), 'dist/assets/emulator must exist after build');
    assert.ok(fs.existsSync(distVendor), 'dist/js/vendor must exist after build');
  }
});
