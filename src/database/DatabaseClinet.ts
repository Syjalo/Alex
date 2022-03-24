import { MongoClient } from 'mongodb';
import { DBLanguage, DBUser } from './types';

export class DatabaseClient extends MongoClient {
  public awaitReady: Promise<void>;

  public constructor() {
    super(process.env.MONGO_URL!);

    this.awaitReady = new Promise((resolve) => this.once('connectionReady', resolve));

    this.connect();
  }

  public get languages() {
    return this.db().collection<DBLanguage>('languages');
  }

  public get users() {
    return this.db().collection<DBUser>('users');
  }
}
