const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Logging in...');
  await page.goto('https://facelink-poc.cultive8.lk/login');
  await page.click('button:has-text("Sign In")');
  await page.waitForURL('**/dashboard');
  
  async function scrapePage(url, title) {
    console.log(`Scraping ${title}...`);
    await page.goto(url);
    await page.waitForTimeout(2000); // Wait for mock MSW data
    
    // Attempt to dismiss any modals or notifications that MSW might inject repeatedly
    // but usually it's fine
    const els = await page.evaluate(() => {
      const allEls = document.querySelectorAll('button, h1, h2, th, div[role="button"], div[role="tab"], .MuiDataGrid-columnHeaderTitle');
      return Array.from(allEls).map(e => {
          return `${e.tagName} | text: "${(e.innerText || '').substring(0,60).replace(/\n/g, ' ')}" | id: "${e.id}"`;
      }).filter((v, i, a) => a.indexOf(v) === i && !v.includes('text: "" | id: ""') && !v.includes('text: "Dashboard" | id: ""'));
    });
    return `\n--- ${title} ---\n` + els.join('\n');
  }

  const urls = [
    { u: 'https://facelink-poc.cultive8.lk/calendar', t: 'CALENDAR' },
    { u: 'https://facelink-poc.cultive8.lk/shift-configurator', t: 'SHIFT' },
    { u: 'https://facelink-poc.cultive8.lk/rate-card', t: 'RATE_CARD' },
    { u: 'https://facelink-poc.cultive8.lk/worker-directory', t: 'WORKER_DIR' },
    { u: 'https://facelink-poc.cultive8.lk/supplier-registry', t: 'SUPPLIER_REG' },
    { u: 'https://facelink-poc.cultive8.lk/allocation-manager', t: 'ALLOCATION_MGR' },
    { u: 'https://facelink-poc.cultive8.lk/attendance-board', t: 'ATTENDANCE_BD' },
    { u: 'https://facelink-poc.cultive8.lk/roster-matrix', t: 'ROSTER_MATRIX' },
    { u: 'https://facelink-poc.cultive8.lk/period-close-dashboard', t: 'PERIOD_CLOSE' }
  ];

  let output = '';
  for (let site of urls) {
    output += await scrapePage(site.u, site.t);
  }

  fs.writeFileSync('scraped_elements_9.txt', output);
  console.log('Done!');
  await browser.close();
})();
