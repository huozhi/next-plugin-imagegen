const { withImagegen } = require('next-plugin-imagegen')

module.exports = withImagegen({
  provider: 'next-plugin-imagegen-puppeteer'
})()
