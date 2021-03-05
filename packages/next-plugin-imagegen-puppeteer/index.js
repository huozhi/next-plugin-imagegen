const dev = process.env.NODE_ENV !== 'production'

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
      ttl = 0,
      type = 'png',
      omitBackground,
    } = options

    const buffer = await browserless.screenshot(url, {
      headers,
      device,
      viewport,
      colorScheme,
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
