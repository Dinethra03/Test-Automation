const fs = require('fs');
const path = require('path');

const sidebarContent = `import { Page, Locator } from '@playwright/test';

export class SidebarComponent {
  readonly page: Page;
  readonly dashboardLink: Locator;
  readonly iamLink: Locator;
  readonly hierarchyLink: Locator;
  readonly calendarLink: Locator;
  readonly shiftLink: Locator;
  readonly rateCardLink: Locator;
  readonly workerDirLink: Locator;
  readonly supplierRegLink: Locator;
  readonly allocationMgrLink: Locator;
  readonly attendanceBdLink: Locator;
  readonly rosterMatrixLink: Locator;
  readonly periodCloseLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dashboardLink = page.locator('a').filter({ hasText: 'Dashboard' }).first();
    this.iamLink = page.locator('a').filter({ hasText: 'Identity & Access' }).first();
    this.hierarchyLink = page.locator('a').filter({ hasText: 'Hierarchy Manager' }).first();
    this.calendarLink = page.locator('a').filter({ hasText: 'Calendar Manager' }).first();
    this.shiftLink = page.locator('a').filter({ hasText: 'Shift Configurator' }).first();
    this.rateCardLink = page.locator('a').filter({ hasText: 'Rate Card Manager' }).first();
    this.workerDirLink = page.locator('a').filter({ hasText: 'Worker Directory' }).first();
    this.supplierRegLink = page.locator('a').filter({ hasText: 'Supplier Registry' }).first();
    this.allocationMgrLink = page.locator('a').filter({ hasText: 'Allocation Manager' }).first();
    this.attendanceBdLink = page.locator('a').filter({ hasText: 'Attendance Board' }).first();
    this.rosterMatrixLink = page.locator('a').filter({ hasText: 'Roster Matrix' }).first();
    this.periodCloseLink = page.locator('a').filter({ hasText: 'Period Close' }).first();
  }
}
`;
fs.writeFileSync('pages/SidebarComponent.ts', sidebarContent);

const pages = [
  { name: 'CalendarPage', url: '/calendar', els: ['Normal Working Day', 'Poya Day', 'Company Holiday', 'Statutory Holiday', 'PUBLISH UPDATES'] },
  { name: 'ShiftPage', url: '/shift-configurator', els: ['GEN1 (EXECUTIVE)', 'GEN2 (EXEC ALT)', 'DISCARD CHANGES', 'SAVE GEN1 RULES'] },
  { name: 'RateCardPage', url: '/rate-card', els: ['STANDARD COMPANY RATES', 'DEPARTMENT SPECIFIC OVERRIDES', 'SAVE STANDARD RATES'] },
  { name: 'WorkerDirPage', url: '/worker-directory', els: ['INITIATE WEB ONBOARDING', 'VIEW PROFILE', 'RESUME DRAFT'] },
  { name: 'SupplierRegPage', url: '/supplier-registry', els: ['REGISTER SUPPLIER'] },
  { name: 'AllocationMgrPage', url: '/allocation-manager', els: ['FIXED STAFF BOARD (MANUAL)', 'FLUID LABOR ROUTING (LIVE)', 'ALLOCATE'] },
  { name: 'AttendanceBdPage', url: '/attendance-board', els: ['EXCEPTIONS ONLY', 'SHOW ALL', 'RESOLVE'] },
  { name: 'RosterMatrixPage', url: '/roster-matrix', els: ['PUBLISH CHANGES', 'M - Morning', 'N - Night'] },
  { name: 'PeriodClosePage', url: '/period-close-dashboard', els: ['LOCK PERIOD', 'DETAILS'] }
];

for (const p of pages) {
  let cls = `import { Page, Locator } from '@playwright/test';
import { SidebarComponent } from './SidebarComponent';

export class ${p.name} {
  readonly page: Page;
  readonly sidebar: SidebarComponent;\n`;
  for(let i=0; i<p.els.length; i++) {
    cls += `  readonly el${i}: Locator;\n`;
  }
  cls += `\n  constructor(page: Page) {
    this.page = page;
    this.sidebar = new SidebarComponent(page);\n`;
  for(let i=0; i<p.els.length; i++) {
    cls += `    this.el${i} = page.locator(':text-is("${p.els[i].replace(/"/g, '\\"')}"), :text("${p.els[i].replace(/"/g, '\\"')}"), [aria-label*="${p.els[i].replace(/"/g, '\\"')}"]').first();\n`;
  }
  cls += `  }\n
  async navigate() {
    await this.page.goto('${p.url}');
  }
}\n`;

  fs.writeFileSync(`pages/${p.name}.ts`, cls);

  const spec = `import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ${p.name} } from '../pages/${p.name}';

test.describe('FaceLink ${p.name} Tests', () => {
  let pageObject: ${p.name};

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser@cultive8.lk', 'password123');
    await page.waitForURL('**/dashboard');
    
    pageObject = new ${p.name}(page);
    await pageObject.navigate();
    await page.waitForLoadState('networkidle');
  });

  test('should load all dynamic components successfully', async ({ page }) => {
    // Structural checks
    await expect(pageObject.sidebar.dashboardLink).toBeVisible();\n`;
    const asserts = p.els.map((e, idx) => `    await expect(pageObject.el${idx}).toBeVisible();`).join('\n');
    const specEnd = `\n${asserts}\n  });\n});\n`;
    fs.writeFileSync(`tests/${p.name}.spec.ts`, spec + specEnd);
}
console.log('All files generated successfully.');
