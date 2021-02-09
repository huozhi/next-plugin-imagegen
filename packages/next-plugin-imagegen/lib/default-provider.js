const https = require('https')
const mql = require('@microlink/mql')

async function microlinkSnapshot(url, req, res) {
  const {status, data} = await mql(url, {screenshot: true, fullPage: true})
  const {screenshot} = data
  if (process.env.NODE_ENV !== 'production') {
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
