import fs from 'fs';
import path from 'path';

export const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export function saveSettlement(settlement) {
  const { title, description, amount, deadline, noProofRequired, officialUrl } = settlement;
  
  // Expiration check
  if (deadline && new Date(deadline) < new Date()) {
    console.log(`Skipped ${officialUrl} - deadline has passed (${new Date(deadline).toDateString()})`);
    return false;
  }

  const slug = slugify(title);
  const outputDir = path.join(process.cwd(), 'src/content/settlements');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const filePath = path.join(outputDir, `${slug}.md`);
  
  if (fs.existsSync(filePath)) {
    console.log(`Skipped ${slug}.md - already exists in database.`);
    return false;
  }

  const deadlineStr = deadline ? new Date(deadline).toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  
  const mdContent = `---
title: "${title.replace(/"/g, '\\"')}"
description: "${description.replace(/"/g, '\\"').substring(0, 150)}..."
amount: "${amount}"
deadline: ${deadlineStr}
noProofRequired: ${noProofRequired}
officialUrl: "${officialUrl}"
---

${description}

[Read more and file a claim on the official site](${officialUrl})
`;
  
  fs.writeFileSync(filePath, mdContent);
  console.log(`Saved ${slug}.md`);
  return true;
}
