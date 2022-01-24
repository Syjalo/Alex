import { Awaitable, ChatInputApplicationCommandData, CommandInteraction, Snowflake } from 'discord.js';
import { AlexClient } from './util/AlexClient';

export interface Command extends ChatInputApplicationCommandData {
  listener(interaction: CommandInteraction, client: AlexClient, getString: GetString): Awaitable<void>;
  allowedRoles?: Snowflake[];
  cooldown?: number;
}

export interface DBUser {
  id: Snowflake;
  savedRoles?: Snowflake[];
}

export interface GetStringOptions {
  variables?: Record<string, string | number>;
  fileName?: string;
  locale?: string;
}

export type GetString = <T extends any>(key: string, options?: GetStringOptions) => T;
