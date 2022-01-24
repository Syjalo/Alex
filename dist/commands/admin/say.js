"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../../util/Constants");
const command = {
    name: 'say',
    description: 'Sends message',
    options: [
        {
            type: 'STRING',
            name: 'content',
            description: 'Message to send',
            required: true,
        },
        {
            type: 'CHANNEL',
            name: 'channel',
            description: 'Channel to send message in',
        },
    ],
    allowedRoles: [Constants_1.Ids.roles.communityManager],
    listener(interaction, client, getString) {
        const content = interaction.options.getString('content', true);
        let channel = interaction.options.getChannel('channel');
        channel ??= interaction.channel;
        if (!channel.isText())
            throw 'notTextChannel';
        channel.send(content);
        interaction.reply({ content: getString('sent', { variables: { channel: `${channel}` } }), ephemeral: true });
    },
};
exports.default = command;
