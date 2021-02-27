const isProduction = process.env.NODE_ENV === 'production'

function provider(options = {}) {
  const browserless = require('browserless')()
  return async function (url, req, res) {
    const {
      // browserless options
      headers,
      device,
      viewport,
      colorScheme,
      // puppeteer options
      type = 'png',
      quality,
      clip,
      omitBackground,
    } = options

    const buffer = await browserless.screenshot(url, {
      headers,
      device,
      viewport,
      colorScheme,
      type,
      quality,
      clip,
      omitBackground,
      fullPage: true,
    })
    const cacheability = isProduction ?
      'private, immutable, no-transform, s-maxage=31536000, max-age=31536000' :
      'no-cache'

    res.statusCode = 200
    res.setHeader('Content-Type', `image/${type}`)
    res.setHeader('Cache-Control', cacheability)
    res.end(buffer)
  }
}

exports.provider = provider
