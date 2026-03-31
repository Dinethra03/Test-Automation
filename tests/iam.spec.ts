import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { IamPage } from '../pages/IamPage';

test.describe('FaceLink Identity & Access (IAM) Tests', () => {
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

  test('should correctly load the IAM tabs and controls', async ({ page }) => {
    // Basic structural checks
    await expect(iamPage.sidebar.iamLink).toBeVisible();
    
    // Check Tabs
    await expect(iamPage.roleMatrixTab).toBeVisible();
    await expect(iamPage.employeeMasterTab).toBeVisible();
    await expect(iamPage.systemUsersTab).toBeVisible();
    
    // Check main active elements
    await expect(iamPage.addRoleTierBtn).toBeVisible();
  });

  test('should navigate to Employee Master tab', async ({ page }) => {
    await iamPage.employeeMasterTab.click();
    await expect(iamPage.employeeMasterTab).toHaveAttribute('aria-selected', 'true');
  });
});
