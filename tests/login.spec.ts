import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('FaceLink Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should load the login page correctly', async ({ page }) => {
    // Verify headers and titles
    await expect(loginPage.titleHeader).toBeVisible();
    await expect(loginPage.subtitleHeader).toBeVisible();

    // Verify inputs and buttons are loaded
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.signInBtn).toBeVisible();
  });

  test('should successfully log in with mock credentials', async ({ page }) => {
    // Enter credentials
    await loginPage.login();
    
    // Wait for the URL to change to the dashboard
    // Based on the subagent\'s observations, the mock service worker bypasses auth and goes to dashboard
    await page.waitForURL('**/dashboard');
    expect(page.url()).toContain('/dashboard');
  });

  test('should log in bypassing credentials (allowed by mock backend)', async ({ page }) => {
    // Simply click sign in - the MSW allows empty credentials
    await loginPage.login();
    
    // Expected to go to dashboard based on previous testing
    await page.waitForURL('**/dashboard');
    expect(page.url()).toContain('/dashboard');
  });

  test('should toggle password visibility', async ({ page }) => {
    // Fill the password input
    await loginPage.passwordInput.fill('mySecretPassword');
    
    // Check initial state (should be type="password")
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    
    // Click the toggle button
    await loginPage.togglePasswordVisibility();
    
    // Verify the type changes to text
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
    
    // Click again to hide
    await loginPage.togglePasswordVisibility();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });
});
