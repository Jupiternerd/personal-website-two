import { NextApiRequest, NextApiResponse } from 'next';
import { config } from 'dotenv';
import AssetPipeline, { AssetEnums } from '../../../app/utils/assetPipeline/getAssets';
import { PersistantUserInterface } from '../../../app/utils/struct/user';
import { NovelInterface } from '../../../app/utils/struct/novel';
import { compareChecks } from "../../../app/components/visualNovelComponents/VisualNovel";

config();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        query: { id },
        body
    } = req;
    const userData = body as PersistantUserInterface;

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
        let novel = await AssetPipeline.getAssets(AssetEnums.novel, parseInt(id as string)) as NovelInterface;

        if (!novel) {
            return res.status(404).send('Novel not found for id: ' + parseInt(id as string));
        }

        if (novel?.checks) {
            // for every key in checks, check if the user has the key and the value matches as well.
            if (!compareChecks(novel.checks, userData.flags)) {
                return res.status(403).send('Bad request : checks');
            }
        }

        res.status(200).json(novel);
    } catch (err) {
        res.status(500).send(err.message);
    }
}