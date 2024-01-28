const puppeteer = require('puppeteer');
const addStylesToHTML = require('../utils/addcsstohtml');
const crypto = require('crypto');
const path = require('path');
const Upload = require('../utils/upload');
const fs = require('fs');

function getScreenshortwithoutSelecter(html, css, delay = 1000, width = 1440, height = 900, responsetype, res) {
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

      const id = crypto.randomBytes(16).toString('hex')
      const name = `photo_${new Date().getTime()}_${id}.png`
      const pathtoimage = path.join(__dirname, `../images/${name}`)
      await page.screenshot({ path: pathtoimage });
      await browser.close();

      if (responsetype == 'URL') {
        const uploadres = await Upload(pathtoimage, name)
        await res.send(uploadres)
      } else await res.sendFile(pathtoimage)

      fs.unlink(pathtoimage, (err) => {
        if (err) console.error(`Error deleting file: ${err}`);
      });

      resolve(true)
    } catch (error) {
      reject(error.message)
    }
  })
}

module.exports = getScreenshortwithoutSelecter;