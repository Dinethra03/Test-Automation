import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { IamPage } from '../pages/IamPage';

// US 3.x — Identity & Access Management: As an admin, I want to manage roles, employees, and system users.

test.describe('US 3.x — Identity & Access Management (IAM)', () => {
  let iamPage: IamPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login();
    await page.waitForURL('**/dashboard');

    iamPage = new IamPage(page);
    await iamPage.navigate();
    await page.waitForLoadState('networkidle');
  });

  // ─── SMOKE ─────────────────────────────────────────────────────────────────

  test('TC-I-01: IAM page loads with all 3 tabs and Add Role Tier button', async ({ page }) => {
    await expect(iamPage.sidebar.iamLink).toBeVisible();
    await expect(iamPage.roleMatrixTab).toBeVisible();
    await expect(iamPage.employeeMasterTab).toBeVisible();
    await expect(iamPage.systemUsersTab).toBeVisible();
    await expect(iamPage.addRoleTierBtn).toBeVisible();
  });

  test('TC-I-02: Role Matrix tab is active by default on page load', async ({ page }) => {
    await expect(iamPage.roleMatrixTab).toHaveAttribute('aria-selected', 'true');
  });

  // ─── NAVIGATION ────────────────────────────────────────────────────────────

  test('TC-I-03: Click Employee Master tab makes it active', async ({ page }) => {
    await iamPage.employeeMasterTab.click();
    await expect(iamPage.employeeMasterTab).toHaveAttribute('aria-selected', 'true');
    await expect(iamPage.roleMatrixTab).toHaveAttribute('aria-selected', 'false');
  });

  test('TC-I-04: Click System Users tab makes it active and shows user list', async ({ page }) => {
    await iamPage.systemUsersTab.click();
    await expect(iamPage.systemUsersTab).toHaveAttribute('aria-selected', 'true');

    // System users tab content should load (table or list)
    await page.waitForTimeout(1000);
    const tableOrList = page.locator('table, [role="grid"], [role="list"], ul').first();
    await expect(tableOrList).toBeVisible({ timeout: 5000 });
  });

  // ─── HAPPY PATH ────────────────────────────────────────────────────────────

  test('TC-I-05: Add Role Tier opens a drawer or modal form', async ({ page }) => {
    await iamPage.addRoleTierBtn.click();

    // A drawer or dialog should appear with an input for role name
    const drawer = page.locator('.MuiDrawer-paper, [role="dialog"], [role="presentation"]').first();
    await expect(drawer).toBeVisible({ timeout: 5000 });
  });

  test('TC-I-06: Add a new Role Tier with a valid name and save', async ({ page }) => {
    await iamPage.addRoleTierBtn.click();

    const drawer = page.locator('.MuiDrawer-paper, [role="dialog"], [role="presentation"]').first();
    await expect(drawer).toBeVisible({ timeout: 5000 });

    // Fill role name
    const nameInput = page.getByLabel(/Role Name|Tier Name|Name/i).first();
    await nameInput.fill('Site Supervisor');

    // Save
    const saveBtn = page.getByRole('button', { name: /Save|Submit|Create/i }).first();
    await saveBtn.click();

    // New role should appear in the Role Matrix
    await expect(page.getByText(/Site Supervisor/i)).toBeVisible({ timeout: 5000 });
  });

  // ─── NEGATIVE ──────────────────────────────────────────────────────────────

  test('TC-I-07: Role Matrix grid displays with at least one role row', async ({ page }) => {
    // Role matrix should have a grid/table with headers
    const grid = page.locator('table, [role="grid"]').first();
    await expect(grid).toBeVisible({ timeout: 5000 });

    // Check that at least one data row exists
    const rows = page.locator('tbody tr, [role="row"]');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('TC-I-08: Saving a Role Tier with an empty name is prevented', async ({ page }) => {
    await iamPage.addRoleTierBtn.click();

    const drawer = page.locator('.MuiDrawer-paper, [role="dialog"], [role="presentation"]').first();
    await expect(drawer).toBeVisible({ timeout: 5000 });

    // Leave name empty and try to save
    const saveBtn = page.getByRole('button', { name: /Save|Submit|Create/i }).first();
    await saveBtn.click();

    // Drawer should still be open (form not submitted)
    await expect(drawer).toBeVisible();
  });
});
