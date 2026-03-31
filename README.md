# FaceLink Playwright QA Automation

## Introduction
This repository contains the end-to-end (E2E) UI test automation framework for the FaceLink POC application (`https://facelink-poc.cultive8.lk`).
It utilizes **Playwright** paired with the **Page Object Model (POM)** design pattern for robust, maintainable UI testing.

---

## 🚀 How to Run the Tests

### Prerequisite 
Make sure you have Node.js installed on your computer.

### Step 1: Open Terminal
Open your terminal (Command Prompt, PowerShell, or VS Code Terminal) and ensure you are in the `Test Automation` directory:
\`\`\`bash
cd "C:\\Users\\dunit\\Desktop\\Test Automation"
\`\`\`

### Step 2: Install Dependencies
If you have just cloned this project, or haven't run it yet, install the required packages:
\`\`\`bash
npm install
\`\`\`

### Step 3: Run the Tests
You have three distinct ways to run the tests depending on your preference:

#### Option A: UI Mode (Recommended for Development)
This opens a beautiful visual application where you can click to run every test, see everything happen live in a browser, and step through the timeline easily.
\`\`\`bash
npx playwright test --ui
\`\`\`

#### Option B: Headed Mode (Visual Run without UI Player)
This will open up an actual Google Chrome window and automate the tests visibly on your screen, but run them back-to-back quickly.
\`\`\`bash
npx playwright test --headed
\`\`\`

#### Option C: Headless Mode (Invisible)
This is the fastest method. Testing will run completely in the background without stealing your screen focus. Results will print to your terminal.
\`\`\`bash
npx playwright test
\`\`\`

---

## 📊 Viewing the Test Report
After running the tests in Headless or Headed mode (Options B and C), Playwright generates a detailed HTML report (which you can also use to view error traces if anything fails).

To open the report server, run:
\`\`\`bash
npx playwright show-report
\`\`\`

---

## 📁 Project Structure

- **\`/tests\`**: Contains all the test specs (e.g., \`login.spec.ts\`, \`iam.spec.ts\`, etc.). This is where Playwright looks for files to run.
- **\`/pages\`**: Contains the Page Object Models. We encapsulate page-specific locators (IDs, buttons, tabs) here so tests remain clean and highly readable.
- **\`playwright.config.ts\`**: The global configuration. It dictates the environments, browsers (Chromium), timeouts, and default \`baseURL\` used by every test.
- **\`package.json\`**: Defines the dependencies like \`@playwright/test\` and standard NPM scripts.
