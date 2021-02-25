import { handler /* , defaultProvider */ } from 'next-plugin-imagegen'
import provider from 'next-plugin-imagegen-puppeteer'

export default handler(provider)