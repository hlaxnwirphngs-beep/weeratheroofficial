import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 1000));
  
  const buttons = await page.$$('button');
  console.log(`Found ${buttons.length} buttons on home page.`);
  for (let i = 0; i < buttons.length; i++) {
     try {
       await buttons[i].click();
       await new Promise(r => setTimeout(r, 200));
     } catch (e) {
       console.log("Error clicking button", i);
     }
  }

  await browser.close();
})();
