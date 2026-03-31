import { Page, Locator } from '@playwright/test';
import { SidebarComponent } from './SidebarComponent';

export class HierarchyPage {
  readonly page: Page;
  readonly sidebar: SidebarComponent;
  readonly treeCompanyNode: Locator;
  readonly treeProjectNode: Locator;
  readonly treeSiteNode: Locator;
  readonly addProjectBtn: Locator;
  readonly addSiteBtn: Locator;
  readonly companyBtn: Locator;
  readonly groupNode: Locator;
  readonly drawer: Locator;
  readonly nameInput: Locator;
  readonly locationCodeInput: Locator;
  readonly costCenterInput: Locator;
  readonly activeToggle: Locator;
  readonly saveBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.sidebar = new SidebarComponent(page);
    
    // Exact mapping for Hayley's environment
    this.treeCompanyNode = page.getByRole('button', { name: "Hayley's Engineering (Pvt) Ltd" });
    this.treeProjectNode = page.getByRole('button', { name: "Metro Line Extension — Phase 2" });
    this.treeSiteNode = page.getByRole('button', { name: /Station A — Underground Works/i });
    
    // Action Buttons
    this.addProjectBtn = page.getByRole('button', { name: /Add Project to/i });
    this.addSiteBtn = page.getByRole('button', { name: /Add Site to/i });
    
    // UI controls
    this.companyBtn = page.getByRole('button', { name: 'Company', exact: true });
    this.groupNode = this.treeCompanyNode;
    
    this.drawer = page.locator('.MuiDrawer-paper, [role="presentation"]').first();
    this.nameInput = page.getByLabel(/Name/i);
    this.locationCodeInput = page.getByLabel(/Location Code/i);
    this.costCenterInput = page.getByLabel(/Cost Center/i);
    this.activeToggle = page.getByRole('checkbox').first();
    this.saveBtn = page.getByRole('button', { name: /Save/i }).first();
  }

  async navigate() {
    await this.page.goto('/hierarchy');
  }
}
