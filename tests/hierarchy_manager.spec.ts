import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HierarchyPage } from '../pages/HierarchyPage';

test.describe('Feature 2.1: Hierarchy Manager (US 2.1)', () => {
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

  test('Happy Path: Should successfully add a new Site under a Project', async ({ page }) => {
    // 1. Expand tree and select a parent project
    // Note: Clicking the company and project text usually expands them in MUI if programmed to do so
    await hierarchyPage.treeCompanyNode.click();
    await hierarchyPage.treeProjectNode.click();
    
    // 2. Click contextual action button
    // It should appear on the right side once the project is active
    await hierarchyPage.addSiteBtn.click();
    
    // 3. Fill the registration drawer
    await expect(hierarchyPage.drawer).toBeVisible();
    await hierarchyPage.nameInput.fill('Site Delta');
    await hierarchyPage.locationCodeInput.fill('DEL01');
    await hierarchyPage.costCenterInput.fill('CC-88');
    
    // 4. Save and verify optimistic update
    await hierarchyPage.saveBtn.click();
    
    // Verify the site appears in the tree
    await expect(page.getByRole('button', { name: /Site Delta/i })).toBeVisible();
  });

  test('Negative Case: Location Code should reject more than 5 characters', async ({ page }) => {
    // Wait for the tree to load
    await hierarchyPage.treeProjectNode.click();
    await hierarchyPage.addSiteBtn.click();
    
    const locInput = hierarchyPage.locationCodeInput;
    await locInput.fill('ABCDEFG'); // 7 characters
    
    // Verify enforcement (either by value truncation or error validation)
    const value = await locInput.inputValue();
    // Some implementations truncate immediately, others show error on save
    // If it's a maxLength attribute:
    expect(value.length).toBeLessThanOrEqual(5);
  });

  test('Negative Case: Should prevent orphan site creation without project selection', async ({ page }) => {
    // On the initial load, no project is selected, so the Add Site button should not be present
    await expect(hierarchyPage.addSiteBtn).toBeHidden();
  });
});
