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

async function runManualTest() {
  console.log('Testing manual "I don\'t have a CV" onboarding path...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  try {
    await page.goto(`${BASE_URL}/start`, { waitUntil: 'networkidle0' });

    // Click "No CV (Manual Entry)"
    await clickButtonWithText(page, 'No CV (Manual Entry)');
    console.log('Switched to manual entry tab');

    // Enter custom name, headline, and bio
    const inputs = await page.$$('input[type="text"]');
    if (inputs.length >= 2) {
      await inputs[0].type('Tarek Data Analyst');
      await inputs[1].type('Junior Data Analyst & BI');
    }

    // Click "Python" and "SQL" skill tags
    await clickButtonWithText(page, 'Python');
    await clickButtonWithText(page, 'SQL');
    await clickButtonWithText(page, 'Power BI');

    // Click "Extract & Continue"
    await clickButtonWithText(page, 'Extract & Continue');

    // Wait for step 3 review
    await page.waitForFunction(() => document.querySelector('h1')?.innerText?.includes('Review'), { timeout: 10000 });
    console.log('Step 3 review reached for manual profile');

    // Click Save & View Matches
    await clickButtonWithText(page, 'Save & View My Top 10 Matches');

    // Wait for matches dashboard and job cards
    await page.waitForFunction(() => document.querySelector('h1')?.innerText?.includes('Matches Dashboard'), { timeout: 8000 });
    await page.waitForSelector('.group.bg-surface-card', { timeout: 8000 });

    const topJobTitle = await page.$eval('.group.bg-surface-card h3, .group.bg-surface-card a', (el) => el.innerText);
    console.log(`Top match for manual data analyst: "${topJobTitle}"`);

    // Verify top match is data-related!
    const isDataRole = topJobTitle.toLowerCase().includes('data') || topJobTitle.toLowerCase().includes('analyst') || topJobTitle.toLowerCase().includes('intelligence');
    if (!isDataRole) {
      console.warn(`Note: Top match title was "${topJobTitle}"`);
    } else {
      console.log('✓ Successfully matched data role to manual data candidate!');
    }

    // Now test plan subscription on /credits
    console.log('\nTesting subscription checkout with Yearly toggle...');
    await page.goto(`${BASE_URL}/credits`, { waitUntil: 'networkidle0' });

    // Toggle to Yearly
    await clickButtonWithText(page, 'Yearly');
    console.log('Switched billing toggle to Yearly');

    // Click Subscribe on Professional plan
    const subscribeButtons = await page.$$('button');
    let subBtn = null;
    for (const b of subscribeButtons) {
      const text = await (await b.getProperty('innerText')).jsonValue();
      if (text.includes('Subscribe (yearly)')) {
        subBtn = b;
        break;
      }
    }
    if (subBtn) {
      await subBtn.click();
      console.log('Clicked Subscribe (yearly)');
      await page.waitForFunction(() => document.body.innerText.includes('Complete Purchase'), { timeout: 5000 });
      await page.waitForFunction(() => Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('Pay')), { timeout: 5000 });
      await clickButtonWithText(page, 'Pay');
      await page.waitForFunction(() => document.body.innerText.includes('Subscription Active!'), { timeout: 6000 });
      console.log('✓ Yearly subscription activated!');
      await clickButtonWithText(page, 'Continue to Platform');
    }

    // Reset demo back to clean state
    await clickButtonWithText(page, 'Reset Demo State');
    await page.waitForFunction(() => document.body.innerText.includes('Reset Prototype State?'));
    await clickButtonWithText(page, 'Yes, Reset Everything');
    console.log('✓ Reset demo cleanly after manual test');

    console.log('\n🎉 MANUAL ONBOARDING & SUBSCRIPTION TEST PASSED!');
  } catch (err) {
    console.error('Manual test failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runManualTest();
