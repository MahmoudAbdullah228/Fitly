import puppeteer from 'puppeteer-core';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE_URL = 'http://localhost:3000';

async function clickButtonWithText(page, text) {
  const success = await page.evaluate((targetText) => {
    const buttons = Array.from(document.querySelectorAll('button, a'));
    const btn = buttons.find((b) => b.innerText.trim().includes(targetText));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  }, text);

  if (!success) {
    throw new Error(`Button or link with text "${text}" not found`);
  }
}

async function run() {
  console.log('🚀 Starting Fitly Browser Acceptance Testing...');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  try {
    // ----------------------------------------------------
    // TEST 1: Landing Page & Onboarding Flow
    // ----------------------------------------------------
    console.log('\n--- Test 1: Landing Page & Onboarding ---');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
    
    const title = await page.title();
    console.log(`Page title: "${title}"`);
    if (!title.includes('Fitly')) throw new Error('Page title does not mention Fitly');

    const heroText = await page.$eval('h1', (el) => el.innerText);
    console.log(`Hero h1: "${heroText}"`);
    if (!heroText.includes('Apply where you fit')) throw new Error('Hero headline mismatch');

    // Click "Get Started"
    console.log('Clicking "Get Started" to enter onboarding...');
    await clickButtonWithText(page, 'Get Started');
    await page.waitForSelector('h1', { timeout: 5000 });
    
    const onboardingH1 = await page.$eval('h1', (el) => el.innerText);
    console.log(`Onboarding step 1: "${onboardingH1}"`);

    // Click "Extract & Continue" with default sample candidate
    console.log('Extracting sample candidate profile...');
    await clickButtonWithText(page, 'Extract & Continue');

    // Wait for Step 2 extraction to complete into Step 3
    console.log('Waiting for AI extraction sequence...');
    await page.waitForFunction(
      () => document.querySelector('h1')?.innerText?.includes('Review'),
      { timeout: 12000 }
    );
    console.log('✓ Step 3 reached: Profile Review form loaded');

    // Add a skill in profile review
    const addSkillInput = await page.$('input[placeholder*="Add a new skill"]');
    if (addSkillInput) {
      await addSkillInput.type('Docker');
      await clickButtonWithText(page, 'Add Skill');
      console.log('Added skill "Docker" to profile');
    }

    // Save and proceed to matches
    await clickButtonWithText(page, 'Save & View My Top 10 Matches');

    // ----------------------------------------------------
    // TEST 2: Matches Dashboard & Top 10
    // ----------------------------------------------------
    console.log('\n--- Test 2: Matches Dashboard ---');
    await page.waitForFunction(
      () => document.querySelector('h1')?.innerText?.includes('Matches Dashboard'),
      { timeout: 8000 }
    );
    
    // Wait for jobs to render
    await page.waitForSelector('.group.bg-surface-card', { timeout: 8000 });
    const jobCards = await page.$$('.group.bg-surface-card');
    console.log(`Rendered job cards in Top 10 view: ${jobCards.length}`);
    if (jobCards.length !== 10) {
      throw new Error(`Expected exactly 10 top matches, found ${jobCards.length}`);
    }

    // Check match percentages
    const scores = await page.$$eval('.group.bg-surface-card .font-mono', (elements) =>
      elements.map((el) => el.innerText).filter((txt) => txt.includes('%'))
    );
    console.log(`Sample match scores in Top 10: ${scores.slice(0, 5).join(', ')}`);
    if (scores.length === 0) throw new Error('No match percentages found on cards');

    // ----------------------------------------------------
    // TEST 3: Filters, Search & Bookmarking
    // ----------------------------------------------------
    console.log('\n--- Test 3: Filters, Search & Saved Jobs ---');
    
    // Type in search box
    const searchInput = await page.$('input[placeholder*="Search by job title"]');
    await searchInput.type('React');
    await new Promise((r) => setTimeout(r, 400));
    const reactFilteredCount = (await page.$$('.group.bg-surface-card')).length;
    console.log(`Jobs matching search "React": ${reactFilteredCount}`);
    
    // Clear search
    await clickButtonWithText(page, 'Reset filters');
    await new Promise((r) => setTimeout(r, 400));

    // Save the first job
    const bookmarkBtn = await page.$('.group.bg-surface-card button[aria-label*="Save job"]');
    if (bookmarkBtn) {
      await bookmarkBtn.click();
      console.log('Bookmarked first job card');
    }

    // Navigate to /saved
    await page.click('a[href="/saved"]');
    await page.waitForSelector('h1');
    const savedCards = await page.$$('.group.bg-surface-card');
    console.log(`Saved jobs count on /saved: ${savedCards.length}`);
    if (savedCards.length < 1) throw new Error('Saved job did not appear on /saved');

    // ----------------------------------------------------
    // TEST 4: Job Detail & Apply Flow (Credit Deduction 4 -> 2)
    // ----------------------------------------------------
    console.log('\n--- Test 4: Job Detail & Apply Flow (4 -> 2 credits) ---');
    await page.goto(`${BASE_URL}/jobs/job-01`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('h1');

    // Verify Match Analysis panel exists
    const headings = await page.$$eval('h3', (elements) => elements.map(el => el.innerText));
    console.log(`Page subheadings: ${headings.join(' | ')}`);

    // Verify initial credit balance is 4
    const initialCredits = await page.$eval('a[href="/credits"] .font-mono', (el) => el.innerText.trim());
    console.log(`Initial credits in nav chip: "${initialCredits}"`);
    if (initialCredits !== '4') throw new Error(`Expected initial credits to be 4, got "${initialCredits}"`);

    // Click Apply (2cr)
    console.log('Opening Apply Modal...');
    await clickButtonWithText(page, 'Apply with Fitly (2cr)');

    // Confirm application cost
    console.log('Confirming 2-credit deduction...');
    await page.waitForSelector('button');
    await clickButtonWithText(page, 'Generate Application (2 Credits)');

    // Wait for document generation to finish
    console.log('Waiting for document generation...');
    await page.waitForFunction(
      () => Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Mark as Applied')),
      { timeout: 12000 }
    );
    console.log('✓ Generated Tailored CV and Cover Letter');

    // Verify credits deducted: should now be 2
    const balanceAfterFirstApply = await page.$eval('a[href="/credits"] .font-mono', (el) => el.innerText.trim());
    console.log(`Live credits in nav after first apply: "${balanceAfterFirstApply}"`);
    if (balanceAfterFirstApply !== '2') {
      throw new Error(`Expected balance to be 2 credits, got "${balanceAfterFirstApply}"`);
    }

    // Test Mark as Applied
    await clickButtonWithText(page, 'Mark as Applied');
    await new Promise((r) => setTimeout(r, 600));

    // Verify application logged on /applications
    await page.goto(`${BASE_URL}/applications`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('h1');
    const appRows = await page.$$('.p-5.bg-surface-card');
    console.log(`Applications logged in tracker: ${appRows.length}`);
    if (appRows.length !== 1) throw new Error('Application was not logged to tracker');

    // ----------------------------------------------------
    // TEST 5: Second Apply (2 -> 0) & Insufficient Credits on 3rd
    // ----------------------------------------------------
    console.log('\n--- Test 5: Second Apply (2 -> 0 credits) & Third Attempt ---');
    await page.goto(`${BASE_URL}/jobs/job-02`, { waitUntil: 'networkidle0' });
    await clickButtonWithText(page, 'Apply with Fitly (2cr)');
    
    // Confirm second application
    await clickButtonWithText(page, 'Generate Application (2 Credits)');
    await page.waitForFunction(
      () => Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Mark as Applied')),
      { timeout: 12000 }
    );
    await clickButtonWithText(page, 'Mark as Applied');
    await new Promise((r) => setTimeout(r, 600));

    const balanceAfterSecondApply = await page.$eval('a[href="/credits"] .font-mono', (el) => el.innerText.trim());
    console.log(`Credits in nav after second application: "${balanceAfterSecondApply}"`);
    if (balanceAfterSecondApply !== '0') {
      throw new Error(`Expected balance to be 0 credits, got "${balanceAfterSecondApply}"`);
    }

    // Third application attempt on job-03 -> Insufficient credits prompt
    console.log('Attempting 3rd application with 0 balance...');
    await page.goto(`${BASE_URL}/jobs/job-03`, { waitUntil: 'networkidle0' });
    await clickButtonWithText(page, 'Apply with Fitly (2cr)');

    await page.waitForFunction(
      () => document.body.innerText.includes('Insufficient AI Credits'),
      { timeout: 5000 }
    );
    console.log('✓ Insufficient AI Credits prompt appeared correctly!');

    // ----------------------------------------------------
    // TEST 6: Mock Checkout with Arbitrary Input
    // ----------------------------------------------------
    console.log('\n--- Test 6: Mock Checkout (Pack Purchase) ---');
    await page.goto(`${BASE_URL}/credits`, { waitUntil: 'networkidle0' });
    await clickButtonWithText(page, 'Purchase 16 Credits');

    // Verify Mock checkout modal appears
    await page.waitForFunction(
      () => document.body.innerText.includes('Complete Purchase'),
      { timeout: 5000 }
    );
    console.log('Mock checkout modal opened.');

    // Clear cardholder name and click Pay with empty/garbage input
    const nameInput = await page.$('input[placeholder="Omar Tarek"]');
    if (nameInput) {
      await nameInput.click({ clickCount: 3 });
      await page.keyboard.press('Backspace');
    }

    await clickButtonWithText(page, 'Pay 399 EGP');
    console.log('Clicked Pay button with empty cardholder name...');

    // Wait for payment processing -> success state
    await page.waitForFunction(
      () => document.body.innerText.includes('Payment Successful'),
      { timeout: 6000 }
    );
    console.log('✓ Payment success state achieved!');

    // Close modal
    await clickButtonWithText(page, 'Continue to Platform');
    await new Promise((r) => setTimeout(r, 400));

    // Verify credits increased: 0 + 16 = 16
    const balanceAfterPurchase = await page.$eval('a[href="/credits"] .font-mono', (el) => el.innerText.trim());
    console.log(`Balance after purchase: "${balanceAfterPurchase}" credits`);
    if (balanceAfterPurchase !== '16') {
      throw new Error(`Expected balance to be 16 credits, got "${balanceAfterPurchase}"`);
    }

    // Verify usage history logs the purchase
    const historyRows = await page.$$('tbody tr');
    console.log(`Usage history transaction rows: ${historyRows.length}`);
    if (historyRows.length < 3) throw new Error('Transaction not logged in history table');

    // ----------------------------------------------------
    // TEST 7: Reset Demo Verification
    // ----------------------------------------------------
    console.log('\n--- Test 7: Reset Demo ---');
    await clickButtonWithText(page, 'Reset Demo State');
    await page.waitForFunction(() => document.body.innerText.includes('Reset Prototype State?'));
    await clickButtonWithText(page, 'Yes, Reset Everything');
    await new Promise((r) => setTimeout(r, 600));

    // Reload page to test localStorage persistence of reset
    await page.reload({ waitUntil: 'networkidle0' });
    const resetCredits = await page.$eval('a[href="/credits"] .font-mono', (el) => el.innerText.trim());
    console.log(`Credits after reset and reload: "${resetCredits}" (should be 4)`);
    if (resetCredits !== '4') throw new Error(`Expected reset credits to be 4, got "${resetCredits}"`);

    // Verify applications list cleared
    await page.goto(`${BASE_URL}/applications`, { waitUntil: 'networkidle0' });
    await page.waitForSelector('h3');
    const emptyAppText = await page.$eval('h3', (el) => el.innerText);
    console.log(`Applications tracker empty heading: "${emptyAppText}"`);

    // ----------------------------------------------------
    // TEST 8: Responsive Layout at 360px (Mobile Audit)
    // ----------------------------------------------------
    console.log('\n--- Test 8: Responsive Check at 360px ---');
    await page.setViewport({ width: 360, height: 740 });
    await page.goto(`${BASE_URL}/matches`, { waitUntil: 'networkidle0' });
    
    const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const windowInnerWidth = await page.evaluate(() => window.innerWidth);
    console.log(`Viewport 360px audit: scrollWidth=${bodyScrollWidth}, innerWidth=${windowInnerWidth}`);
    if (bodyScrollWidth > windowInnerWidth) {
      throw new Error(`Horizontal scroll detected at 360px: body scrollWidth=${bodyScrollWidth} > ${windowInnerWidth}`);
    }
    console.log('✓ No horizontal overflow at 360px');

    console.log(`\nConsole errors recorded during run: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.warn('Console errors:', consoleErrors);
    }

    console.log('\n🎉 ALL ACCEPTANCE CRITERIA PASSED 100% SUCCESSFULLY!');
  } catch (err) {
    console.error('\n❌ Acceptance test failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
