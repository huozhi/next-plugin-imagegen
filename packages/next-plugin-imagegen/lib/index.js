const withImagegen = ({api = 'imagegen'} = {}) => (nextConfig = {}) => {
  const jsxImagePathRegex = ':slug*.image'
  
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
        {
          source: `/${jsxImagePathRegex}`, 
          destination: `/api/${api}?url=/:slug*`, 
          permanent: false
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

