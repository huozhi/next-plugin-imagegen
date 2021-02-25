const withImagegen = (nextConfig = {}) => {
  const jsxImagePathRegex = ':slug*.image'
  const customConfig = {
    webpack(webpackConfig, options) {
      const {defaultLoaders} = options
      const imageComponentExt = /\.image\.(t|j)sx?$/

      webpackConfig.module.rules.push({
        test: imageComponentExt,
        use: [
          {
            loader: 'next-plugin-imagegen/loader',
          },
          defaultLoaders.babel,
        ]
      })

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(webpackConfig, options)
      }
      return webpackConfig
    },
    async redirects() {
      const originRedirects = nextConfig.redirects ? await nextConfig.redirects() : []
      return [
        ...originRedirects,
        {
          source: `/${jsxImagePathRegex}`,
          destination: `/api/imagegen/:slug*`,
          permanent: true
        },
      ]
    },
    async rewrites() {
      const originRewrites = nextConfig.redirects ? await nextConfig.rewrites() : []
      return [
        ...originRewrites,
        {
          source: `/${jsxImagePathRegex}.snapshot`,
          destination: `/${jsxImagePathRegex}`
        },
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

