import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

// Helper to convert title to slug
const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

async function scrapeSettlements() {
  console.log("Starting scraper for ClassActionRebates...");
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
    console.log(`Found ${uniqueLinks.length} settlements to process.`);

    const outputDir = path.join(process.cwd(), 'src/content/settlements');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const url of uniqueLinks) {
      console.log(`Fetching ${url}...`);
      try {
        const res = await axios.get(url);
        const $page = cheerio.load(res.data);
        
        const title = $page('h1').text().trim() || "Unknown Settlement";
        const description = $page('p').first().text().trim() || "No description available.";
        
        // Basic heuristics to extract data
        const bodyText = $page('body').text();
        const hasNoProof = bodyText.toLowerCase().includes('no proof required') || bodyText.toLowerCase().includes('without proof');
        
        // Find a date using regex (e.g. MM/DD/YYYY or Month DD, YYYY)
        const dateMatch = bodyText.match(/(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2}, \d{4}/i);
        const deadlineDate = dateMatch ? new Date(dateMatch[0]) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default +30 days
        const deadlineStr = deadlineDate.toISOString();

        const amountMatch = bodyText.match(/\$\d+(\.\d{2})?/);
        const amount = amountMatch ? `Up to ${amountMatch[0]}` : "Varies";

        const slug = slugify(title);
        
        const mdContent = `---
title: "${title.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"').substring(0, 150)}..."
amount: "${amount}"
deadline: ${deadlineStr}
noProofRequired: ${hasNoProof}
officialUrl: "${url}"
---

${description}

[Read more and file a claim on the official site](${url})
`;
        
        fs.writeFileSync(path.join(outputDir, `${slug}.md`), mdContent);
        console.log(`Saved ${slug}.md`);

      } catch (err) {
        console.error(`Failed to process ${url}:`, err.message);
      }
    }

    console.log("Scraping completed successfully.");
  } catch (error) {
    console.error("Fatal error during scraping:", error);
    process.exit(1);
  }
}

scrapeSettlements();
