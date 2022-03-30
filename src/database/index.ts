import { DatabaseClient } from './DatabaseClient';

export const database = new DatabaseClient(process.env.MONGO_URL!);

database.connect();
