import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { AllocationMgrPage } from '../pages/AllocationMgrPage';

test.describe('FaceLink AllocationMgrPage Tests', () => {
  let pageObject: AllocationMgrPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login();
    await page.waitForURL('**/dashboard');
    
    pageObject = new AllocationMgrPage(page);
    await pageObject.navigate();
    await page.waitForLoadState('networkidle');
  });

  test('should load all dynamic components successfully', async ({ page }) => {
    // Structural checks
    await expect(pageObject.sidebar.dashboardLink).toBeVisible();

    await expect(pageObject.el0).toBeVisible();
    await expect(pageObject.el1).toBeVisible();
    await expect(pageObject.el2).toBeVisible();
  });
});
