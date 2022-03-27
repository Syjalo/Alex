import { AlexBotClientEvent } from '../types';

export const event: AlexBotClientEvent<'warn'> = {
  name: 'warn',
  listener: (_, message) => console.log(message),
};
