import process from 'node:process';
import { Client, Collection } from 'discord.js';
import { SpotifyAPI } from '@statsfm/spotify.js';
import * as CommandsModule from '../commands';
import * as EventsModule from '../events';
import { Command } from '../types';
import { DataBase } from './DataBase';

export class AlexClient extends Client<true> {
  public commands = new Collection<string, Command>();

  public db = new DataBase(process.env.MONGO_URL!);

  public spotify = new SpotifyAPI({
    clientCredentials: {
      clientId: 'f57ed54bc6af45d0a770e985b6ea9bb7',
      clientSecret: process.env.SPOTIFY_SECRET,
    },
  });

  public async login(token?: string) {
    for (const command of Object.values(CommandsModule)) this.commands.set(command.default.name, command.default);
    for (const event of Object.values(EventsModule)) event.default(this);
    await this.db.connect();
    return super.login(token);
  }
}
