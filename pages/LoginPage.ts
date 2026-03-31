import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInBtn: Locator;
  readonly errorMessage: Locator;
  readonly passwordVisibilityToggle: Locator;
  readonly titleHeader: Locator;
  readonly subtitleHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.signInBtn = page.getByRole('button', { name: 'Sign In' });
    this.errorMessage = page.locator('.MuiAlert-message');
    this.passwordVisibilityToggle = page.locator('button.MuiIconButton-edgeEnd').first();
    this.titleHeader = page.getByText('Welcome back', { exact: true });
    this.subtitleHeader = page.getByText('Sign in to continue to your workspace', { exact: true });
  }

  async navigate() {
    await this.page.goto('/login');
  }

  async login(username?: string, password?: string) {
    if (username) await this.usernameInput.fill(username);
    if (password) await this.passwordInput.fill(password);
    await this.signInBtn.click();
  }

  async togglePasswordVisibility() {
    await this.passwordVisibilityToggle.click();
  }
}
