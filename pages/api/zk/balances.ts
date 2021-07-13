// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ZKAccountBalanceUSD, ZKSyncFetcher } from '../../../data/ZKSyncFetcher'
import Cors from "cors";

// Initializing the cors middleware
const cors = Cors({
  methods: ['POST', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse<ZKAccountBalanceUSD[]>, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ZKAccountBalanceUSD[]>
) {
  await runMiddleware(req, res, cors)
  const { body } = req
  if(!body || !body.accounts) {
    res.status(400).end();
    return
  }
  const { accounts } = body;
  const chainId: number = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? "4");
  const fetcher = new ZKSyncFetcher();
  await fetcher.connect(chainId);
  const query = await fetcher.fetchZKBalances(accounts);

  res.status(200).json(query);
}
