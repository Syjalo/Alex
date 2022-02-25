import { MongoClient } from 'mongodb';
import { DBHostname, DBLanguage, DBUser } from '../types';

export class DataBase extends MongoClient {
  public get hostnamesBlacklist() {
    return this.db().collection<DBHostname>('hostnamesBlacklist');
  }

  public get hostnamesWhitelist() {
    return this.db().collection<DBHostname>('hostnamesWhitelist');
  }

  public get languages() {
    return this.db().collection<DBLanguage>('languages');
  }

  public get users() {
    return this.db().collection<DBUser>('users');
  }
}
