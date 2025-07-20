// sumTables.js
const { chromium } = require('playwright');

(async () => {
  // 1️⃣ list out all the URLs you need to scrape:
  const baseURL = 'https://sanand0.github.io/tdsdata/js_table/?seed=';
  const seeds = [63, 64, 65, 66, 67, 68, 69, 70, 71, 72];
  const urls = seeds.map(seed => `${baseURL}${seed}`);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  let grandTotal = 0;

  for (const url of urls) {
    await page.goto(url, { waitUntil: 'networkidle' });
    // grab all numbers from all table cells
    const numbers = await page.$$eval('table td', tds =>
      tds.map(td => {
        const match = td.innerText.replace(/,/g, '').match(/-?\d+(\.\d+)?/);
        return match ? parseFloat(match[0]) : 0;
      })
    );
    const subtotal = numbers.reduce((a, b) => a + b, 0);
    console.log(`Page ${url} subtotal:`, subtotal);
    grandTotal += subtotal;
  }

  console.log('🔥 GRAND TOTAL:', grandTotal);
  await browser.close();
})();

