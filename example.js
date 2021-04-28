const puppeteer = require('puppeteer');

const BBB_ROOM = 'sus-c9t-jhz';

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--lang=en-EN,en']
  });

  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 1080});

  // go to bbb
  await page.goto('https://webconf.tu-bs.de/' + BBB_ROOM);

  // login
  await (await page.$('#_' + BBB_ROOM + '_join_name')).type('Nagrywarka');
  await (await page.$('button[type=submit]')).click();

  // cookies
  await page.waitForNavigation({
    waitUntil: 'networkidle0',
  });  
  await (await page.$('input[type=submit]')).click();

  // join audio session
  await page.waitForNavigation({
    waitUntil: 'networkidle0',
  });  
  await page.waitForSelector('button[aria-label="Listen only"]');
  await (await page.$('button[aria-label="Listen only"]')).click();

  // start recording
  await page.screenshot({ path: 'example.png' });

  // end recording

  await browser.close();
})();
