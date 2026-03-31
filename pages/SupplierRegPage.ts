import { Page, Locator } from '@playwright/test';
import { SidebarComponent } from './SidebarComponent';

export class SupplierRegPage {
  readonly page: Page;
  readonly sidebar: SidebarComponent;
  readonly el0: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = new SidebarComponent(page);
    this.el0 = page.locator(':text-is("REGISTER SUPPLIER"), :text("REGISTER SUPPLIER"), [aria-label*="REGISTER SUPPLIER"]').first();
  }

  async navigate() {
    await this.page.goto('/supplier-registry');
  }
}
