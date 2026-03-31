import { Page, Locator } from '@playwright/test';
import { SidebarComponent } from './SidebarComponent';

export class PeriodClosePage {
  readonly page: Page;
  readonly sidebar: SidebarComponent;
  readonly el0: Locator;
  readonly el1: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = new SidebarComponent(page);
    this.el0 = page.locator(':text-is("LOCK PERIOD"), :text("LOCK PERIOD"), [aria-label*="LOCK PERIOD"]').first();
    this.el1 = page.locator(':text-is("DETAILS"), :text("DETAILS"), [aria-label*="DETAILS"]').first();
  }

  async navigate() {
    await this.page.goto('/period-close-dashboard');
  }
}
