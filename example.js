const puppeteer = require('puppeteer');
const PuppeteerVideoRecorder = require('puppeteer-video-recorder');

const BBB_ROOM = 'sus-c9t-jhz';
const recorder = new PuppeteerVideoRecorder();

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--lang=en-EN,en',
    ],
    ignoreDefaultArgs: [
      '--mute-audio'
    ],
    defaultViewport: {width: 1280, height: 720}
  });

  const page = await browser.newPage();
  await recorder.init(page, 'recordings');

  // go to bbb
  await page.goto('https://webconf.tu-bs.de/' + BBB_ROOM);

  // login
  await (await page.$('#_' + BBB_ROOM + '_join_name')).type('Nagrywarka');
  await (await page.$('button[type=submit]')).click();

  // accept cookies
  await page.waitForNavigation({
    waitUntil: 'networkidle0',
  });
  await page.waitForSelector('input[type=submit]', {
      timeout: 1000 * 60 * 60 // one hour
  });
  await (await page.$('input[type=submit]')).click();

  // join audio session
  await page.waitForNavigation({
    waitUntil: 'networkidle0',
  });  
  await page.waitForSelector('button[aria-label="Listen only"]');
  await (await page.$('button[aria-label="Listen only"]')).click();

  // start recording
  await recorder.start({
      quality: 70
  });
  //page.waitForTimeout(5000);
  const input = await page.$('#message-input');
  await input.type('in english i guess', { delay: 200 });

  // end recording
  await recorder.stop();
  await browser.close();
})();
