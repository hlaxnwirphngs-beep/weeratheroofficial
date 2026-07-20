import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  // Navigate to admin news page
  await page.goto('http://localhost:3000/admin/news');
  await new Promise(r => setTimeout(r, 2000));
  
  // Click Add button
  const addBtn = await page.$('button.bg-\\[\\#1B3022\\]'); // Add button has this class
  if(addBtn) {
    console.log("Clicking Add button...");
    await addBtn.click();
    await new Promise(r => setTimeout(r, 1000));
    
    // Fill required inputs
    const inputs = await page.$$('input[required]');
    for(let input of inputs) {
      await input.type('test');
    }
    const textareas = await page.$$('textarea[required]');
    for(let ta of textareas) {
      await ta.type('test');
    }
    
    // Click Save button
    const saveBtn = await page.$('button[type="submit"][form="crud-form"]');
    if(saveBtn) {
        console.log("Clicking Save button...");
        await saveBtn.click();
        await new Promise(r => setTimeout(r, 2000));
    } else {
        console.log("No save button found.");
    }
  } else {
      console.log("No add button found. Maybe login required?");
  }

  await browser.close();
})();
