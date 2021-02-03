module.exports = {

  async redirects() {
    return [
      {source: '/:slug*.image', destination: '/api/imagegen?url=/:slug*', permanent: false},
    ]
  },
  async rewrites() {
    return [
      {source: '/:slug*.image.snapshot', destination: '/:slug*.image'},
    ]
  }
}
