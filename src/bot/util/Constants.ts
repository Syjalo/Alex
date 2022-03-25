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
  guilds: {
    main: '724163890803638273',
  },
  roles: {
    boosters: '748957661097361530',
    contributors: '846351712368197632',
    designer: '738949022232084501',
    developer: '724165923963142224',
    english: '942374071797157948',
    helpers: '888455491058036746',
    managment: '943188711640805376',
    moderators: '931064644234268722',
    muted: '786513508334305291',
    otherLanguages: '942663909494636544',
    pirate: '952235601397161994',
    russian: '942374026758725662',
    tester: '736854851870261259',
    translator: '738912009193521224',
    trialUnderHiatus: '945793405370376202',
    underHiatus: '893112744197357658',
    VIP: '846353111269507132',
    youtube: '773103034754269216',
  },
};

export const RolesToSave = [
  Ids.roles.contributors,
  Ids.roles.designer,
  Ids.roles.muted,
  Ids.roles.pirate,
  Ids.roles.tester,
  Ids.roles.translator,
  Ids.roles.VIP,
  Ids.roles.youtube,
];

export const Locales = Object.values(Locale);
