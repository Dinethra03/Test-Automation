import { Page, Locator } from '@playwright/test';

export class SidebarComponent {
  readonly page: Page;
  readonly dashboardLink: Locator;
  readonly iamLink: Locator;
  readonly hierarchyLink: Locator;
  readonly calendarLink: Locator;
  readonly shiftLink: Locator;
  readonly rateCardLink: Locator;
  readonly workerDirLink: Locator;
  readonly supplierRegLink: Locator;
  readonly allocationMgrLink: Locator;
  readonly attendanceBdLink: Locator;
  readonly rosterMatrixLink: Locator;
  readonly periodCloseLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // We use getByRole('link', { name: '...' }) which correctly matches the DOM structure shown in crawls
    this.dashboardLink = this.getSidebarItem('Dashboard');
    this.iamLink = this.getSidebarItem('Identity & Access');
    this.hierarchyLink = this.getSidebarItem('Hierarchy Manager');
    this.calendarLink = this.getSidebarItem('Calendar Manager');
    this.shiftLink = this.getSidebarItem('Shift Configurator');
    this.rateCardLink = this.getSidebarItem('Rate Card Manager');
    this.workerDirLink = this.getSidebarItem('Worker Directory');
    this.supplierRegLink = this.getSidebarItem('Supplier Registry');
    this.allocationMgrLink = this.getSidebarItem('Allocation Manager');
    this.attendanceBdLink = this.getSidebarItem('Attendance Board');
    this.rosterMatrixLink = this.getSidebarItem('Roster Matrix');
    this.periodCloseLink = this.getSidebarItem('Period Close');
  }

  private getSidebarItem(text: string) {
    // Looks for links within the sidebar area
    return this.page.getByRole('link', { name: text }).first();
  }
}
