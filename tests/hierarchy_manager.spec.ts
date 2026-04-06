import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HierarchyPage } from '../pages/HierarchyPage';

// US 2.1 — Hierarchy Manager: As an admin, I want to manage the company/project/site hierarchy.

test.describe('US 2.1 — Hierarchy Manager', () => {
  let hierarchyPage: HierarchyPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login();
    await page.waitForURL('**/dashboard');

    hierarchyPage = new HierarchyPage(page);
    await hierarchyPage.navigate();
    await page.waitForLoadState('networkidle');
  });

  // ─── SMOKE ─────────────────────────────────────────────────────────────────

  test('TC-H-01: Hierarchy page loads with tree and company button', async ({ page }) => {
    await expect(hierarchyPage.sidebar.hierarchyLink).toBeVisible();
    await expect(hierarchyPage.companyBtn).toBeVisible();
    await expect(hierarchyPage.groupNode).toBeVisible();
  });

  // ─── HAPPY PATH ────────────────────────────────────────────────────────────

  test('TC-H-02: Add a new Site under a Project (happy path)', async ({ page }) => {
    // Expand company → project
    await hierarchyPage.treeCompanyNode.click();
    await hierarchyPage.treeProjectNode.click();

    // Open the Add Site drawer
    await hierarchyPage.addSiteBtn.click();
    await expect(hierarchyPage.drawer).toBeVisible();

    // Fill in all required fields
    await hierarchyPage.nameInput.fill('Site Delta');
    await hierarchyPage.locationCodeInput.fill('DEL01');
    await hierarchyPage.costCenterInput.fill('CC-88');

    // Save and verify optimistic update
    await hierarchyPage.saveBtn.click();
    await expect(page.getByRole('button', { name: /Site Delta/i })).toBeVisible();
  });

  test('TC-H-03: Add a new Project under a Company (happy path)', async ({ page }) => {
    // Click the company node to select it
    await hierarchyPage.treeCompanyNode.click();

    // The Add Project button should now appear
    await expect(hierarchyPage.addProjectBtn).toBeVisible();
    await hierarchyPage.addProjectBtn.click();

    // Drawer should open
    await expect(hierarchyPage.drawer).toBeVisible();

    // Fill in project details
    await hierarchyPage.nameInput.fill('New Metro Project');

    // Save
    await hierarchyPage.saveBtn.click();

    // Verify new project appears in the tree
    await expect(page.getByRole('button', { name: /New Metro Project/i })).toBeVisible();
  });

  test('TC-H-04: Cancel/close the drawer discards changes without saving', async ({ page }) => {
    await hierarchyPage.treeCompanyNode.click();
    await hierarchyPage.treeProjectNode.click();
    await hierarchyPage.addSiteBtn.click();

    await expect(hierarchyPage.drawer).toBeVisible();

    // Fill in a name but then cancel
    await hierarchyPage.nameInput.fill('Discarded Site');

    // Press Escape or click Cancel/Close button
    await page.keyboard.press('Escape');

    // Drawer should close
    await expect(hierarchyPage.drawer).toBeHidden({ timeout: 3000 });

    // The site should NOT appear in the tree
    await expect(page.getByRole('button', { name: /Discarded Site/i })).toBeHidden();
  });

  test('TC-H-05: Active toggle can be disabled when adding a site', async ({ page }) => {
    await hierarchyPage.treeCompanyNode.click();
    await hierarchyPage.treeProjectNode.click();
    await hierarchyPage.addSiteBtn.click();

    await expect(hierarchyPage.drawer).toBeVisible();

    // Toggle 'Active' off
    await hierarchyPage.activeToggle.uncheck();
    await expect(hierarchyPage.activeToggle).not.toBeChecked();
  });

  // ─── NEGATIVE ──────────────────────────────────────────────────────────────

  test('TC-H-06: Location Code rejects input longer than 5 characters', async ({ page }) => {
    await hierarchyPage.treeProjectNode.click();
    await hierarchyPage.addSiteBtn.click();

    await hierarchyPage.locationCodeInput.fill('ABCDEFG'); // 7 chars

    const value = await hierarchyPage.locationCodeInput.inputValue();
    expect(value.length).toBeLessThanOrEqual(5);
  });

  test('TC-H-07: Add Site button is hidden when no project node is selected', async ({ page }) => {
    // On initial load, no node is selected — addSiteBtn should not be present
    await expect(hierarchyPage.addSiteBtn).toBeHidden();
  });

  test('TC-H-08: Save button is blocked if Name field is empty', async ({ page }) => {
    await hierarchyPage.treeCompanyNode.click();
    await hierarchyPage.treeProjectNode.click();
    await hierarchyPage.addSiteBtn.click();

    await expect(hierarchyPage.drawer).toBeVisible();

    // Leave Name empty, fill location code only
    await hierarchyPage.locationCodeInput.fill('LOC01');

    // Try to save
    await hierarchyPage.saveBtn.click();

    // Should still be in the drawer (form not submitted)
    await expect(hierarchyPage.drawer).toBeVisible();
  });

  test('TC-H-09: Tree node expands to show children on click', async ({ page }) => {
    // Click company node to expand
    await hierarchyPage.treeCompanyNode.click();

    // Project node should now appear
    await expect(hierarchyPage.treeProjectNode).toBeVisible();
  });
});
