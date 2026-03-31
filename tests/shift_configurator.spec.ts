import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ShiftPage } from '../pages/ShiftPage';

test.describe('Feature 2.2: Shift & Roster Configurator (US 2.2)', () => {
  let shiftPage: ShiftPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login();
    await page.waitForURL('**/dashboard');
    
    shiftPage = new ShiftPage(page);
    await shiftPage.navigate();
    await page.waitForLoadState('networkidle');
  });

  test('Happy Path: Should successfully change shift rules', async ({ page }) => {
    await shiftPage.categoryTabGen1.click();
    
    // Change a rule - use focus and type/fill to ensure events fire
    await shiftPage.inGraceInput.click();
    await shiftPage.inGraceInput.fill('20');
    
    // Trigger blur or change detection
    await shiftPage.outGraceInput.click();
    
    await expect(shiftPage.saveRulesBtn).toBeEnabled();
    await shiftPage.saveRulesBtn.click();
    
    // Assert success via toast
    await expect(page.getByText(/Successfully/i)).toBeVisible();
  });

  test('Negative Case: Save button should remain disabled before any change', async ({ page }) => {
    await shiftPage.categoryTabMan1.click();
    // Wait for the specific tab content to be ready
    await expect(page.getByRole('button', { name: /Save Man1 Rules/i })).toBeDisabled();
  });

  test('Negative Case: Grace period should not exceed 60 minutes', async ({ page }) => {
    await shiftPage.inGraceInput.click();
    await shiftPage.inGraceInput.fill('75');
    
    // On some systems, validation triggers on blur
    await shiftPage.outGraceInput.click();
    
    // Check for validation error message
    // Based on Common MUI patterns, it might show a helper text
    await expect(page.locator('p.Mui-error, [role="alert"]')).toContainText(/max|60/i);
  });

  test('Negative Case: Should block saving if no working days are selected', async ({ page }) => {
    // Navigate to a specific tab
    await shiftPage.categoryTabGen1.click();
    
    // Find all checkboxes and uncheck them
    const checkboxes = page.getByRole('checkbox');
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
        if (await checkboxes.nth(i).isChecked()) {
            await checkboxes.nth(i).click(); // Click usually works better for custom MUI checkboxes
        }
    }
    
    await expect(shiftPage.saveRulesBtn).toBeDisabled();
  });
});
