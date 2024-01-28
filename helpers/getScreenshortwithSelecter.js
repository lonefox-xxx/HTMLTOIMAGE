const puppeteer = require('puppeteer');
const addStylesToHTML = require('../utils/addcsstohtml');
const crypto = require('crypto');
const path = require('path');
const Upload = require('../utils/upload');
const fs = require('fs');

function getScreenshortwithSelecter(html, css, selecter = '.container', delay = 1000, width = 1440, height = 900, responsetype, res) {
  return new Promise(async (resolve, reject) => {
    try {
      const browser = await puppeteer.launch({
        args: [
          "--disable-setuid-sandbox",
          "--no-sandbox",
          "--single-process",
          "--no-zygote"
        ],
        executablePath: process.env.NODE_ENV == 'production' ? process.env.PUPPETEER_EXECUTABLE_PATH : puppeteer.executablePath()
      });

      const page = await browser.newPage();
      const htmlContent = addStylesToHTML(html, css)
      await page.setViewport({ width, height });
      await page.setContent(htmlContent);
      await page.waitForTimeout(delay);
      await page.waitForSelector(selecter);
      const elementHandle = await page.$(selecter);
      const boundingBox = await elementHandle.boundingBox();
      const id = crypto.randomBytes(16).toString('hex')
      const name = `photo_${new Date().getTime()}_${id}.png`
      const pathtoimage = path.join(__dirname, `../images/${name}`)
      await page.screenshot({
        path: pathtoimage,
        clip: {
          x: boundingBox.x,
          y: boundingBox.y,
          width: boundingBox.width,
          height: boundingBox.height,
        },
      });
      await browser.close();

      if (responsetype == 'URL') {
        const uploadres = await Upload(pathtoimage, name)
        await res.send(uploadres)
      } else await res.sendFile(pathtoimage)

      fs.unlink(pathtoimage, (err) => {
        if (err) console.error(`Error deleting file: ${err}`);
        else console.log(`File ${filePath} deleted`);
      });
      resolve(true)
    } catch (error) {
      reject(error.message)
    }
  })
}

module.exports = getScreenshortwithSelecter;