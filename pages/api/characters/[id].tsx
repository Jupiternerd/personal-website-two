import { NextApiRequest, NextApiResponse } from 'next';
import { config } from 'dotenv';
import AssetPipeline, { AssetEnums } from '../../../app/utils/assetPipeline/getAssets';
import { UserInterface } from '../../../app/utils/struct/user';

config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        query: { id },
        body
    } = req;

    const userData = body as UserInterface;

    try {
        if (!userData) return res.status(403).send('Bad request');
        if (userData.blacklisted) {
            return res.status(403).send('User blacklisted');
        }
    }
    catch (err) {
        return res.status(500).send(err.message);
    }

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