import axios from 'axios';

import { BetType, LeanBetDocument } from '../models/bet';
import { ActionMap, BetActionMap, CommandMap, NoActionMap } from './MapTypes';
import { MongooseClient } from './MongooseClient';

type ActionCallback = (name: string, data: string) => Promise<any>;
type BotOptions = {
    botId: string;
    dbClient: MongooseClient;
};

export class Bot {
    private GROUPME_POST_URI = 'https://api.groupme.com/v3/bots/post';
    private commandMap: CommandMap;
    private dbClient: MongooseClient;
    private botId: string;

    constructor(options: BotOptions) {
        this.commandMap = this.initCommands();
        this.dbClient = options.dbClient;
        this.botId = options.botId;
    }

    public hasCommand(command: keyof CommandMap) {
        return this.commandMap[command] ? true : false;
    }

    public hasAction(command: keyof CommandMap, action: keyof ActionMap) {
        const actionMap: ActionMap = this.commandMap[command];
        return actionMap[action];
    }

    public async work(
        command: keyof CommandMap,
        action: keyof ActionMap,
        data: string,
        name: string
    ) {
        const actionMap: ActionMap = this.commandMap[command];
        const callback = actionMap[action] as ActionCallback;
        const response = await callback.call(this, name, data);

        return await this.respond(response);
    }

    public async respond(message: string) {
        try {
            await axios({
                method: 'POST',
                url: this.GROUPME_POST_URI,
                data: {
                    bot_id: this.botId,
                    text: message,
                },
            });

            return message;
        } catch (err) {
            err;
        }
    }

    private initCommands(): CommandMap {
        const helpActionMap: NoActionMap = {
            '': this.help,
        };
        const betsActionMap: BetActionMap = {
            list: this.listActiveBets,
            add: this.addBet,
            remove: this.removeBet,
        };
        const statusActionMap = {
            '': this.status,
        };

        return {
            '!help': helpActionMap,
            '!bets': betsActionMap,
            '!status': statusActionMap,
        };
    }

    private async listActiveBets() {
        let responses: string[] = [];
        const activeBets: LeanBetDocument[] = await this.dbClient.getAllActiveBets();

        if (!activeBets.length) {
            return 'There are currently no active bets';
        }

        activeBets.forEach((activeBets) => {
            responses.push(
                `ID: ${activeBets.id}\nCreated By: ${activeBets.createdBy}\nCreated On: ${activeBets.createdAt}\nCriteria: ${activeBets.data}`
            );
        });

        return responses.join('');
    }

    private async addBet(name: string, data: string) {
        const createdBet: BetType = await this.dbClient.createBet(name, data);

        return `Created new bet with ID: ${createdBet.id}\nCriteria: ${createdBet.data}`;
    }

    private async removeBet(name: string, betId: string) {
        if (isNaN(Number(betId))) {
            return `Invalid Bet ID: ${betId}`;
        }

        const removedBet: LeanBetDocument = await this.dbClient.removeBet(
            name,
            betId
        );

        if (!removedBet) {
            return `No bet with ID: ${betId} was found`;
        }

        return `Removed bet with ID: ${removedBet.id}\nRemoved by: ${name}\nCriteria: ${removedBet.data}`;
    }

    private async help() {
        return `Available Commands:\n!help\n!bets\n\n- List all bets: !bets list\n\n- Add a new bet: !bets add NEW BET CRITERIA\n\n- Remove a bet:\n- First get the bet ID: !bets list\n\n- Then remove the bet using that id: !bets remove BET_ID`;
    }

    private async status() {
        return `Bout that action. Straight cash homie`;
    }
}
