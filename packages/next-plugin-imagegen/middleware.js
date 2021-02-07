function getProxyUrl(req) {
  const {url: originUrl, ...restQueries} = req.query
  const protocol = req.headers['x-forwarded-proto'] || (req.headers.referer || '').split(':')[0] || 'http'
  const host = `${protocol}://${req.headers.host}`
  const proxyUrl = new URL(originUrl + '.image.snapshot', host)
  Object.keys(restQueries).forEach(key => {
    proxyUrl.searchParams.append(key, restQueries[key])
  })
  return proxyUrl.href
}

async function handler(snapshot, req, res) {
  const proxyUrl = getProxyUrl(req)
  console.log('HTTP:', req.url, '->', proxyUrl)

  await snapshot(proxyUrl, res)
}

const middleware = (snapshot) => async (req, res) => await handler(snapshot, req, res)

module.exports = middleware

