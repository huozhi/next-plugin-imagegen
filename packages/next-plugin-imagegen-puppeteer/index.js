const core = require('puppeteer-core')
const chromelambda = require('chrome-aws-lambda')

const dev = process.env.NODE_ENV !== 'production'
const executablePath = process.platform === 'win32'
    ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
    : process.platform === 'linux'
      ? '/usr/bin/google-chrome'
      : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
  
const defaultViewport = {
  deviceScaleFactor: 1,
  isMobile: false,
  hasTouch: false,
  isLandscape: false,
}


function provider(options = {}) {  
  let globalPage
  async function getPage() {
    if (globalPage) { return globalPage }
    const launchOptions = dev ? {
      args: [],
      executablePath,
      headless: true,
    } : {
      args: chromelambda.args,
      executablePath: await chromelambda.executablePath,
      headless: chromelambda.headless,
    }
      
    const browser = await core.launch(launchOptions)
    return (globalPage = await browser.newPage())
  }
  
  return async function (url, req, res) {
    const {
      // browserless options
      headers,
      viewport,
      // puppeteer options
      ttl = 0,
      type = 'png',
      colorScheme = 'no-preference',
      omitBackground,
    } = options

    const page = await getPage()
    if (headers) {
      await page.setExtraHTTPHeaders(headers)
    }
    if (colorScheme === 'no-preference') {      
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: colorScheme }])
    }

    await page.goto(url)
    const buffer = await page.screenshot({
      // headers,
      viewport: Object.assign({}, defaultViewport, viewport),
      type,
      omitBackground,
      fullPage: true,
    })

    const cacheability = dev ?
      'no-cache' :
      `private, immutable, no-transform, max-age=${Math.floor(ttl)}`
    res.statusCode = 200
    res.setHeader('Content-Type', `image/${type}`)
    res.setHeader('Cache-Control', cacheability)
    res.end(buffer)
  }
}

exports.provider = provider
