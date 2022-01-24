import { CollectionOptions, MongoClient } from 'mongodb';

export class DataBase extends MongoClient {
  collection<T>(name: string, options: CollectionOptions & { db?: string } = {}) {
    const { db } = options;
    return this.db(db).collection<T>(name, options);
  }
}
