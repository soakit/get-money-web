import axios from 'axios';
import * as cheerio from 'cheerio';
import { saveSettlement } from '../utils.js';

export async function scrapeClassActionRebates() {
  console.log("[ClassActionRebates] Starting...");
  try {
    const response = await axios.get('https://classactionrebates.com/');
    const $ = cheerio.load(response.data);

    const links = [];
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.startsWith('https://classactionrebates.com/settlements/') && href !== 'https://classactionrebates.com/settlements/') {
        links.push(href);
      }
    });

    const uniqueLinks = [...new Set(links)].slice(0, 5); // Limit to 5 for now
    console.log(`[ClassActionRebates] Found ${uniqueLinks.length} settlements to process.`);

    for (const url of uniqueLinks) {
      try {
        const res = await axios.get(url);
        const $page = cheerio.load(res.data);
        
        const title = $page('h1').text().trim() || "Unknown Settlement";
        const description = $page('p').first().text().trim() || "No description available.";
        
        const bodyText = $page('body').text();
        const hasNoProof = bodyText.toLowerCase().includes('no proof required') || bodyText.toLowerCase().includes('without proof');
        
        const dateMatch = bodyText.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}, \d{4}/i);
        const deadline = dateMatch ? new Date(dateMatch[0]).toISOString() : null;

        const amountMatch = bodyText.match(/\$\d+(\.\d{2})?/);
        const amount = amountMatch ? `Up to ${amountMatch[0]}` : "Varies";

        saveSettlement({
          title,
          description,
          amount,
          deadline,
          noProofRequired: hasNoProof,
          officialUrl: url
        });

      } catch (err) {
        console.error(`[ClassActionRebates] Failed to process ${url}:`, err.message);
      }
    }
  } catch (error) {
    console.error("[ClassActionRebates] Fatal error:", error);
  }
}
