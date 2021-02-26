import { NextApiRequest, NextApiResponse } from 'next'

type MicrolinkProviderOptions = {
  apiKey?: string,
  ttl?: string | number,
  headers?: object,
  device?: string,
  viewport?: object,
  colorScheme?: string,
}

export type SnapshotProivider = (url: string, req: NextApiRequest, res: NextApiResponse) => Promise<any>
export function provider(options: MicrolinkProviderOptions): SnapshotProivider
export function handler(snapshot: any): (req: NextApiRequest, res: NextApiResponse) => Promise<any>
export function withImagegen(nextConfig: any): object
