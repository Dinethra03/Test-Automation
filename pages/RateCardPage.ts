import { Page, Locator } from '@playwright/test';
import { SidebarComponent } from './SidebarComponent';

export class RateCardPage {
  readonly page: Page;
  readonly sidebar: SidebarComponent;
  readonly el0: Locator;
  readonly el1: Locator;
  readonly el2: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = new SidebarComponent(page);
    this.el0 = page.locator(':text-is("STANDARD COMPANY RATES"), :text("STANDARD COMPANY RATES"), [aria-label*="STANDARD COMPANY RATES"]').first();
    this.el1 = page.locator(':text-is("DEPARTMENT SPECIFIC OVERRIDES"), :text("DEPARTMENT SPECIFIC OVERRIDES"), [aria-label*="DEPARTMENT SPECIFIC OVERRIDES"]').first();
    this.el2 = page.locator(':text-is("SAVE STANDARD RATES"), :text("SAVE STANDARD RATES"), [aria-label*="SAVE STANDARD RATES"]').first();
  }

  async navigate() {
    await this.page.goto('/rate-card');
  }
}
