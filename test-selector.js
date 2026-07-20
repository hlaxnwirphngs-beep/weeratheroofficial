import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 2000));
  
  const selector = 'div#root:nth-of-type(1) > div:nth-of-type(1) > main:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(3)';
  
  try {
    const el = await page.$(selector);
    if (el) {
       const html = await page.$eval(selector, el => el.outerHTML);
       console.log("MATCH FOUND:", html.substring(0, 500));
    } else {
       console.log("NO MATCH");
       const allDivsInMain = await page.$$eval('main > div > div > div', els => els.map(el => el.className));
       console.log("Classes of main > div > div > div:", allDivsInMain);
    }
  } catch(e) {
    console.log("Error:", e);
  }

  await browser.close();
})();
