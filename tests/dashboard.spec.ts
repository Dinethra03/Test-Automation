import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

// Dashboard: As a logged-in user, I want to see an overview of my workspace and navigate to key features.

test.describe('Dashboard', () => {
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login();
    await page.waitForURL('**/dashboard');

    dashboardPage = new DashboardPage(page);
  });

  // ─── SMOKE ─────────────────────────────────────────────────────────────────

  test('TC-D-01: Dashboard loads with all core elements visible', async ({ page }) => {
    await expect(dashboardPage.sidebar.dashboardLink).toBeVisible();
    await expect(dashboardPage.fullBoardBtn).toBeVisible();
    await expect(dashboardPage.manageSuppliersBtn).toBeVisible();
    await expect(dashboardPage.siteHeader).toBeVisible();
  });

  // ─── NAVIGATION ────────────────────────────────────────────────────────────

  test('TC-D-02: Full Board button navigates to the full attendance/roster board view', async ({ page }) => {
    await dashboardPage.fullBoardBtn.click();

    // Should navigate away from dashboard OR open a different panel/view
    await page.waitForTimeout(1500);
    const urlOrContentChanged =
      page.url().includes('/board') ||
      page.url().includes('/full') ||
      (await page.locator('[data-testid="full-board"], .full-board').isVisible().catch(() => false));

    // At minimum, the button click should cause a visible change
    expect(urlOrContentChanged).toBe(true);
  });

  test('TC-D-03: Manage Suppliers button navigates to supplier management', async ({ page }) => {
    await dashboardPage.manageSuppliersBtn.click();
    await page.waitForTimeout(1500);

    // Should navigate to suppliers route OR open a suppliers panel
    const onSuppliersView =
      page.url().includes('/supplier') ||
      (await page.getByText(/supplier/i).isVisible().catch(() => false));

    expect(onSuppliersView).toBe(true);
  });

  // ─── SIDEBAR NAVIGATION ────────────────────────────────────────────────────

  test('TC-D-04: Sidebar Hierarchy link navigates to /hierarchy', async ({ page }) => {
    await dashboardPage.sidebar.hierarchyLink.click();
    await page.waitForURL('**/hierarchy', { timeout: 8000 });
    expect(page.url()).toContain('/hierarchy');
  });

  test('TC-D-05: Sidebar IAM link navigates to /iam', async ({ page }) => {
    await dashboardPage.sidebar.iamLink.click();
    await page.waitForURL('**/iam', { timeout: 8000 });
    expect(page.url()).toContain('/iam');
  });

  // ─── CONTENT ───────────────────────────────────────────────────────────────

  test('TC-D-06: Site header/title is displayed on the dashboard', async ({ page }) => {
    await expect(dashboardPage.siteHeader).toBeVisible();
    const text = await dashboardPage.siteHeader.textContent();
    expect(text?.trim().length).toBeGreaterThan(0);
  });
});
