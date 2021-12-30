import { NextApiRequest, NextApiResponse } from 'next'

export type ProviderOptions = {
  type?: string,
  viewport?: object,
  colorScheme?: string,
  omitBackground?: boolean,
}

type MicrolinkProviderOptions = ProviderOptions & {
  apiKey?: string,
  ttl?: string | number,
  headers?: object,
}

export type SnapshotProvider = (url: string, req: NextApiRequest, res: NextApiResponse) => Promise<any>
export function provider(options: MicrolinkProviderOptions): SnapshotProvider
export function handler(snapshot: any): (req: NextApiRequest, res: NextApiResponse) => Promise<any>
export function withImagegen(nextConfig: any): object
