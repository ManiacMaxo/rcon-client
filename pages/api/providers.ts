import { NextApiRequest, NextApiResponse } from 'next'
import { getProviders } from 'next-auth/client'

export default async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> => {
    const providers = await getProviders()
    // console.log('Providers', providers)
    res.send(providers)
}
