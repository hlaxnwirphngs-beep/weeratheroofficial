import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  await page.goto('http://localhost:3000');
  await new Promise(r => setTimeout(r, 2000));
  
  const html = await page.evaluate(() => {
     let elements = document.querySelectorAll('main > div > div > div');
     return Array.from(elements).map((el, i) => `${i+1}: ${el.tagName} ${el.className} \n ${el.outerHTML.substring(0, 100)}`);
  });
  console.log("All main > div > div > div on Home page:", html);

  const html2 = await page.evaluate(() => {
     let elements = document.querySelectorAll('main > div > div');
     return Array.from(elements).map((el, i) => `${i+1}: ${el.tagName} ${el.className} \n ${el.outerHTML.substring(0, 100)}`);
  });
  console.log("All main > div > div on Home page:", html2);

  const html3 = await page.evaluate(() => {
     let elements = document.querySelectorAll('main > div > *');
     return Array.from(elements).map((el, i) => `${i+1}: ${el.tagName} ${el.className} \n ${el.outerHTML.substring(0, 100)}`);
  });
  console.log("All main > div > * on Home page:", html3);

  await browser.close();
})();
