import { AlexBotClientEvent } from '../types';

export const event: AlexBotClientEvent<'cacheSweep'> = {
  name: 'cacheSweep',
  listener: (_, message) => console.log(message),
};
