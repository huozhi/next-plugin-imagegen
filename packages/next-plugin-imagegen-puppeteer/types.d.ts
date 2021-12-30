import { SnapshotProvider, ProviderOptions } from 'next-plugin-imagegen'

export type PuppeteerProviderOptions = ProviderOptions & {
  headers?: object,
  ttl?: number,
}

export function provider(options: PuppeteerProviderOptions): SnapshotProvider
