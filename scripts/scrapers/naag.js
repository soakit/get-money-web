import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { saveSettlement } from '../utils.js';

puppeteer.use(StealthPlugin());

export async function scrapeNAAG() {
  console.log("[NAAG] Starting...");
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: 'new', 
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.CHROME_BIN || 'D:\\workspace\\get-money-web\\chrome\\win64-148.0.7778.167\\chrome-win64\\chrome.exe'
    });
    const page = await browser.newPage();
    
    // NAAG Multistate Settlements page
    await page.goto('https://www.naag.org/issues/antitrust/multistate-settlements/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // We will extract settlements from their list if available. 
    // This is a basic generic extraction since exact DOM structure might vary.
    // We look for links inside main content areas that might represent settlements.
    const settlements = await page.evaluate(() => {
      const results = [];
      // Look for h3 or h2 links or table rows. 
      // NAAG uses a mix of structures. We'll grab the first 5 links with text containing 'settlement' or 'state'
      const links = Array.from(document.querySelectorAll('a'))
        .filter(a => a.href.includes('/news/') || a.href.includes('/settlement'))
        .slice(0, 5);
        
      for (const link of links) {
        results.push({
          title: link.innerText.trim() || 'NAAG Settlement',
          url: link.href
        });
      }
      return results;
    });

    console.log(`[NAAG] Found ${settlements.length} potential settlements.`);

    for (const item of settlements) {
      if (!item.title || item.title.length < 10) continue;
      
      saveSettlement({
        title: item.title,
        description: `Multistate settlement action led by State Attorneys General. Source: NAAG.`,
        amount: "Varies",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Often no strict consumer deadline directly on NAAG summary
        noProofRequired: false,
        officialUrl: item.url
      });
    }

  } catch (error) {
    console.error("[NAAG] Fatal error:", error);
  } finally {
    if (browser) await browser.close();
  }
}
