const { existsSync, promises } = require('fs')
const { join } = require('path')

function findPagesDir(dir = process.cwd()) {
  if (existsSync(join(dir, 'pages'))) return 'pages'
  if (existsSync(join(dir, 'src/pages'))) return 'src/pages'

  throw new Error(
    "> Couldn't find a `pages` directory. Please create one under the project root"
  )
}

async function collectPaths(dir, filter, arr = [], rootDir = dir) {
  const result = await promises.readdir(dir, { withFileTypes: true })

  await Promise.all(
    result.map(async (part) => {
      const absolutePath = join(dir, part.name)

      let isDirectory = part.isDirectory()
      if (part.isSymbolicLink()) {
        const stats = await promises.stat(absolutePath)
        isDirectory = stats.isDirectory()
      }

      if (isDirectory) {
        await collectPaths(absolutePath, filter, arr, rootDir)
        return
      }
      if (!filter.test(part.name)) {
        return
      }

      arr.push(absolutePath.replace(rootDir, ''))
    })
  )
  return arr.sort()
}

module.exports = function withImageGen(nextConfig = {}) {
  const customConfig = (phase, { defaultConfig }, nextConfig) => {
    nextConfig = typeof nextConfig === 'function'
      ? nextConfig(phase, { defaultConfig })
      : nextConfig
    
    const pageExtensions = nextConfig.pageExtensions || defaultConfig.pageExtensions
    const imageRegex = new RegExp(`\\.og\\.image\\.(${pageExtensions.join('|')})$`)
    return {
      webpack(config, options) {
        if (!options.isServer) return config
    
        config.module.rules.push({
          test: imageRegex,
          use: [
            { loader: 'next-plugin-imagegen-svg/loader' },
            options.defaultLoaders.babel,
          ],
        })

        const defaultEntry = config.entry
        config.entry = async (...args) => {
          const entries = await defaultEntry(...args)
          const imagePaths = await collectPaths(findPagesDir(), imageRegex)

          imagePaths
            .forEach(file => {
              if (!file.includes('/api/'))
                throw new Error(`> ${file} should be placed under pages/api/ folder`)
              const pagePath = join('pages', file.replace(imageRegex, '.og.image'))
              // console.log('pagePath', pagePath)
              entries[ pagePath ] = [
                // join('private-next-pages', pagePath)
              ]
            })
    
          return entries
        }
        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options)
        }
        return config
      },
    }
  }

  return (phase, { defaultConfig }) => {
    return customConfig(phase, { defaultConfig }, nextConfig)
  }  
}