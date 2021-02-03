module.exports = {
  webpack(config) {
    const imageComponentExt = /\.image\.jsx?$/
    config.module.rules.push({
      test: imageComponentExt,
      loader: require.resolve('./imagegen-loader'),
    })
    return config
  },
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
