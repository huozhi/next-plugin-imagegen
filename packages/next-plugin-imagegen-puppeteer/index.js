const browserless = require('browserless')()

const isProduction = process.env.NODE_ENV === 'production'

const defultOptions = {
  screenshot: {
    type: 'png',
  }
}

function getOptions(options) {
  options = options || {}
  for (const prop in defultOptions) {
    options[prop] = Object.assign(defultOptions[prop], options[prop])
  }
  return options
}

function provider(_options) {
  return async function (url, req, res) {
    const { screenshot } = getOptions(_options)
    const buffer = await await browserless.screenshot(url, screenshot)
    res.statusCode = 200
    res.setHeader('Content-Type', `image/${screenshot.type}`)
    const cacheability = isProduction ?
      'private, immutable, no-transform, s-maxage=31536000, max-age=31536000' :
      'no-cache'
    res.setHeader('Cache-Control', cacheability)
  
    return res.end(buffer)
  }
}

exports.provider = provider
