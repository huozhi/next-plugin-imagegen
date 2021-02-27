import { SnapshotProivider, ProviderOptions } from 'next-plugin-imagegen'

export type PuppeteerProviderOptions = ProviderOptions & {
  headers?: object,
  quality?: number,
  clip?: any,
}

export function provider(options: PuppeteerProviderOptions): SnapshotProivider
