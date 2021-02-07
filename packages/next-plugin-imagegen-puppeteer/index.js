const core = require('puppeteer-core')

const executablePath = process.platform === 'win32'
? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
: process.platform === 'linux'
? '/usr/bin/google-chrome'
: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'


let _page
async function getPage() {
  if (_page) {
      return _page
  }
  const options = {
    executablePath,
    headless: true,
  }
  const browser = await core.launch(options)
  _page = await browser.newPage()
  return _page
}

async function getScreenshot(url, type = 'png') {
  const page = await getPage()
  // default og image size: 1200x627
  await page.setViewport({ width: 1200, height: 627 })
  await page.goto(url)
  const file = await page.screenshot({ type })
  return file
}

async function pptrSnapshot(url, req, res) {
  const fileType = 'png'
  const imageFile = await getScreenshot(url, fileType)
  res.statusCode = 200
  res.setHeader('Content-Type', `image/${fileType}`)
  res.setHeader('Cache-Control', `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`)
  return res.end(imageFile)
}

module.exports = pptrSnapshot
