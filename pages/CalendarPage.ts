import { Page, Locator } from '@playwright/test';
import { SidebarComponent } from './SidebarComponent';

export class CalendarPage {
  readonly page: Page;
  readonly sidebar: SidebarComponent;
  readonly el0: Locator;
  readonly el1: Locator;
  readonly el2: Locator;
  readonly el3: Locator;
  readonly el4: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = new SidebarComponent(page);
    this.el0 = page.locator(':text-is("Normal Working Day"), :text("Normal Working Day"), [aria-label*="Normal Working Day"]').first();
    this.el1 = page.locator(':text-is("Poya Day"), :text("Poya Day"), [aria-label*="Poya Day"]').first();
    this.el2 = page.locator(':text-is("Company Holiday"), :text("Company Holiday"), [aria-label*="Company Holiday"]').first();
    this.el3 = page.locator(':text-is("Statutory Holiday"), :text("Statutory Holiday"), [aria-label*="Statutory Holiday"]').first();
    this.el4 = page.locator(':text-is("PUBLISH UPDATES"), :text("PUBLISH UPDATES"), [aria-label*="PUBLISH UPDATES"]').first();
  }

  async navigate() {
    await this.page.goto('/calendar');
  }
}
