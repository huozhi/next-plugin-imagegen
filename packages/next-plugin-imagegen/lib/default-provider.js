const https = require('https')
const mql = require('@microlink/mql')

const uuid = Math.round(Math.random() * 100000)

async function microlinkSnapshot(url, req, res) {
  const isProduction = process.env.NODE_ENV === 'production'
  const {status, data} = await mql(url, {
    screenshot: true,
    fullPage: true,
    force: !isProduction, // if it's not production, invalidates cache every time
  })
  const {screenshot} = data
  if (!isProduction) {
    console.log(`imagegen:${status}`, url, '->', screenshot.url)
  }
  const imageUrl = new URL(screenshot.url)
  const imageReq = https.request(imageUrl, (imageRes) => {
    res.writeHead(imageRes.statusCode, imageRes.headers)
    imageRes.pipe(res)
  })
  req.pipe(imageReq)
}

module.exports = microlinkSnapshot
