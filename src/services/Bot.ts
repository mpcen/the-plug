import axios from "axios";
import { BetType, LeanBetDocument } from "../models/bet";
import {
    ActionMap,
    BetActionMap,
    CommandMap,
    NoActionMap,
    RandomizeActionMap,
} from "./MapTypes";
import { MongooseClient } from "./MongooseClient";
import { formatRelative, subDays } from "date-fns";

type ActionCallback = (name: string, data: string) => Promise<any>;
type BotOptions = {
    botId: string;
    dbClient: MongooseClient;
};

export class Bot {
    private GROUPME_POST_URI = "https://api.groupme.com/v3/bots/post";
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

    public hasCommandButNoAction(command: keyof CommandMap) {
        return command === "!randomize";
    }

    public async work(
        command: keyof CommandMap,
        action: keyof ActionMap,
        data: string,
        name: string
    ) {
        const actionMap: ActionMap = this.commandMap[command];
        const callback = actionMap[action] as ActionCallback;

        if (action === "list") {
            const responses = await callback.call(this, name, data);

            for (const response of responses) {
                await this.respond(response);
            }

            return responses.join("");
        } else {
            const response = await callback.call(this, name, data);

            return await this.respond(response);
        }
    }

    // axios bot message client
    public async respond(message: string) {
        try {
            await axios({
                method: "POST",
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
            "": this.help,
        };
        const betsActionMap: BetActionMap = {
            list: this.listActiveBets,
            add: this.addBet,
            remove: this.removeBet,
        };
        const statusActionMap: NoActionMap = {
            "": this.status,
        };
        const randomizeActionMap: RandomizeActionMap = {
            "": this.randomize,
        };

        return {
            "!help": helpActionMap,
            "!bets": betsActionMap,
            "!status": statusActionMap,
            "!randomize": randomizeActionMap,
        };
    }

    private randomize(name: string, data: string) {
        let [numberOfTeams, ...players] = data.split(" ");
        const numberOfPlayers = players.length;
        const teams = [];

        console.log("Players Before:", players);

        // http://en.wikipedia.org/wiki/Fisher-Yates_shuffle#The_modern_algorithm
        for (let i = players.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [players[i], players[j]] = [players[j], players[i]];
        }

        for (let i = 0; i < Number(numberOfTeams); i++) {
            const [...teamMembers] = players.splice(
                0,
                numberOfPlayers / Number(numberOfTeams)
            );

            teams.push(teamMembers);
        }

        let message = "";

        for (let i = 0; i < teams.length; i++) {
            let teamMessage = `TEAM ${i + 1}: `;

            for (let j = 0; j < numberOfPlayers / Number(numberOfTeams); j++) {
                teamMessage += teams[i][j] + " ";
            }

            message += teamMessage + "\n";
        }

        return message;
    }

    private async listActiveBets() {
        let responses: string[] = [];
        const activeBets: LeanBetDocument[] =
            await this.dbClient.getAllActiveBets();

        if (!activeBets.length) {
            return "There are currently no active bets";
        }

        activeBets.forEach((activeBets) => {
            responses.push(
                `ID: ${activeBets.id}\n* Created By: ${
                    activeBets.createdBy
                }\n* Created: ${formatRelative(
                    subDays(new Date(activeBets.createdAt), 3),
                    new Date(activeBets.createdAt)
                )}\n* Criteria: ${activeBets.data}\n\n\n`
            );
        });

        return responses;
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

    private help() {
        return `COMMANDS:\n--------\n!help\n!status\n!bets\n!randomize\n\nACTIONS:\n--------\n* !bets list: Lists all bets\n* !bets add NEW BET CRITERIA: Adds a new bet\n* !bets remove BET_ID: Removes a bet. You must first get the bet id using !bets list\n* !status: Returns the bot status\n* !randomize TEAM_SIZE PLAYERS: Example: !randomize 2 p1 p2 p3 p4\n* !help: Shows available commands and actions`;
    }

    private status() {
        return `Bout that action. Straight cash homie`;
    }

    private search() {
        return `Search page --> ${process.env.SEARCH_CLIENT_URI}`;
    }
}
