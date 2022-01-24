"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Constants_1 = require("../util/Constants");
const Util_1 = require("../util/Util");
exports.default = (client) => {
    client.on('guildMemberRemove', (member) => {
        const leaveEmbed = new discord_js_1.MessageEmbed()
            .setAuthor({
            iconURL: member.displayAvatarURL(),
            name: member.displayName,
            url: Util_1.Util.makeUserURL(member.id),
        })
            .setTitle('Goodbye!')
            .setFields([
            {
                name: 'Username',
                value: `${member} \`${member.user.tag}\` (${member.id})`,
            },
            {
                name: 'Joined Discord',
                value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}> (<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>)`,
            },
            {
                name: 'Leave Server',
                value: `<t:${Math.floor(Date.now() / 1000)}> (<t:${Math.floor(Date.now() / 1000)}:R>)`,
            },
        ])
            .setColor('LIGHT_GREY');
        client.channels.resolve(Constants_1.Ids.channels.joinLeave).send({ embeds: [leaveEmbed] });
        const rolesToSave = Constants_1.Ids.rolesToSave.filter((roleId) => member.roles.cache.has(roleId));
        if (rolesToSave.length > 0) {
            client.db
                .collection('users')
                .findOneAndUpdate({ id: member.id }, { $set: { savedRoles: rolesToSave } }, { upsert: true });
        }
    });
};
