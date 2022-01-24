"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../util/Constants");
exports.default = (client) => {
    client.on('messageCreate', async (message) => {
        if (message.channel.id === Constants_1.Ids.channels.suggestions) {
            message.startThread({
                name: `[${message.member.displayName}] Suggestion Discutions`,
                reason: 'New suggestion',
            });
            await message.react('857336659465076737');
            await message.react('857336659619348540');
            return;
        }
    });
};
