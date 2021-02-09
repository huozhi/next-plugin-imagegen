const fs = require('fs')
const {join} = require('path')

function createApiSource({provider}) {
  return (
`const middleware = require("next-plugin-imagegen/middleware")
const provider = require("${provider}")

module.exports = middleware(provider)`
  )
}

const defaultProvider = 'next-plugin-imagegen/provider'

const withImagegen = (
  {
    api = 'imagegen__', 
    provider = defaultProvider
  } = {}
) => (nextConfig = {}) => {
  const jsxImagePathRegex = ':slug*.image'
  const customConfig = {
    webpack(webpackConfig, options) {
      const {defaultLoaders, isServer} = options
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
        const apiDir = join(process.cwd(), 'pages', 'api')
        const apiHandlerPath = join(apiDir, `${api}.js`)
        const source = createApiSource({provider})
 
        fs.writeFileSync(
          join(__dirname, '..', 'api.js'),
          source,
          {encoding: 'utf-8'}
        )
        
        // Dynamically adding file in async webpack entry won't work,
        // next.js dev mode requires handler file in `pages/api` and be writable.
        // So we forcedly generate one
        fs.mkdirSync(apiDir, {recursive: true})
        
        // make it change less frequently
        fs.writeFileSync(
          apiHandlerPath,
          `export {default} from "next-plugin-imagegen/api"`,
          {encoding: 'utf-8'}
        )
        console.log('Api handler is created for imagegen in', apiHandlerPath)
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
          destination: `/api/${api}?_url=/:slug*`,
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

