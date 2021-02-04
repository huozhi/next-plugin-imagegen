const snapshot = require('next-plugin-imagegen/snapshot')

function getProxyUrl(req) {
  const {url: originUrl, ...restQueries} = req.query
  const host = `http://${req.headers.host}`
  const proxyUrl = new URL(originUrl + '.image.snapshot', host)
  Object.keys(restQueries).forEach(key => {
    proxyUrl.searchParams.append(key, restQueries[key])
  })
  return proxyUrl.href
}

export default async function handler(req, res) {
  const proxyUrl = getProxyUrl(req)
  console.log('HTTP:', req.url, '->', proxyUrl)
  
  return await snapshot(proxyUrl, res)
}
