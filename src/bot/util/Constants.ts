import { Locale } from '../types';

export const Emojis = {
  allowed: '<:allowed:995372622751740084>',
  bot: '<:bot:963707842936836097>',
  denied: '<:denied:995372603780894792>',
  dnd: '<:dnd:963706086068715551>',
  idle: '<:idle:963706086525923338>',
  offline: '<:offline:963706086555263006>',
  online: '<:online:963706086584627230>',
};

export const Ids = {
  channels: {
    botLog: '837363584434176120',
    devChat: '749684966413041807',
    devVoice: '920726481573929001',
  },
  developer: '406028548034396160',
  guilds: {
    main: '724163890803638273',
  },
  roles: {
    developer: '724165923963142224',
    english: '942374071797157948',
    helpers: '888455491058036746',
    managment: '943188711640805376',
    moderators: '931064644234268722',
    otherLanguages: '942663909494636544',
  },
};

export const Locales = Object.values(Locale);

export const PrivateChannels = [Ids.channels.devChat, Ids.channels.devVoice];
