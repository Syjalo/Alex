import { AlexBotClientEvent } from '../types';

export const event: AlexBotClientEvent<'cacheSweep'> = {
  name: 'cacheSweep',
  listener: (client, message) => console.log(`[Shard ${client.ws.shards.first()!.id}] ${message}`),
};
