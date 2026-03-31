import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { CalendarPage } from '../pages/CalendarPage';

test.describe('FaceLink CalendarPage Tests', () => {
  let pageObject: CalendarPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login();
    await page.waitForURL('**/dashboard');
    
    pageObject = new CalendarPage(page);
    await pageObject.navigate();
    await page.waitForLoadState('networkidle');
  });

  test('should load all dynamic components successfully', async ({ page }) => {
    // Structural checks
    await expect(pageObject.sidebar.dashboardLink).toBeVisible();

    await expect(pageObject.el0).toBeVisible();
    await expect(pageObject.el1).toBeVisible();
    await expect(pageObject.el2).toBeVisible();
    await expect(pageObject.el3).toBeVisible();
    await expect(pageObject.el4).toBeVisible();
  });
});
