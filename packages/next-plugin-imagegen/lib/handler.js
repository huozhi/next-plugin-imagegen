const instanceId = Date.now().toString(16).slice(0, 6)
const isProduction = process.env.NODE_ENV === 'production'

function getProxyUrl(req) {
  const {imagegen: componentPath, ...restQueries} = req.query
  const protocol = req.headers['x-forwarded-proto'] || (req.headers.referer || '').split(':')[0] || 'http'
  const host = `${protocol}://${req.headers.host}`
  const proxyUrl = new URL(componentPath + '.image.snapshot', host)
  Object.keys(restQueries).forEach(key => {
    proxyUrl.searchParams.append(key, restQueries[key])
  })
  return proxyUrl.href
}

async function handler(snapshot, req, res) {
  const proxyUrl = getProxyUrl(req)
  if (!isProduction) {
    console.log('HTTP:', req.url, '->', proxyUrl)
  }

  if (isProduction)
  req.headers['x-imagegen-uid'] = instanceId
  await snapshot(proxyUrl, req, res)
}

const middleware = (snapshot) => async (req, res) => await handler(snapshot, req, res)

module.exports = middleware

