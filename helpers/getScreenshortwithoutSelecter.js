const puppeteer = require('puppeteer');
const addStylesToHTML = require('../utils/addcsstohtml');
const crypto = require('crypto');
const Upload = require('../utils/upload');
const base64ToString = require('../utils/basetostring');

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
      const base64Image = await page.screenshot({ encoding: 'base64' });
      await browser.close();

      const decodedString = base64ToString(base64Image);


      if (responsetype == 'URL') {
        const uploadres = await Upload(decodedString, name)
        await res.send(uploadres)
      } else {
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'attachment; filename=example.png');
        await res.send(decodedString)
      }

      resolve(true)
    } catch (error) {
      console.log(error)
      reject(error.message)
    }
  })
}

module.exports = getScreenshortwithoutSelecter;