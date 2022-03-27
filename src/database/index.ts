import { DatabaseClient } from './DatabaseClinet';

export const database = new DatabaseClient(process.env.MONGO_URL!);
