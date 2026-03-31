import { Page, Locator } from '@playwright/test';
import { SidebarComponent } from './SidebarComponent';

export class WorkerDirPage {
  readonly page: Page;
  readonly sidebar: SidebarComponent;
  readonly el0: Locator;
  readonly el1: Locator;
  readonly el2: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = new SidebarComponent(page);
    this.el0 = page.locator(':text-is("INITIATE WEB ONBOARDING"), :text("INITIATE WEB ONBOARDING"), [aria-label*="INITIATE WEB ONBOARDING"]').first();
    this.el1 = page.locator(':text-is("VIEW PROFILE"), :text("VIEW PROFILE"), [aria-label*="VIEW PROFILE"]').first();
    this.el2 = page.locator(':text-is("RESUME DRAFT"), :text("RESUME DRAFT"), [aria-label*="RESUME DRAFT"]').first();
  }

  async navigate() {
    await this.page.goto('/worker-directory');
  }
}
