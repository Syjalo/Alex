"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Constants_1 = require("../util/Constants");
exports.default = (client) => {
    client.once('ready', async () => {
        await client.guilds.resolve(Constants_1.Ids.guilds.main).commands.set(client.commands.map((c) => c));
        await client.guilds
            .resolve(Constants_1.Ids.guilds.main)
            .commands.fetch()
            .then((cmds) => cmds.forEach((cmd) => {
            const command = client.commands.get(cmd.name);
            if (command?.allowedRoles) {
                if (cmd.defaultPermission)
                    cmd.setDefaultPermission(false);
                cmd.permissions.set({
                    permissions: command.allowedRoles.map((id) => ({
                        id,
                        type: 'ROLE',
                        permission: true,
                    })),
                });
            }
            else if (!cmd.defaultPermission)
                cmd.setDefaultPermission(true);
        }));
        console.log('Ready!');
        if (!process.env.PRODUCTION)
            return;
        const readyEmbed = new discord_js_1.MessageEmbed().setTitle('Ready!').setColor('GREEN');
        client.channels.resolve(Constants_1.Ids.channels.botLog).send({ embeds: [readyEmbed] });
    });
};
