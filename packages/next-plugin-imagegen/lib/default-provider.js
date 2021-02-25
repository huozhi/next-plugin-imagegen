const https = require('https')
const mql = require('@microlink/mql')

const isProduction = process.env.NODE_ENV === 'production'

async function defaultProvider(proxyUrl, req, res) {
  // append unique query _t=<6-len-hash> to make it unique
  const mqlOptions = {
    screenshot: true,
    fullPage: true,
    force: true,
  }
  if (isProduction) {
    const url = new URL(proxyUrl)
    url.searchParams.append('_t', req.headers['x-imagegen-uid'])
    proxyUrl = url.toString()
    mqlOptions.force = false
  }

  const {status, data: {screenshot}} = await mql(proxyUrl, mqlOptions)
  if (!isProduction) {
    console.log(`imagegen:${status}`, proxyUrl, '->', screenshot.url)
  }
  const imageUrl = new URL(screenshot.url)
  const imageReq = https.request(imageUrl, (imageRes) => {
    res.writeHead(imageRes.statusCode, imageRes.headers)
    imageRes.pipe(res)
  })
  req.pipe(imageReq)
}

module.exports = defaultProvider
