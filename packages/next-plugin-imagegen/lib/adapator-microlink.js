const mql = require('@microlink/mql')

async function microlinkSnapshot(url, res) {
  const {status, data} = await mql(url, {screenshot: true, fullPage: true})
  const {screenshot} = data
  console.log(`imagegen:${status}`, url, '->', screenshot.url)
  res.redirect(302, screenshot.url)
}

module.exports = microlinkSnapshot
