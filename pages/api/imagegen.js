const mql = require('@microlink/mql')
const {getScreenshot} = require('./_lib/pptr')


let globalTunnel
async function createTunnel() {

}


export default async function handler(req, res) {
  const {url: jsxImageUrl, ...restQueries} = req.query
  const isDev = process.env.NODE_ENV !== 'production'
  const host = isDev ? 'http://localhost:3000' : process.env.TUNNEL_URL
  const distUrl = new URL(jsxImageUrl + '.image.snapshot', host)
  Object.keys(restQueries).forEach(key => {
    distUrl.searchParams.append(key, restQueries[key])
  })
  const requestUrl = distUrl.href
  console.log('HTTP:', jsxImageUrl, '->', requestUrl)
  if (isDev) {
    const fileType = 'png'
    const imageFile = await getScreenshot(requestUrl, fileType)
    res.statusCode = 200
    res.setHeader('Content-Type', `image/${fileType}`);
    res.setHeader('Cache-Control', `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`)
    return res.end(imageFile)
  }

  console.log('microlink', requestUrl)
  const {status, data} = await mql(requestUrl, {screenshot: true, fullPage: true})
  const {url: imageSnapshotUrl} = data.screenshot

  console.log('imagegen:', 'status', status, 'mapping:', requestUrl, '->', imageSnapshotUrl)
  res.redirect(302, imageSnapshotUrl)
}
