const https = require('https')
const mql = require('@microlink/mql')

const isProduction = process.env.NODE_ENV === 'production'

const defaultProvider = (options = {}) => async function middleware(proxyUrl, req, res) {
  const {
    apiKey,
    ttl,
    headers,
    device,
    viewport,
    colorScheme,
  } = options
  const mqlOptions = {
    // base configs
    fullPage: true,
    ...mqlParameters,
    // overrides
    screenshot: true,
    force: !isProduction,
    apiKey: apiKey || process.env.MICROLINK_TOKEN,
    ttl,
    device,
    headers,
    viewport,
    colorScheme,
  }

  const {status, data: {screenshot}} = await mql(proxyUrl, mqlOptions)
  if (!isProduction) {
    console.log(`imagegen:${status}`, proxyUrl, '->', screenshot.url)
  }
  const imageUrl = new URL(screenshot.url)
  const imageReq = https.request(imageUrl, (imageRes) => {
    imageRes.headers['Cache-Control'] = 'private, immutable, no-transform, s-maxage=31536000, max-age=31536000'
    res.writeHead(imageRes.statusCode, imageRes.headers)
    imageRes.pipe(res)
  })
  req.pipe(imageReq)
}

module.exports = defaultProvider
