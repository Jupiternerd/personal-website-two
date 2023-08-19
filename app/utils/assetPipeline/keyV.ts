import Keyv from "keyv";

export default class KeyV {
    static db: Keyv = new Keyv({
        // five minutes
        ttl: 300000,
    });
}