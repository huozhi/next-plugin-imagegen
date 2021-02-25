const browserless = require('browserless')()

// TODO: fileType as options
const fileType = 'png'
const isProduction = process.env.NODE_ENV === 'production'

async function provider(url, req, res) {
  const buffer = await await browserless.screenshot(url, { type: fileType })
  res.statusCode = 200
  res.setHeader('Content-Type', `image/${fileType}`)
  const cacheability = isProduction ?
    'private, immutable, no-transform, s-maxage=31536000, max-age=31536000' :
    'no-cache'
  res.setHeader('Cache-Control', cacheability)

  return res.end(buffer)
}

exports.provider = provider
