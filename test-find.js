import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  const urls = [
    'http://localhost:3000/',
    'http://localhost:3000/news',
    'http://localhost:3000/gallery',
    'http://localhost:3000/about',
    'http://localhost:3000/admin',
    'http://localhost:3000/admin/news'
  ];

  for (const url of urls) {
      await page.goto(url);
      await new Promise(r => setTimeout(r, 2000));
      const html = await page.evaluate(() => {
          const el = document.querySelector('main > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3)');
          return el ? el.outerHTML : null;
      });
      if (html) {
          console.log(`FOUND ON ${url}:`);
          console.log(html.substring(0, 500));
      }
  }

  await browser.close();
})();
