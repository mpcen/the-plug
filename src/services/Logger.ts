import { MessageProps } from '../models/message';
import { MongooseClient } from './MongooseClient';

export class Logger {
    constructor(private dbClient: MongooseClient) {
        this.dbClient = dbClient;
    }

    public async logMessage(props: MessageProps) {
        await this.dbClient.storeMessage(props);
    }
}
