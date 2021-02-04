import imagegenMiddleware from 'next-plugin-imagegen/middleware'

export default imagegenMiddleware(
  process.env.NODE_ENV === 'production' ? null : require('next-plugin-imagegen-puppeteer')
)
