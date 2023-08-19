import { NextApiRequest, NextApiResponse } from 'next';
import { config } from 'dotenv';
import AssetPipeline, { AssetEnums } from '../../../app/utils/assetPipeline/getAssets';

config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        query: { id },
    } = req;

    try {
        let novel = await AssetPipeline.getAssets(AssetEnums.novel, parseInt(id as string));
        if (!novel) {
            return res.status(404).send('Novel not found for id: ' + parseInt(id as string));
        }
        res.status(200).json(novel);
    } catch (err) {
        res.status(500).send(err.message);
    }
}