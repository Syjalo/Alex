"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataBase = void 0;
const mongodb_1 = require("mongodb");
class DataBase extends mongodb_1.MongoClient {
    collection(name, options = {}) {
        const { db } = options;
        return this.db(db).collection(name, options);
    }
}
exports.DataBase = DataBase;
