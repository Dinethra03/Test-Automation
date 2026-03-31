import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('FaceLink Dashboard Tests', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    // Authenticate first using our proxy login functionality
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(); // MSW handles mock auth
    await page.waitForURL('**/dashboard');
    
    dashboardPage = new DashboardPage(page);
  });

  test('should load dashboard features correctly', async ({ page }) => {
    // Wait for the Dashboard title to be visible on the sidebar as an indicator the page is ready
    await expect(dashboardPage.sidebar.dashboardLink).toBeVisible();
    
    // Assert components loaded
    await expect(dashboardPage.fullBoardBtn).toBeVisible();
    await expect(dashboardPage.manageSuppliersBtn).toBeVisible();
    await expect(dashboardPage.siteHeader).toBeVisible();
  });
});
