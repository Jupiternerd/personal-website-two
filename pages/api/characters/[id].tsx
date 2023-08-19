import { NextApiRequest, NextApiResponse } from 'next';
import { config } from 'dotenv';
import AssetPipeline, { AssetEnums } from '../../../app/utils/assetPipeline/getAssets';

config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        query: { id },
    } = req;

    try {
        let ch = await AssetPipeline.getAssets(AssetEnums.character, parseInt(id as string));
        if (!ch) {
            return res.status(404).send('Ch not found');
        }

        res.status(200).json(ch);
    } catch (err) {
        res.status(500).send(err.message);
    }
}