const isProduction = process.env.NODE_ENV === 'production'

function getProxyUrl(req) {
  const {imagegen, ...restQueries} = req.query
  const protocol = req.headers['x-forwarded-proto'] || (req.headers.referer || '').split(':')[0] || 'http'
  const host = `${protocol}://${req.headers.host}`
  const [instanceId,  ...componentPaths] = imagegen
  const snapshotPath = `/${componentPaths.join('/')}.image.${instanceId}`
  const proxyUrl = new URL(snapshotPath, host)

  Object.keys(restQueries).forEach(key => {
    proxyUrl.searchParams.append(key, restQueries[key])
  })
  return proxyUrl.href
}

async function middleware(snapshot, req, res) {
  const proxyUrl = getProxyUrl(req)
  if (!isProduction) {
    console.log('HTTP:', req.url, '->', proxyUrl)
  }
  await snapshot(proxyUrl, req, res)
}

const handler = (snapshot) => 
  async (req, res) => 
    await middleware(snapshot, req, res)

module.exports = handler

