import { Router } from "express";

import { ActionMap, CommandMap } from "../services/MapTypes";
import { Bot } from "../services/Bot";
import { MongooseClient } from "../services/MongooseClient";

const router = Router();
const dbClient = new MongooseClient();
const bot = new Bot({ botId: process.env.BOT_ID as string, dbClient });

router.get("/", async (req, res) => {
    res.send(200);
});

router.post("/", async (req, res) => {
    const { sender_type, name, text } = req.body;

    // Respond immediately to avoid GroupMe timeout
    res.sendStatus(200);

    if (sender_type !== "bot") {
        const textSplit: [keyof CommandMap, keyof ActionMap] = text.split(" ");
        const [maybeCommand, maybeAction] = textSplit;

        if (bot.hasCommand(maybeCommand)) {
            if (bot.hasCommandButNoAction(maybeCommand)) {
                const command = maybeCommand;
                const data = textSplit.slice(1).join(" ");

                await bot.work(command, "" as never, data, name);
                return;
            }

            if (bot.hasAction(maybeCommand, maybeAction ?? "")) {
                const command = maybeCommand;
                const action = maybeAction ?? "";
                const data = textSplit.slice(2).join(" ");

                await bot.work(command, action, data, name);
                return;
            }
        }
    }
});

export { router as messageRouter };
