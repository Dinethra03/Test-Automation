import { Page, Locator } from '@playwright/test';
import { SidebarComponent } from './SidebarComponent';

export class DashboardPage {
  readonly page: Page;
  readonly sidebar: SidebarComponent;
  readonly fullBoardBtn: Locator;
  readonly manageSuppliersBtn: Locator;
  readonly siteHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = new SidebarComponent(page);
    this.fullBoardBtn = page.locator('button').filter({ hasText: 'Full Board' });
    this.manageSuppliersBtn = page.locator('button').filter({ hasText: 'Manage Suppliers' });
    this.siteHeader = page.locator('th').filter({ hasText: 'Site' });
  }

  async navigate() {
    await this.page.goto('/dashboard');
  }
}
