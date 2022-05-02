import { Client, ClientOptions, Collection } from 'discord.js';
import { database } from '../../database';
import * as CommandsModule from '../commands';
import * as EventsModule from '../events';
import { AlexBotChatInputCommand } from '../types';

export class AlexBotClient extends Client<true> {
  public commands = new Collection<string, AlexBotChatInputCommand>();

  public async login(token?: string) {
    await database.awaitReady;
    for (const module of Object.values(CommandsModule)) this.commands.set(module.command.data.name, module.command);
    for (const module of Object.values(EventsModule)) {
      if (typeof module.event.condition !== 'undefined' && !module.event.condition) continue;
      if (module.event.once) {
        // @ts-ignore
        this.once(module.event.name, (...args) => module.event.listener(this, ...args));
      } else {
        // @ts-ignore
        this.on(module.event.name, (...args) => module.event.listener(this, ...args));
      }
    }
    return super.login(token);
  }
}
