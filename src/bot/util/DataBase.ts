import { MongoClient } from 'mongodb';
import { DBLanguage, DBUser } from '../types';

export class DataBase extends MongoClient {
  public get languages() {
    return this.db().collection<DBLanguage>('languages');
  }

  public get users() {
    return this.db().collection<DBUser>('users');
  }
}
