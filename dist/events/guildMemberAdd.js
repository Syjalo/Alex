"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Constants_1 = require("../util/Constants");
const Util_1 = require("../util/Util");
exports.default = (client) => {
    client.on('guildMemberAdd', async (member) => {
        const userJoinedDiscordAgo = Date.now() - member.user.createdTimestamp;
        let color;
        if (userJoinedDiscordAgo > 1000 * 60 * 60 * 24 * 28) {
            color = 'GREEN';
        }
        else if (userJoinedDiscordAgo > 1000 * 60 * 60 * 14) {
            color = 'YELLOW';
        }
        else {
            color = 'RED';
        }
        const joinEmbed = new discord_js_1.MessageEmbed()
            .setAuthor({
            iconURL: member.displayAvatarURL(),
            name: member.displayName,
            url: Util_1.Util.makeUserURL(member.id),
        })
            .setTitle('Welcome!')
            .addFields([
            {
                name: 'Username',
                value: `${member} \`${member.user.tag}\` (${member.id})`,
            },
            {
                name: 'Created account',
                value: Util_1.Util.makeFormattedTime(Math.floor(member.user.createdTimestamp / 1000)),
            },
            {
                name: 'Joined Server',
                value: Util_1.Util.makeFormattedTime(Math.floor(member.joinedTimestamp / 1000)),
            },
        ])
            .setColor(color);
        client.channels.resolve(Constants_1.Ids.channels.joinLeave).send({ embeds: [joinEmbed] });
        const usersCollection = client.db.collection('users'), dbUser = await usersCollection.findOne({ id: member.id });
        if (dbUser && dbUser.savedRoles) {
            member.roles.add(dbUser.savedRoles);
            usersCollection.findOneAndUpdate({ id: member.id }, { $unset: { savedRoles: true } });
        }
    });
};
