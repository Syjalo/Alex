import { Client, Collection } from 'discord.js';
import * as CommandsModule from '../commands';
import * as EventsModule from '../events';
import { Command } from '../types';
import { DataBase } from './DataBase';

export class AlexClient extends Client<true> {
  public commands = new Collection<string, Command>();

  public db: DataBase = new DataBase(process.env.MONGO_URL!);

  public async login(token?: string) {
    for (const command of Object.values(CommandsModule)) this.commands.set(command.default.name, command.default);
    for (const event of Object.values(EventsModule)) event.default(this);
    await this.db.connect();
    return super.login(token);
  }
}
