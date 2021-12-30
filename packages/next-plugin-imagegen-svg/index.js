const createSvg = (html, width = 200, height = 200) => {
  const svg = 
    `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>
      <foreignObject x='0' y='0' width='${width}' height='${height}'>
        ${html}
      </foreignObject>
    </svg>`

  return svg
}

function filterHtml(html = '') {
  return html
    .replace(/<!DOCTYPE html>/g, '')
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/g, '')
    .replace(/<link[\s\S]*?>[\s\S]*?\/>/g, '')
    .replace(/<html[\s\S]*?>/, `<html xmlns='http://www.w3.org/1999/xhtml'>`)
}

function provider(options = {}) {
  return async function middleware(url, req, res) {
    const rawHtml = await fetch(url).then(res => res.text())
    const html = filterHtml(rawHtml)
    const svg = createSvg(html, options.width, options.height)
    res.setHeader('Content-Type', 'image/svg+xml')
    res.send(svg)
  }
}

exports.provider = provider
