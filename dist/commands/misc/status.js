"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const command = {
    name: 'status',
    description: 'Gives the bot status',
    listener(interaction, client, getString) {
        const { ping } = client.ws;
        let color;
        if (ping > 0 && ping < 250)
            color = 'GREEN';
        else if (ping < 500)
            color = 'YELLOW';
        else
            color = 'RED';
        const embed = new discord_js_1.MessageEmbed()
            .setTitle(getString('embed.title'))
            .addFields([
            {
                name: getString('embed.field.ping.name'),
                value: getString('embed.field.ping.value'),
            },
        ])
            .setColor(color);
        interaction.reply({ embeds: [embed] });
    },
};
exports.default = command;
