"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_timers_1 = require("node:timers");
const discord_js_1 = require("discord.js");
const intl_messageformat_1 = __importDefault(require("intl-messageformat"));
const Constants_1 = require("../util/Constants");
const Util_1 = require("../util/Util");
exports.default = (client) => {
    const cooldowns = new discord_js_1.Collection();
    client.on('interactionCreate', async (interaction) => {
        if (interaction.isCommand()) {
            const { commandName } = interaction;
            const command = client.commands.get(commandName);
            if (!command) {
                console.log(`Failed to get ${commandName} command`);
                return;
            }
            const getString = (key, options = {}) => {
                let { fileName = commandName, locale, variables } = options;
                locale = Util_1.Util.resolveLocale(locale);
                let enStrings = require(`../../strings/en-US/${fileName}`);
                let strings;
                try {
                    strings = require(`../../strings/${locale}/${fileName}`);
                }
                catch {
                    strings = require(`../../strings/en-US/${fileName}`);
                }
                key.split('.').forEach((keyPart) => {
                    try {
                        enStrings = enStrings[keyPart];
                        strings = strings[keyPart];
                    }
                    catch {
                        strings = enStrings;
                    }
                });
                let string;
                if (strings)
                    string = strings;
                else
                    string = enStrings;
                if (variables && typeof strings === 'string') {
                    try {
                        string = new intl_messageformat_1.default(string, locale, undefined, { ignoreTag: true }).format(variables);
                    }
                    catch (err) {
                        const embed = new discord_js_1.MessageEmbed()
                            .setTitle('There is a string with unexpected variables here')
                            .setDescription(`${err}\nLocale: \`${locale}\` File: \`${fileName}\` Key: \`${key}\``)
                            .setColor('RED');
                        client.channels.resolve(Constants_1.Ids.channels.botLog).send({
                            content: `<@${Constants_1.Ids.users.syjalo}>`,
                            embeds: [embed],
                        });
                    }
                }
                return string;
            };
            if (!cooldowns.has(commandName))
                cooldowns.set(commandName, new discord_js_1.Collection());
            const commandCooldowns = cooldowns.get(commandName), now = Date.now(), cooldownAmount = (command.cooldown ?? 3) * 1000;
            if (commandCooldowns.has(interaction.user.id)) {
                const cooldownUntil = commandCooldowns.get(interaction.user.id);
                if (now < cooldownUntil) {
                    const cooldownEmbed = new discord_js_1.MessageEmbed()
                        .setTitle(getString('cooldownExist', {
                        fileName: 'errors',
                        variables: { timestamp: Math.floor(cooldownUntil / 1000), command: `/${commandName}` },
                    }))
                        .setColor('RED');
                    interaction.reply({ embeds: [cooldownEmbed] });
                    return;
                }
            }
            if (interaction.member.permissions.has('KICK_MEMBERS')) {
                commandCooldowns.set(interaction.user.id, now + cooldownAmount);
                (0, node_timers_1.setTimeout)(() => commandCooldowns.delete(interaction.user.id), cooldownAmount);
            }
            try {
                await command.listener(interaction, client, getString);
            }
            catch (error) {
                if (error.stack) {
                    console.log(error);
                    const unexpectedErrorEmbed = new discord_js_1.MessageEmbed()
                        .setTitle(getString('unexpectedError', { fileName: 'errors', variables: { error: `${error.stack}` } }))
                        .setColor('RED');
                    interaction.reply({ embeds: [unexpectedErrorEmbed], ephemeral: true });
                }
                else {
                    const errorEmbed = new discord_js_1.MessageEmbed().setTitle(getString(error, { fileName: 'errors' })).setColor('RED');
                    interaction.reply({ embeds: [errorEmbed], ephemeral: true });
                }
            }
        }
    });
};
