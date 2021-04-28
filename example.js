const puppeteer = require('puppeteer');
const { launch, getStream } = require("puppeteer-stream");
const fs = require("fs");

const BBB_ROOM = 'sus-c9t-jhz';
const filename = `./recordings/hci_${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()}.webm`;

(async () => {
  const browser = await launch({
    headless: true, // aaaarrrwwww why!?!?!?!?!?
    args: [
      '--lang=en-EN,en',
      "--window-size=1280,720"
    ],
    ignoreDefaultArgs: [
      '--mute-audio'
    ],
    defaultViewport: null,
  });

  const page = await browser.newPage();

  //await page.goto('https://www.youtube.com/watch?v=BRVSF_OqcTI');
  
  // go to bbb
  console.log('going to bbb');
  await page.goto('https://webconf.tu-bs.de/' + BBB_ROOM);

  // login
  console.log('logging in');
  await (await page.$('#_' + BBB_ROOM + '_join_name')).type('Nagrywarka');
  await (await page.$('button[type=submit]')).click();

  // accept cookies
  await page.waitForNavigation({
    waitUntil: 'networkidle0',
  });
  await page.waitForSelector('input[type=submit]', {
      timeout: 1000 * 60 * 60 * 2 // two hours
  });
  console.log('accepting cookies');
  await (await page.$('input[type=submit]')).click();

  // join audio session
  await page.waitForNavigation({
    waitUntil: 'networkidle0',
  });
  await page.waitForSelector('button[aria-label="Listen only"]');
  console.log('joining audio session');
  await (await page.$('button[aria-label="Listen only"]')).click();

  // start recording
  console.log('starting recording');
  const file = fs.createWriteStream(filename);

  const stream = await getStream(page, {
    audio: true,
    video: true,
    audioBitsPerSecond: 64 * 1024,
    videoBitsPerSecond: 1 * 1024 * 1024
  });

  stream.pipe(file);

  setTimeout(async () => {
    await stream.destroy();
    file.close();
    await browser.close();
  }, 1000 * 60 * 60 * 2); // two hours
})();
