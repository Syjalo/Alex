import { Client, ClientOptions, Collection, Colors, Formatters, TextChannel, UnsafeEmbed as Embed } from 'discord.js';
import { inspect } from 'util';
import { database } from '../../database';
import * as CommandsModule from '../commands';
import * as EventsModule from '../events';
import { AlexBotChatInputCommand } from '../types';
import { Ids } from './Constants';

export class AlexBotClient extends Client<true> {
  public commands = new Collection<string, AlexBotChatInputCommand>();

  public constructor(options: ClientOptions) {
    super(options);

    if (process.env.NODE_ENV !== 'production') this.on('debug', console.log);
    this.on('error', async (error) => {
      console.log(error);
      const embed = new Embed()
        .setTitle('An error occurred')
        .setDescription(Formatters.codeBlock(inspect(error).substring(0, 4089)))
        .setColor(Colors.Red);
      await (this.channels.resolve(Ids.channels.botLog) as TextChannel).send({
        content: `<@${Ids.developer}>`,
        embeds: [embed],
      });
    });
    this.on('warn', console.log);

    for (const module of Object.values(CommandsModule)) this.commands.set(module.command.data.name, module.command);
    for (const module of Object.values(EventsModule)) {
      if (module.event.once) {
        // @ts-ignore
        this.once(module.event.name, (...args) => module.event.listener(this, ...args));
      } else {
        // @ts-ignore
        this.on(module.event.name, (...args) => module.event.listener(this, ...args));
      }
    }
  }

  public async login(token?: string) {
    await database.awaitReady;
    return super.login(token);
  }
}
