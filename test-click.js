import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:3000');
  await page.waitForSelector('button');
  
  // The user clicked: div#root:nth-of-type(1) > div:nth-of-type(1) > main:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(3) > button:nth-of-type(2)
  const selector = 'div#root:nth-of-type(1) > div:nth-of-type(1) > main:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(3) > button:nth-of-type(2)';
  
  try {
    await page.waitForSelector(selector, { timeout: 2000 });
    console.log("Found button, clicking...");
    await page.click(selector);
    await new Promise(r => setTimeout(r, 1000));
  } catch(e) {
    console.log("Could not find button on Home page. Let's try /news");
    await page.goto('http://localhost:3000/news');
    try {
      await page.waitForSelector(selector, { timeout: 2000 });
      console.log("Found button on /news, clicking...");
      await page.click(selector);
      await new Promise(r => setTimeout(r, 1000));
    } catch(e2) {
        console.log("Could not find button on /news either. Let's try /gallery");
        await page.goto('http://localhost:3000/gallery');
        try {
            await page.waitForSelector(selector, { timeout: 2000 });
            console.log("Found button on /gallery, clicking...");
            await page.click(selector);
            await new Promise(r => setTimeout(r, 1000));
        } catch(e3) {
            console.log("Could not find button on /gallery either.");
        }
    }
  }

  await browser.close();
})();
