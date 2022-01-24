"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Util_1 = require("../../util/Util");
const command = {
    name: 'userinfo',
    description: 'Gives information about user',
    options: [
        {
            type: 'USER',
            name: 'user',
            description: 'User to give information about',
        },
        {
            type: 'STRING',
            name: 'id',
            description: 'Id of user to give information about',
        },
    ],
    async listener(interaction, client, getString) {
        let user, member = interaction.options.getMember('user'), id = interaction.options.getString('id');
        if (member)
            user = member.user;
        else if (id) {
            user = await client.users.fetch(id).catch(() => {
                throw 'userNotFound';
            });
            member = interaction.guild.members.resolve(id);
        }
        else {
            user = interaction.user;
            member = interaction.member;
        }
        const embed = new discord_js_1.MessageEmbed()
            .setAuthor({ name: member?.displayName ?? user.username, url: Util_1.Util.makeUserURL(user.id) })
            .setThumbnail(member?.displayAvatarURL({ dynamic: true }) ?? user.displayAvatarURL({ dynamic: true }))
            .setColor(member?.displayColor || 'LIGHT_GREY');
        embed.addField('Username', `${user} \`${user.tag}\` (${user.id})`);
        if (member) {
            let emoji, statusName = member?.presence?.status;
            switch (member?.presence?.status) {
                case 'online':
                    emoji = '<:online:857254722276294656>';
                    break;
                case 'idle':
                    emoji = '<:idle:857254721281327145>';
                    break;
                case 'dnd':
                    emoji = '<:dnd:857254721748598786>';
                    break;
                default:
                    emoji = '<:offline:857254722590343199>';
                    statusName = 'offline';
                    break;
            }
            const platforms = member?.presence?.clientStatus ? Object.keys(member?.presence?.clientStatus) : [];
            const status = `${emoji} ${getString(`embed.field.status.values.status.${statusName}`)} ${(() => platforms.length
                ? `(${platforms.map((platform) => getString(`embed.field.status.values.platform.${platform}`)).join(', ')})`
                : '')()}`;
            embed.addField(getString('embed.field.status.name'), status);
        }
        embed.addField(getString('embed.field.createdAccount.name'), Util_1.Util.makeFormattedTime(Math.floor(user.createdTimestamp / 1000)));
        if (member?.joinedTimestamp)
            embed.addField(getString('embed.field.joinedServer.name'), Util_1.Util.makeFormattedTime(Math.floor(member.joinedTimestamp / 1000)));
        if (member?.premiumSinceTimestamp)
            embed.addField(getString('embed.field.serverBooster.name'), Util_1.Util.makeFormattedTime(Math.floor(member.premiumSinceTimestamp / 1000)));
        const roles = member?.roles.cache
            .filter((role) => role.id !== member.guild.id)
            .sort((role1, role2) => role2.rawPosition - role1.rawPosition)
            .map((role) => `${role}`);
        if (roles && roles.length)
            embed.addField(getString('embed.field.roles.name', { variables: { count: roles.length } }), roles.join(', '));
        interaction.reply({ embeds: [embed] });
    },
};
exports.default = command;
