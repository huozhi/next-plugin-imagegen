import { SnapshotProvider } from 'next-plugin-imagegen'

export type SvgProviderOptions = {
  width?: number,
  height?: number,
}

export function provider(options: SvgProviderOptions): SnapshotProvider
