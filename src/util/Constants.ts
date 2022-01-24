import { readdirSync } from 'node:fs';

export const Ids = {
  channels: {
    botLog: '935189941565157398',
    suggestions: '779985257000730684',
    joinLeave: '855823003392933898',
  },
  guilds: {
    main: '724163890803638273',
  },
  roles: {
    communityManager: '749688507257323600',
  },
  rolesToSave: [
    '786513508334305291',
    '773103034754269216',
    '846353111269507132',
    '738949022232084501',
    '736854851870261259',
    '738912009193521224',
    '846351712368197632',
  ],
  users: {
    syjalo: '406028548034396160',
  },
};

export const Locales = readdirSync('./strings');
