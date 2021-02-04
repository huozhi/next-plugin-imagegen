const withImagegen = (nextConfig = {}) => {
  const customConfig = {
    webpack(config, args) {
      const imageComponentExt = /\.image\.jsx?$/
      config.module.rules.push({
        test: imageComponentExt,
        loader: 'next-plugin-imagegen/loader',
      })

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, args)
      }
      return config
    },
    async redirects() {
      const originRedirects = nextConfig.redirects ? await nextConfig.redirects() : []
      return [
        ...originRedirects,
        {source: '/:slug*.image', destination: '/api/imagegen?url=/:slug*', permanent: false},
      ]
    },
    async rewrites() {
      const originRewrites = nextConfig.redirects ? await nextConfig.rewrites() : []
      return [
        ...originRewrites,
        {source: '/:slug*.image.snapshot', destination: '/:slug*.image'},
      ]
    }
  }

  return Object.assign(
    {},
    nextConfig,
    customConfig,
  )
}

module.exports = withImagegen

