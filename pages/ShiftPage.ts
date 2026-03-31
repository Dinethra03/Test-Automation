import { Page, Locator } from '@playwright/test';
import { SidebarComponent } from './SidebarComponent';

export class ShiftPage {
  readonly page: Page;
  readonly sidebar: SidebarComponent;
  readonly categoryTabGen1: Locator;
  readonly categoryTabGen2: Locator;
  readonly categoryTabSup1: Locator;
  readonly categoryTabMan1: Locator;
  
  // Aliases used in tests
  readonly el0: Locator;
  readonly el1: Locator;
  readonly el2: Locator;
  readonly el3: Locator;

  readonly preOtTimePicker: Locator;
  readonly startShiftTimePicker: Locator;
  readonly endShiftTimePicker: Locator;
  readonly postOtTimePicker: Locator;
  readonly inGraceInput: Locator;
  readonly outGraceInput: Locator;
  readonly mondayCheckbox: Locator;
  readonly saveRulesBtn: Locator;
  readonly discardChangesBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = new SidebarComponent(page);
    
    // Correct labels based on UI inspection (Regex handles UI text correctly)
    this.categoryTabGen1 = page.getByRole('tab', { name: /Gen1 \(Executive\)/i });
    this.categoryTabGen2 = page.getByRole('tab', { name: /Gen2 \(Exec Alt\)/i });
    this.categoryTabSup1 = page.getByRole('tab', { name: /Sup1 \(Supervisory\)/i });
    this.categoryTabMan1 = page.getByRole('tab', { name: /Man1 \(Manual Labor\)/i });

    // Assign aliases for static tests that might be expecting these property names
    this.el0 = this.categoryTabGen1;
    this.el1 = this.categoryTabGen2;
    this.el2 = this.categoryTabSup1;
    this.el3 = this.categoryTabMan1;

    this.preOtTimePicker = page.getByText('Pre-OT Starts At');
    this.startShiftTimePicker = page.getByText('Official Shift Start');
    this.endShiftTimePicker = page.getByText('Official Shift End');
    this.postOtTimePicker = page.getByText('Post-OT Starts At');
    
    // Updated to match 'spinbutton' role which labels these grace period inputs in MUI
    this.inGraceInput = page.getByRole('spinbutton', { name: /In-Time Grace Period/i });
    this.outGraceInput = page.getByRole('spinbutton', { name: /Out-Time Grace Period/i });
    
    this.mondayCheckbox = page.getByRole('checkbox', { name: 'Monday' });
    
    // Dynamic text on buttons
    this.saveRulesBtn = page.getByRole('button', { name: /Save .* Rules/i });
    this.discardChangesBtn = page.getByRole('button', { name: /Discard/i });
  }

  async navigate() {
    await this.page.goto('/shift-configurator');
  }
}
