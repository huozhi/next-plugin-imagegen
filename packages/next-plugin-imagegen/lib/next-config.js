const dev = process.env.NODE_ENV !== 'production'
const instanceId = dev ? 'snapshot' : Date.now().toString(16).slice(-6)

const withImagegen = (nextConfig = {}) => {
  const jsxImagePathRegex = ':slug*.image'

  if (dev)
    console.log(
      `\x1b[36mplugin-imagegen\x1b[0m - Develop your raw image components in /<image-page-route>.${instanceId}. e.g. /logo.image.${instanceId}`
    )

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
          destination: `/api/imagegen/${instanceId}/:slug*`,
          permanent: true
        },
      ]
    },
    async rewrites() {
      const originRewrites = nextConfig.rewrites ? await nextConfig.rewrites() : []
      return [
        ...originRewrites,
        {
          source: `/${jsxImagePathRegex}.${instanceId}`,
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

