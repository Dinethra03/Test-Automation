import { Page, Locator } from '@playwright/test';
import { SidebarComponent } from './SidebarComponent';

export class AttendanceBdPage {
  readonly page: Page;
  readonly sidebar: SidebarComponent;
  readonly el0: Locator;
  readonly el1: Locator;
  readonly el2: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = new SidebarComponent(page);
    this.el0 = page.locator(':text-is("EXCEPTIONS ONLY"), :text("EXCEPTIONS ONLY"), [aria-label*="EXCEPTIONS ONLY"]').first();
    this.el1 = page.locator(':text-is("SHOW ALL"), :text("SHOW ALL"), [aria-label*="SHOW ALL"]').first();
    this.el2 = page.locator(':text-is("RESOLVE"), :text("RESOLVE"), [aria-label*="RESOLVE"]').first();
  }

  async navigate() {
    await this.page.goto('/attendance-board');
  }
}
