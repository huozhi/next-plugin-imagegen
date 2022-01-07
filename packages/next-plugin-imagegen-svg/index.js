import { Canvas, Image } from '@napi-rs/canvas'

export async function render(svgContent, {type, width, height}) {
  function SVG(svg, ctx) {
    const { width, height } = ctx.canvas
    const img = new Image()

    img.src = Buffer.from(svg, 'utf-8')
    img.width = width
    img.height = height
    ctx.drawImage(img, 0, 0, width, height)
  }

  const canvas = new Canvas(width, height)
  const ctx = canvas.getContext('2d')

  
  SVG(svgContent, ctx)
  const buffer = await canvas.encode(type)
  return buffer
}
