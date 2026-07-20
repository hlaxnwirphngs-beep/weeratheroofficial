import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  const urls = [
    'http://localhost:3000/admin',
    'http://localhost:3000/admin/news',
    'http://localhost:3000/admin/gallery',
    'http://localhost:3000/admin/activities'
  ];

  for (const url of urls) {
      await page.goto(url);
      await new Promise(r => setTimeout(r, 1000));
      
      const elements = await page.evaluate(() => {
          let els = document.querySelectorAll('main > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3)');
          return Array.from(els).map(el => el.outerHTML.substring(0, 200));
      });
      if (elements.length > 0) {
          console.log(`FOUND ON ${url}:`, elements);
      }
  }

  await browser.close();
})();
