import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ShiftPage } from '../pages/ShiftPage';

// US 2.2 — Shift & Roster Configurator: As an admin, I want to configure shift rules per category.

test.describe('US 2.2 — Shift & Roster Configurator', () => {
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

  // ─── SMOKE ─────────────────────────────────────────────────────────────────

  test('TC-S-01: Shift page loads with all category tabs visible', async ({ page }) => {
    await expect(shiftPage.categoryTabGen1).toBeVisible();
    await expect(shiftPage.categoryTabGen2).toBeVisible();
    await expect(shiftPage.categoryTabSup1).toBeVisible();
    await expect(shiftPage.categoryTabMan1).toBeVisible();
  });

  test('TC-S-02: Time pickers are visible after selecting a category tab', async ({ page }) => {
    await shiftPage.categoryTabGen1.click();

    // All shift time boundary labels should be present
    await expect(shiftPage.preOtTimePicker).toBeVisible();
    await expect(shiftPage.startShiftTimePicker).toBeVisible();
    await expect(shiftPage.endShiftTimePicker).toBeVisible();
    await expect(shiftPage.postOtTimePicker).toBeVisible();
  });

  // ─── HAPPY PATH ────────────────────────────────────────────────────────────

  test('TC-S-03: Changing In-Grace period enables Save and shows success toast', async ({ page }) => {
    await shiftPage.categoryTabGen1.click();

    await shiftPage.inGraceInput.click();
    await shiftPage.inGraceInput.fill('20');

    // Trigger blur / change detection
    await shiftPage.outGraceInput.click();

    await expect(shiftPage.saveRulesBtn).toBeEnabled();
    await shiftPage.saveRulesBtn.click();

    await expect(page.getByText(/Successfully/i)).toBeVisible({ timeout: 5000 });
  });

  test('TC-S-04: Switching tabs loads the correct category rules', async ({ page }) => {
    // Start on Gen1
    await shiftPage.categoryTabGen1.click();
    await expect(shiftPage.categoryTabGen1).toHaveAttribute('aria-selected', 'true');

    // Switch to Man1
    await shiftPage.categoryTabMan1.click();
    await expect(shiftPage.categoryTabMan1).toHaveAttribute('aria-selected', 'true');
    await expect(shiftPage.categoryTabGen1).toHaveAttribute('aria-selected', 'false');
  });

  test('TC-S-05: Discard changes restores input to original value', async ({ page }) => {
    await shiftPage.categoryTabGen1.click();

    // Record original value
    const original = await shiftPage.inGraceInput.inputValue();

    // Make a change
    await shiftPage.inGraceInput.fill('55');
    await shiftPage.outGraceInput.click(); // trigger blur

    // Discard
    await shiftPage.discardChangesBtn.click();

    // Value should be restored (either by reset or page reload)
    await page.waitForTimeout(1000);
    const restored = await shiftPage.inGraceInput.inputValue();
    expect(restored).toBe(original);
  });

  // ─── NEGATIVE ──────────────────────────────────────────────────────────────

  test('TC-S-06: Save button stays disabled when no changes are made', async ({ page }) => {
    await shiftPage.categoryTabMan1.click();
    await expect(shiftPage.saveRulesBtn).toBeDisabled();
  });

  test('TC-S-07: Grace period exceeding 60 minutes shows a validation error', async ({ page }) => {
    await shiftPage.categoryTabGen1.click();
    await shiftPage.inGraceInput.click();
    await shiftPage.inGraceInput.fill('75');
    await shiftPage.outGraceInput.click(); // trigger blur

    await expect(page.locator('p.Mui-error, [role="alert"]')).toContainText(/max|60/i);
  });

  test('TC-S-08: Grace period of exactly 60 minutes is accepted (boundary)', async ({ page }) => {
    await shiftPage.categoryTabGen1.click();
    await shiftPage.inGraceInput.click();
    await shiftPage.inGraceInput.fill('60');
    await shiftPage.outGraceInput.click();

    // Save should be enabled (no validation error at boundary)
    await expect(shiftPage.saveRulesBtn).toBeEnabled();
    await expect(page.locator('p.Mui-error')).toBeHidden();
  });

  test('TC-S-09: Save is blocked when all working day checkboxes are unchecked', async ({ page }) => {
    await shiftPage.categoryTabGen1.click();

    // Uncheck all day checkboxes
    const checkboxes = page.getByRole('checkbox');
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      if (await checkboxes.nth(i).isChecked()) {
        await checkboxes.nth(i).click();
      }
    }

    await expect(shiftPage.saveRulesBtn).toBeDisabled();
  });

  // ─── NAVIGATION ────────────────────────────────────────────────────────────

  test('TC-S-10: Sidebar shift link navigates to shift configurator page', async ({ page }) => {
    // Navigate away first
    await page.goto('/dashboard');
    await shiftPage.sidebar.shiftLink.click();
    await page.waitForURL('**/shift-configurator');
    expect(page.url()).toContain('/shift-configurator');
  });
});
