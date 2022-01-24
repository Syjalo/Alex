"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../util/Constants");
exports.default = (client) => {
    client.on('messageReactionAdd', (reaction, user) => {
        if (reaction.message.channel.id === Constants_1.Ids.channels.suggestions && reaction.message.author.id === user.id)
            reaction.users.remove(user.id);
    });
};
