"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlexClient = void 0;
const discord_js_1 = require("discord.js");
const CommandsModule = __importStar(require("../commands"));
const EventsModule = __importStar(require("../events"));
const DataBase_1 = require("./DataBase");
class AlexClient extends discord_js_1.Client {
    constructor() {
        super(...arguments);
        this.commands = new discord_js_1.Collection();
        this.db = new DataBase_1.DataBase(process.env.MONGO_URL);
    }
    async login(token) {
        for (const command of Object.values(CommandsModule))
            this.commands.set(command.default.name, command.default);
        for (const event of Object.values(EventsModule))
            event.default(this);
        await this.db.connect();
        return super.login(token);
    }
}
exports.AlexClient = AlexClient;
