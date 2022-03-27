import { AlexBotClientEvent } from '../types';

export const event: AlexBotClientEvent<'debug'> = {
  name: 'debug',
  condition: process.env.NODE_ENV !== 'production',
  listener: (_, message) => console.log(message),
};
