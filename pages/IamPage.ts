import { Page, Locator } from '@playwright/test';
import { SidebarComponent } from './SidebarComponent';

export class IamPage {
  readonly page: Page;
  readonly sidebar: SidebarComponent;
  readonly roleMatrixTab: Locator;
  readonly employeeMasterTab: Locator;
  readonly systemUsersTab: Locator;
  readonly addRoleTierBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = new SidebarComponent(page);
    this.roleMatrixTab = page.locator('button').filter({ hasText: '1. ROLE MATRIX (RBAC)' });
    this.employeeMasterTab = page.locator('button').filter({ hasText: '2. EMPLOYEE MASTER' });
    this.systemUsersTab = page.locator('button').filter({ hasText: '3. SYSTEM USERS' });
    this.addRoleTierBtn = page.locator('button').filter({ hasText: 'ADD NEW ROLE TIER' });
  }

  async navigate() {
    await this.page.goto('/iam');
  }
}
