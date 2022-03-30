import { MongoClient, MongoClientOptions } from 'mongodb';
import { DBLanguage, DBUser } from './types';

export class DatabaseClient extends MongoClient {
  public awaitReady: Promise<void>;

  public constructor(url: string, options?: MongoClientOptions) {
    super(url, options);

    this.awaitReady = new Promise((resolve) => this.once('connectionReady', resolve));
  }

  public get languages() {
    return this.db().collection<DBLanguage>('languages');
  }

  public get users() {
    return this.db().collection<DBUser>('users');
  }
}
