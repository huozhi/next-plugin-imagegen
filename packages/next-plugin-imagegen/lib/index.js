const fs = require('fs')
const {join} = require('path')

const withImagegen = ({api = 'imagegen', provider} = {}) => (nextConfig = {}) => {
  const jsxImagePathRegex = ':slug*.image'

  function resolveProvider() {
    const defaultProvider = 'next-plugin-imagegen/defaults'
    if (!provider) return defaultProvider

    console.log('Customized provider detected:', provider)


    return provider
  }

  const customConfig = {
    webpack(webpackConfig, options) {
      const {defaultLoaders, isServer} = options
      // const {RawSource} = webpack.sources
      const imageComponentExt = /\.image\.jsx?$/
      webpackConfig.module.rules.push({
        test: imageComponentExt,
        use: [
          defaultLoaders.babel,
          {
            loader: 'next-plugin-imagegen/loader',
          },
        ]
      })


      if (isServer) {
        const originEntry = webpackConfig.entry
        const apiSourceCode =
        `import middleware from "next-plugin-imagegen/middleware"
        import provider from "${resolveProvider()}"

        export default middleware(provider)`

        const filepath = join(__dirname, '.cache', 'imagengen.js')
        fs.writeFileSync(filepath, apiSourceCode, {encoding: 'utf-8'})

        webpackConfig.entry = async () => {
          const entry = await originEntry()
          entry[`pages/api/${api}`] = filepath

          // console.log('db:entry', entry)
          return entry
        }
      }


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

