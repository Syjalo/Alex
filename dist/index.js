"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_process_1 = __importDefault(require("node:process"));
const discord_js_1 = require("discord.js");
const dotenv_1 = require("dotenv");
const AlexClient_1 = require("./util/AlexClient");
const Constants_1 = require("./util/Constants");
if (!node_process_1.default.env.DISCORD_TOKEN)
    (0, dotenv_1.config)();
const client = new AlexClient_1.AlexClient({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MEMBERS,
        discord_js_1.Intents.FLAGS.GUILD_INTEGRATIONS,
        discord_js_1.Intents.FLAGS.GUILD_PRESENCES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
    partials: ['CHANNEL', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'USER'],
});
client.login();
node_process_1.default.on('SIGINT', async () => {
    await client.db.close();
    client.destroy();
    node_process_1.default.exit();
});
node_process_1.default.on('SIGTERM', async () => {
    const destroyEmbed = new discord_js_1.MessageEmbed().setTitle('Scheduled restart').setColor('YELLOW');
    await Promise.all([
        client.channels.resolve(Constants_1.Ids.channels.botLog).send({ embeds: [destroyEmbed] }),
        client.db.close(),
    ]);
    client.destroy();
    node_process_1.default.exit();
});
