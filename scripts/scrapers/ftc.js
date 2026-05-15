import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { saveSettlement } from '../utils.js';

puppeteer.use(StealthPlugin());

export async function scrapeFTC() {
  console.log("[FTC] Starting...");
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: 'new', 
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: process.env.CHROME_BIN || 'D:\\workspace\\get-money-web\\chrome\\win64-148.0.7778.167\\chrome-win64\\chrome.exe'
    });
    const page = await browser.newPage();
    
    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

    await page.goto('https://www.ftc.gov/enforcement/refunds', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Scrape FTC refunds
    const refunds = await page.evaluate(() => {
      const results = [];
      // FTC refund pages typically use tables or definition lists for cases
      const rows = document.querySelectorAll('.view-content .views-row');
      
      rows.forEach(row => {
        const titleEl = row.querySelector('.views-field-title a');
        if (!titleEl) return;
        
        const title = titleEl.innerText.trim();
        const url = titleEl.href;
        
        // Sometimes there's a short description or status
        const descEl = row.querySelector('.views-field-field-refund-status');
        const description = descEl ? descEl.innerText.trim() : "FTC Consumer Refund Program";

        results.push({ title, url, description });
      });
      return results;
    });

    console.log(`[FTC] Found ${refunds.length} refund programs.`);

    // If we didn't find any via `.views-row`, fallback to getting recent links
    if (refunds.length === 0) {
        console.log("[FTC] Trying fallback selector...");
        const fallbackRefunds = await page.evaluate(() => {
            const results = [];
            document.querySelectorAll('a').forEach(a => {
                if (a.href.includes('/enforcement/refunds/') && a.innerText.length > 10) {
                    results.push({ title: a.innerText.trim(), url: a.href, description: 'FTC Refund Program' });
                }
            });
            return results.slice(0, 5); // Limit
        });
        refunds.push(...fallbackRefunds);
        console.log(`[FTC] Fallback found ${refunds.length} refund programs.`);
    }

    const uniqueRefunds = Array.from(new Map(refunds.map(item => [item.url, item])).values()).slice(0, 5);

    for (const item of uniqueRefunds) {
      saveSettlement({
        title: item.title,
        description: item.description + '. The FTC returns money to consumers harmed by illegal business practices.',
        amount: "Varies",
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        noProofRequired: false,
        officialUrl: item.url
      });
    }

  } catch (error) {
    console.error("[FTC] Fatal error:", error);
  } finally {
    if (browser) await browser.close();
  }
}
