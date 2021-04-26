const dev = process.env.NODE_ENV !== 'production'
const instanceId = dev ? 'snapshot' : Date.now().toString(16).slice(-6)

const withImagegen = (nextConfig = {}) => {
  if (dev) {
    console.log(`\x1b[36mplugin-imagegen\x1b[0m - Develop image components at /<route>.image.${instanceId}`)
  }
  
  const customConfig = (phase, { defaultConfig }, nextConfig) => {
    nextConfig = typeof nextConfig === 'function'
      ? nextConfig(phase, { defaultConfig })
      : nextConfig
    
    const pageExtensions = nextConfig.pageExtensions || defaultConfig.pageExtensions
    
    return {
      webpack(webpackConfig, options) {
        const { defaultLoaders } = options
        const imageComponentExt = /\.image\.(t|j)sx?$/

        webpackConfig.module.rules.push({
          test: imageComponentExt,
          use: [
            {
              loader: 'next-plugin-imagegen/loader',
            },
            defaultLoaders.babel,
          ],
        })

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(webpackConfig, options)
        }
        return webpackConfig
      },
      pageExtensions: pageExtensions
        .filter(pe => /^(t|j)sx?$/.test(pe))
        .map(pe => 'image.' + pe)
        .concat(pageExtensions),
      async rewrites() {
        const originRewrites = nextConfig.rewrites
          ? await nextConfig.rewrites()
          : {}
        return {
          ...(!Array.isArray(originRewrites) && originRewrites),
          beforeFiles: [
            ...(originRewrites.beforeFiles || []),
            // rewrites xxx.image requests to imagegen api
            {
              source: `/:slug*.image`,
              destination: `/api/imagegen/${instanceId}/:slug*`,
            },
            // origin component snapshot
            {
              source: `/:slug*.image.${instanceId}`,
              destination: `/:slug*`,
            }
          ],
        }
      },
    }
  }

  return (phase, { defaultConfig }) => {
    return customConfig(phase, { defaultConfig }, nextConfig)
  }
}

module.exports = withImagegen
