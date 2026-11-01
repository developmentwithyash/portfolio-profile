import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_URL = process.env.AUDIT_URL || 'https://portfolio-profile-nine-jet.vercel.app';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const ARTIFACT_DIR = '/Users/yashdev/.gemini/antigravity/brain/6621695b-94e9-4025-b238-18bfa5098664';

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900, isMobile: false },
  { name: 'tablet', width: 768, height: 1024, isMobile: false },
  { name: 'mobile', width: 375, height: 812, isMobile: true }
];

async function runAudit() {
  console.log(`Starting Playwright Comprehensive Audit against ${TARGET_URL}...`);
  const browser = await chromium.launch({ headless: true });
  
  const auditReport = {
    targetUrl: TARGET_URL,
    timestamp: new Date().toISOString(),
    viewports: {},
    networkSummary: {},
    consoleMessages: [],
    pageErrors: [],
    domAnalysis: {},
    accessibility: {
      missingAlts: [],
      touchTargetViolations: [],
      headingHierarchy: []
    },
    performanceMetrics: {}
  };

  for (const vp of VIEWPORTS) {
    console.log(`Auditing viewport: ${vp.name} (${vp.width}x${vp.height})...`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
      deviceScaleFactor: 2
    });

    const page = await context.newPage();
    const consoleLogs = [];
    const pageErrors = [];
    const networkRequests = [];
    let failedRequests = [];

    page.on('console', msg => {
      consoleLogs.push({ type: msg.type(), text: msg.text() });
    });

    page.on('pageerror', err => {
      pageErrors.push(err.toString());
    });

    page.on('requestfinished', req => {
      networkRequests.push({
        url: req.url(),
        resourceType: req.resourceType(),
        method: req.method()
      });
    });

    page.on('requestfailed', req => {
      failedRequests.push({
        url: req.url(),
        failure: req.failure() ? req.failure().errorText : 'unknown'
      });
    });

    const startTime = Date.now();
    const response = await page.goto(TARGET_URL, { waitUntil: 'commit', timeout: 30000 });
    // Allow styles, fonts, and DOM transformations to render smoothly
    await page.waitForTimeout(2000);

    // Scroll to decode lazy loaded images and initialize scroll animations
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight * 0.33);
      await new Promise(r => setTimeout(r, 300));
      window.scrollTo(0, document.body.scrollHeight * 0.66);
      await new Promise(r => setTimeout(r, 300));
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise(r => setTimeout(r, 400));
      window.scrollTo(0, 0);
      await new Promise(r => setTimeout(r, 300));
    });
    const loadDuration = Date.now() - startTime;
    const status = response ? response.status() : null;

    // Capture Viewport Hero Screenshot
    const heroShotPath = path.join(SCREENSHOT_DIR, `${vp.name}_hero.png`);
    await page.screenshot({ path: heroShotPath, fullPage: false, animations: 'disabled', timeout: 30000 });

    // Capture Full Page Screenshot
    const fullShotPath = path.join(SCREENSHOT_DIR, `${vp.name}_fullpage.png`);
    await page.screenshot({ path: fullShotPath, fullPage: true, animations: 'disabled', timeout: 30000 });

    // Copy to artifact directory if available
    if (fs.existsSync(ARTIFACT_DIR)) {
      try {
        fs.copyFileSync(heroShotPath, path.join(ARTIFACT_DIR, `playwright_${vp.name}_hero.png`));
        fs.copyFileSync(fullShotPath, path.join(ARTIFACT_DIR, `playwright_${vp.name}_fullpage.png`));
      } catch (err) {
        console.warn('Artifact copy notice:', err.message);
      }
    }

    // Performance Timing
    const perfTiming = await page.evaluate(() => {
      const timing = performance.getEntriesByType('navigation')[0];
      if (!timing) return {};
      return {
        dns: Math.round(timing.domainLookupEnd - timing.domainLookupStart),
        tcp: Math.round(timing.connectEnd - timing.connectStart),
        ttfb: Math.round(timing.responseStart - timing.requestStart),
        responseDuration: Math.round(timing.responseEnd - timing.responseStart),
        domInteractive: Math.round(timing.domInteractive),
        domContentLoaded: Math.round(timing.domContentLoadedEventEnd),
        loadComplete: Math.round(timing.loadEventEnd),
        transferSize: timing.transferSize,
        decodedBodySize: timing.decodedBodySize
      };
    });

    // DOM & Accessibility Analysis
    const domMetrics = await page.evaluate(() => {
      // Headings
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
        tag: h.tagName.toLowerCase(),
        text: h.innerText.trim().slice(0, 80)
      }));

      // Images
      const images = Array.from(document.querySelectorAll('img')).map(img => ({
        src: img.src,
        alt: img.getAttribute('alt'),
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        isBroken: img.naturalWidth === 0
      }));

      // Links & Buttons
      const interactive = Array.from(document.querySelectorAll('a, button, input[type="button"], input[type="submit"]')).map(el => {
        const rect = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          text: (el.innerText || el.getAttribute('value') || el.getAttribute('aria-label') || '').trim().slice(0, 50),
          href: el.getAttribute('href') || null,
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          isVisible: rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== 'hidden' && window.getComputedStyle(el).display !== 'none'
        };
      });

      // Navigation Items
      const navLinks = Array.from(document.querySelectorAll('nav a, header a')).map(a => ({
        text: a.innerText.trim(),
        href: a.getAttribute('href')
      }));

      return {
        title: document.title,
        headings,
        images,
        interactive,
        navLinks,
        bodyTextLength: document.body.innerText.length
      };
    });

    // Touch targets < 44x44 check on mobile/tablet
    const touchViolations = domMetrics.interactive.filter(item => {
      return item.isVisible && (item.width < 44 || item.height < 44) && (vp.name === 'mobile' || vp.name === 'tablet');
    });

    auditReport.viewports[vp.name] = {
      viewport: `${vp.width}x${vp.height}`,
      httpStatus: status,
      loadDurationMs: loadDuration,
      heroScreenshot: heroShotPath,
      fullpageScreenshot: fullShotPath,
      touchViolationsCount: touchViolations.length,
      sampleTouchViolations: touchViolations.slice(0, 10),
      perfTiming
    };

    if (vp.name === 'desktop') {
      auditReport.consoleMessages = consoleLogs;
      auditReport.pageErrors = pageErrors;
      auditReport.networkSummary = {
        totalRequests: networkRequests.length,
        failedRequestsCount: failedRequests.length,
        failedRequestsDetails: failedRequests,
        resourceTypes: networkRequests.reduce((acc, curr) => {
          acc[curr.resourceType] = (acc[curr.resourceType] || 0) + 1;
          return acc;
        }, {})
      };
      auditReport.domAnalysis = {
        title: domMetrics.title,
        totalHeadings: domMetrics.headings.length,
        totalImages: domMetrics.images.length,
        brokenImagesCount: domMetrics.images.filter(img => img.isBroken).length,
        brokenImages: domMetrics.images.filter(img => img.isBroken).map(img => img.src),
        missingAlts: domMetrics.images.filter(img => !img.alt || img.alt.trim() === '').map(img => img.src),
        totalInteractiveElements: domMetrics.interactive.length,
        navLinks: domMetrics.navLinks
      };
      auditReport.accessibility.headingHierarchy = domMetrics.headings;
      auditReport.accessibility.missingAlts = domMetrics.images.filter(img => !img.alt || img.alt.trim() === '').map(img => img.src);
    }

    if (vp.name === 'mobile') {
      auditReport.accessibility.touchTargetViolations = touchViolations.map(v => ({
        element: `${v.tag}: "${v.text}"`,
        dimensions: `${v.width}x${v.height}px`
      }));
    }

    await context.close();
  }

  await browser.close();

  const outputPath = path.join(__dirname, 'playwright_audit_results.json');
  fs.writeFileSync(outputPath, JSON.stringify(auditReport, null, 2));
  console.log(`Audit complete. Results saved to ${outputPath}`);
  return auditReport;
}

runAudit().then(report => {
  console.log('--- PLAYWRIGHT AUDIT SUMMARY ---');
  console.log(`Target: ${report.targetUrl}`);
  console.log(`Desktop Status: ${report.viewports.desktop.httpStatus} (${report.viewports.desktop.loadDurationMs}ms)`);
  console.log(`Tablet Status: ${report.viewports.tablet.httpStatus} (${report.viewports.tablet.loadDurationMs}ms)`);
  console.log(`Mobile Status: ${report.viewports.mobile.httpStatus} (${report.viewports.mobile.loadDurationMs}ms)`);
  console.log(`Total Requests: ${report.networkSummary.totalRequests}`);
  console.log(`Failed Requests: ${report.networkSummary.failedRequestsCount}`);
  console.log(`Broken Images: ${report.domAnalysis.brokenImagesCount}`);
  console.log(`Missing Image Alts: ${report.domAnalysis.missingAlts.length}`);
  console.log(`Mobile Touch Target Violations (<44x44): ${report.accessibility.touchTargetViolations.length}`);
  console.log(`Console Errors/Warnings: ${report.consoleMessages.length}`);
}).catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
