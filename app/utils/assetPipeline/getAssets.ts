import KeyV from "./keyV";
import Mango, { Databases } from "./mango";
import { config } from 'dotenv';
import { CharacterInterface } from '../../../app/utils/struct/character';
import { NovelInterface } from "../struct/novel";

config();

export enum AssetEnums {
    "character",
    "novel"
}

export default class AssetPipeline {
    static async getAssets(assetEnum: AssetEnums, id: number) {
        let asset: any, key: string = `${assetEnum}_${id}`;
        switch (assetEnum) {
            case AssetEnums.character:
                asset = await KeyV.db.get(key);
                break;
            case AssetEnums.novel:
                asset = await KeyV.db.get(key);
                break;
        }
        if (!asset) {
            // get from Mongodb

            try {
                if (!Mango.client) await Mango.connect(process.env.MONGO_API_KEY as string);
                const db = Mango.getDB(Databases.static);
                switch (assetEnum) {
                    case AssetEnums.character:
                        asset = await db.collection<CharacterInterface>("characters").findOne({ _id: id });
                        break;
                    case AssetEnums.novel:
                        asset = await db.collection<NovelInterface>("novels").findOne({ _id: id });
                        break;
                }

                if (asset) {
                    await KeyV.db.set(key, asset);
                } else {
                    throw new Error(`Asset ${id} not found!`);
                }
            } catch (error) {
                throw error;
            }
        }

        return asset;
    }
}