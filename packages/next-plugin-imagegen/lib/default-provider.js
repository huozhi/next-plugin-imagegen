const https = require('https')
const mql = require('@microlink/mql')

const dev = process.env.NODE_ENV !== 'production'
const defaultViewport = {
  deviceScaleFactor: 1,
  isMobile: false,
  hasTouch: false,
  isLandscape: false,
}

const defaultProvider = (options = {}) => async function middleware(proxyUrl, req, res) {
  const {
    apiKey,
    ttl,
    type = 'png',
    omitBackground = false,
    headers,
    viewport,
    colorScheme,
  } = options
  const mqlOptions = {
    ttl,
    headers,
    viewport: Object.assign({}, defaultViewport, viewport),
    colorScheme,
    type,
    omitBackground,
    fullPage: true,
    screenshot: true,
    force: dev,
    apiKey: apiKey || process.env.MICROLINK_TOKEN,
    meta: false
  }

  const {status, data: {screenshot}} = await mql(proxyUrl, mqlOptions)
  
  if (dev) console.log(`imagegen:${status}`, proxyUrl, '->', screenshot.url)

  const imageUrl = new URL(screenshot.url)
  const imageReq = https.request(imageUrl, (imageRes) => {
    res.writeHead(imageRes.statusCode, imageRes.headers)
    imageRes.pipe(res)
  })
  req.pipe(imageReq)
}

module.exports = defaultProvider
