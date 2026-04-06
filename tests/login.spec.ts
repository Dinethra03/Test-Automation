import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// US 1.1 — Login: As a user, I want to securely log in to FaceLink with my credentials.

test.describe('US 1.1 — User Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  // ─── SMOKE ─────────────────────────────────────────────────────────────────

  test('TC-L-01: Login page renders all required elements', async ({ page }) => {
    await expect(loginPage.titleHeader).toBeVisible();
    await expect(loginPage.subtitleHeader).toBeVisible();
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.signInBtn).toBeVisible();
  });

  // ─── HAPPY PATH ────────────────────────────────────────────────────────────

  test('TC-L-02: Successful login with valid credentials redirects to dashboard', async ({ page }) => {
    await loginPage.login('admin', 'password');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    expect(page.url()).toContain('/dashboard');
  });

  // ─── FUNCTIONAL ────────────────────────────────────────────────────────────

  test('TC-L-03: Password visibility toggle switches input type between password and text', async ({ page }) => {
    await loginPage.passwordInput.fill('mySecretPassword');

    // Default state: hidden
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

    // Toggle visible
    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');

    // Toggle hidden again
    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  // ─── NEGATIVE ──────────────────────────────────────────────────────────────

  test('TC-L-04: Invalid credentials show an error message', async ({ page }) => {
    await loginPage.login('wronguser@example.com', 'WrongPassword123!');

    // The app should NOT redirect to dashboard
    await page.waitForTimeout(2000);
    expect(page.url()).not.toContain('/dashboard');

    // An error alert or message should appear
    const errorVisible =
      (await loginPage.errorMessage.isVisible().catch(() => false)) ||
      (await page.getByText(/invalid|incorrect|unauthorized|failed/i).isVisible().catch(() => false));

    expect(errorVisible).toBe(true);
  });

  test('TC-L-05: Clicking Sign In with empty username and password stays on login', async ({ page }) => {
    // Do NOT fill any credentials; just click Sign In
    await loginPage.signInBtn.click();
    await page.waitForTimeout(1500);

    // Should remain on login page
    expect(page.url()).toContain('/login');
  });

  test('TC-L-06: Clicking Sign In with only username and no password shows error or stays on page', async ({ page }) => {
    await loginPage.usernameInput.fill('admin@facelink.lk');
    // Leave password empty
    await loginPage.signInBtn.click();
    await page.waitForTimeout(1500);

    // Should not navigate away from login
    expect(page.url()).toContain('/login');
  });

  test('TC-L-07: Clicking Sign In with only password and no username shows error or stays on page', async ({ page }) => {
    await loginPage.passwordInput.fill('SomePassword!');
    // Leave username empty
    await loginPage.signInBtn.click();
    await page.waitForTimeout(1500);

    // Should not navigate away from login
    expect(page.url()).toContain('/login');
  });

  // ─── ACCESS CONTROL ────────────────────────────────────────────────────────

  test('TC-L-08: Unauthenticated access to /dashboard redirects back to /login', async ({ page }) => {
    // Navigate directly to dashboard WITHOUT logging in
    await page.goto('/dashboard');
    await page.waitForTimeout(2000);

    // Should be redirected to login
    expect(page.url()).toContain('/login');
  });

  test('TC-L-09: Unauthenticated access to /hierarchy redirects to /login', async ({ page }) => {
    await page.goto('/hierarchy');
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/login');
  });
});
