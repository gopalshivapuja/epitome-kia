import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

async function scrapeLegacySite() {
  try {
    const response = await fetch('https://epitomekia.in/');
    const html = await response.text();
    const $ = cheerio.load(html);

    // 1. Extract "Our Story" / About Us
    // Adjust selector based on actual site structure (usually in a section with 'about' or 'story' id/class)
    // Fallback to searching for specific text if ID is unknown
    let aboutText = '';
    $('p').each((i, el) => {
        const text = $(el).text().trim();
        if (text.includes('Epitome Automobiles') && text.length > 100) {
            aboutText += text + '\n\n';
        }
    });

    // 2. Extract Contact / Location Info
    const contactInfo = {
        address: '',
        phone: '',
        email: ''
    };
    
    // Naive heuristic for contact info
    $('body').text().split('\n').forEach(line => {
        if (line.includes('+91') && !contactInfo.phone) contactInfo.phone = line.trim();
        if (line.includes('@epitomekia') && !contactInfo.email) contactInfo.email = line.trim();
    });

    // 3. Logo URL
    const logoUrl = $('img[alt*="logo" i], img[src*="logo" i]').attr('src');

    const data = {
        aboutText: aboutText.trim() || "Epitome Automobiles Private Limited is an authorized Kia dealer...",
        contactInfo,
        logoUrl: logoUrl ? (logoUrl.startsWith('http') ? logoUrl : `https://epitomekia.in/${logoUrl}`) : null
    };

    console.log(JSON.stringify(data, null, 2));
    
    // Save to a temp file for the agent to read
    fs.writeFileSync('legacy_content.json', JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('Scraping failed:', error);
  }
}

scrapeLegacySite();
