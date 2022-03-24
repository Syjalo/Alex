import { Locale } from '../types';

export const Emojis = {
  allowed: '<:allowed:948824918500474891>',
  bot: '<:bot:956422453947682826>',
  denied: '<:denied:948824918815043634>',
  dnd: '<:dnd:948828496841551892>',
  idle: '<:idle:948828495474229278>',
  offline: '<:offline:948828496027869194>',
  online: '<:online:948828497550409738>',
};

export const Ids = {
  channels: {
    botLog: '935189941565157398',
    joinLeave: '855823003392933898',
    report: '936973723154665524',
    suggestions: '779985257000730684',
  },
  developer: '406028548034396160',
  roles: {
    developer: '724165923963142224',
    managment: '943188711640805376',
    moderators: '931064644234268722',
    underHiatus: '893112744197357658',
    trialUnderHiatus: '945793405370376202',
    helpers: '888455491058036746',
    contributors: '846351712368197632',
    VIP: '846353111269507132',
    boosters: '748957661097361530',
    english: '942374071797157948',
    russian: '942374026758725662',
    otherLanguages: '942663909494636544',
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
};

export const Locales = Object.values(Locale);
