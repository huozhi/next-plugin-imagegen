const acorn = require('acorn')

async function imageGenLoader(svgComponent) {
  let componentName = null
  const { body } = acorn.parse(svgComponent, {
    sourceType: 'module',
    ecmaVersion: 11,
  })
  for (const node of body) {
    if (node.type === 'ExportDefaultDeclaration') {
      componentName = node.declaration.id.name
    }
  }

  if (componentName) {
    svgComponent = svgComponent.replace('export default', '')
  } else {
    throw new Error(`> default export 'Component' is not found`)
  }

  const transformed = `
    import React from 'react'
    import { renderToStaticMarkup } from 'react-dom/server'
    import { render } from 'next-plugin-imagegen-svg'
    
    ${svgComponent}
    
    export default async function imageGenHandler(req, res) {
      const { width = 1200, height = 627, type = 'png', ...props } = req.query || {}
      const element = React.createElement(${componentName}, props)
      const svg = renderToStaticMarkup(element)
      const buffer = await render(svg, { width: Number(width), height: Number(height), type })

      res.setHeader('Content-Type', 'image/' + type)
      res.setHeader('Content-Disposition', 'inline')
      res.send(buffer)
    }
  `
  return transformed
}

module.exports = imageGenLoader