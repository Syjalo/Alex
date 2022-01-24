"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = void 0;
const Constants_1 = require("./Constants");
class Util extends null {
    static resolveLocale(locale) {
        if (!locale || !Constants_1.Locales.includes(locale))
            return 'en-US';
        return locale;
    }
    static makeUserURL(id) {
        return `https://discord.com/users/${id}`;
    }
    static makeFormattedTime(timestamp) {
        return `<t:${timestamp}> (<t:${timestamp}:R>)`;
    }
}
exports.Util = Util;
