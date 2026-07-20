import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  const urls = [
    'http://localhost:3000/news',
    'http://localhost:3000/gallery',
    'http://localhost:3000/about',
    'http://localhost:3000/contact',
    'http://localhost:3000/donate'
  ];

  const selector = 'div#root:nth-of-type(1) > div:nth-of-type(1) > main:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3)';

  for (const url of urls) {
      await page.goto(url);
      await new Promise(r => setTimeout(r, 1000));
      const el = await page.$(selector);
      if (el) {
          const className = await page.$eval(selector, e => e.className);
          console.log(`FOUND ON ${url}: ${className}`);
      }
  }

  await browser.close();
})();
