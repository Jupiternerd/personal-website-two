// author = shokkunn

import { Db, MongoClient } from "mongodb"

export enum Databases {
    static = "static",
    // uhhh
}

export default class Mango {
    // variables
    static client: MongoClient;
    static retries: number = 0;
    static readonly retryLimit: number = 5;
    /**
     * @name con
     * @desc Connects to mongodb server using the URI stored in env
     * @param {string} URI The URI to connect to.
     * @returns {Promise<void>} Information about the connection.
     */
    static async connect(URI: string): Promise<void> {
        // new MongoClient if the client is not initialized
        if (!this.client) this.client = new MongoClient(URI);

        try {
            // Connect to the client
            await this.client.connect()
        } catch (error) {
            // if the retry limit is reached, throw the error
            if (this.retries >= this.retryLimit) throw error;
            // increment the retries
            this.retries++;
            // try to connect again
            await this.connect(URI);
        }
    }

    /**
     * @name getDB
     * @desc Gets a database from the client.
     * @param databaseName 
     * @returns {Db} The database.
     */
    static getDB(databaseName: Databases): Db {
        return this.client.db(databaseName);
    }
}
