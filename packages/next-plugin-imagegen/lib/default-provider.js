const https = require('https')
const mql = require('@microlink/mql')

const isProduction = process.env.NODE_ENV === 'production'

async function defaultProvider(proxyUrl, req, res) {
  const mqlOptions = {
    screenshot: true,
    fullPage: true,
    force: !isProduction,
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
