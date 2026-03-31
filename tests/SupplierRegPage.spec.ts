import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SupplierRegPage } from '../pages/SupplierRegPage';

test.describe('FaceLink SupplierRegPage Tests', () => {
  let pageObject: SupplierRegPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login();
    await page.waitForURL('**/dashboard');
    
    pageObject = new SupplierRegPage(page);
    await pageObject.navigate();
    await page.waitForLoadState('networkidle');
  });

  test('should load all dynamic components successfully', async ({ page }) => {
    // Structural checks
    await expect(pageObject.sidebar.dashboardLink).toBeVisible();

    await expect(pageObject.el0).toBeVisible();
  });
});
