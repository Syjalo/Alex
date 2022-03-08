import { readdirSync } from 'node:fs';
import { Locale } from '../types';

export const ids = {
  channels: {
    botLog: '935189941565157398',
    joinLeave: '855823003392933898',
    reports: '936973723154665524',
    suggestions: '779985257000730684',
  },
  guilds: {
    main: '724163890803638273',
  },
  roles: {
    developer: '724165923963142224',
    english: '942374071797157948',
    managment: '943188711640805376',
    moderators: '931064644234268722',
    otherLanguages: '942663909494636544',
    russian: '942374026758725662',
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

export const locales = readdirSync('./strings') as Locale[];
