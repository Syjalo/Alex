import { MongoClient, MongoClientOptions } from 'mongodb';
import { DBGuild, DBLanguage, DBMember } from './types';

export class DatabaseClient extends MongoClient {
  public awaitReady: Promise<void>;

  public constructor(url: string, options?: MongoClientOptions) {
    super(url, options);

    this.awaitReady = new Promise((resolve) => this.once('connectionReady', resolve));
  }

  public get guilds() {
    return this.db().collection<DBGuild>('guilds');
  }

  public get languages() {
    return this.db().collection<DBLanguage>('languages');
  }

  public get members() {
    return this.db().collection<DBMember>('members');
  }
}
