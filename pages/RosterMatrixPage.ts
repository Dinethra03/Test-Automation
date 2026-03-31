import { Page, Locator } from '@playwright/test';
import { SidebarComponent } from './SidebarComponent';

export class RosterMatrixPage {
  readonly page: Page;
  readonly sidebar: SidebarComponent;
  readonly el0: Locator;
  readonly el1: Locator;
  readonly el2: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = new SidebarComponent(page);
    this.el0 = page.locator(':text-is("PUBLISH CHANGES"), :text("PUBLISH CHANGES"), [aria-label*="PUBLISH CHANGES"]').first();
    this.el1 = page.locator(':text-is("M - Morning"), :text("M - Morning"), [aria-label*="M - Morning"]').first();
    this.el2 = page.locator(':text-is("N - Night"), :text("N - Night"), [aria-label*="N - Night"]').first();
  }

  async navigate() {
    await this.page.goto('/roster-matrix');
  }
}
