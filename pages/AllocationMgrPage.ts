import { Page, Locator } from '@playwright/test';
import { SidebarComponent } from './SidebarComponent';

export class AllocationMgrPage {
  readonly page: Page;
  readonly sidebar: SidebarComponent;
  readonly el0: Locator;
  readonly el1: Locator;
  readonly el2: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = new SidebarComponent(page);
    this.el0 = page.locator(':text-is("FIXED STAFF BOARD (MANUAL)"), :text("FIXED STAFF BOARD (MANUAL)"), [aria-label*="FIXED STAFF BOARD (MANUAL)"]').first();
    this.el1 = page.locator(':text-is("FLUID LABOR ROUTING (LIVE)"), :text("FLUID LABOR ROUTING (LIVE)"), [aria-label*="FLUID LABOR ROUTING (LIVE)"]').first();
    this.el2 = page.locator(':text-is("ALLOCATE"), :text("ALLOCATE"), [aria-label*="ALLOCATE"]').first();
  }

  async navigate() {
    await this.page.goto('/allocation-manager');
  }
}
