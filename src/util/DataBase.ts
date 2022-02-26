import { MongoClient } from 'mongodb';
import { DBHostname, DBLanguage, DBUser } from '../types';

export class DataBase extends MongoClient {
  public get hostnames() {
    return this.db().collection<DBHostname>('hostnames');
  }

  public get languages() {
    return this.db().collection<DBLanguage>('languages');
  }

  public get users() {
    return this.db().collection<DBUser>('users');
  }
}
