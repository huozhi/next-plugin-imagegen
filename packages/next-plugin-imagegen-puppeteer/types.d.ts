import { SnapshotProivider } from 'next-plugin-imagegen'

export type PuppeteerProviderOptions = {
  headers?: object,
  device?: string,
  viewport?: object,
  colorScheme?: string,  
  type?: string,
  quality?: number,
  clip?: any,
  omitBackground?: boolean,
}

export function provider(options: PuppeteerProviderOptions): SnapshotProivider
