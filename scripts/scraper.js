import { scrapeClassActionRebates } from './scrapers/classActionRebates.js';
import { scrapeNAAG } from './scrapers/naag.js';
import { scrapeFTC } from './scrapers/ftc.js';

async function main() {
  console.log("Starting master scraping job...");
  
  // Run sequentially to avoid overwhelming system resources (especially with Puppeteer)
  await scrapeClassActionRebates();
  await scrapeNAAG();
  await scrapeFTC();
  
  console.log("Master scraping job completed.");
  process.exit(0);
}

main().catch(error => {
  console.error("Master job fatal error:", error);
  process.exit(1);
});
