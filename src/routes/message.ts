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
    try {
        const { sender_type, name, text } = req.body;

        console.log(`[${new Date().toISOString()}] Incoming message:`, { sender_type, name, text });

        // Respond immediately to avoid GroupMe timeout
        res.sendStatus(200);

        if (sender_type !== "bot" && text) {
            const textSplit: [keyof CommandMap, keyof ActionMap] = text.split(" ");
            const [maybeCommand, maybeAction] = textSplit;

            console.log(`[${new Date().toISOString()}] Parsed:`, { maybeCommand, maybeAction });

            if (bot.hasCommand(maybeCommand)) {
                console.log(`[${new Date().toISOString()}] Command found: ${maybeCommand}`);
                if (bot.hasCommandButNoAction(maybeCommand)) {
                    const command = maybeCommand;
                    const data = textSplit.slice(1).join(" ");

                    await bot.work(command, "" as never, data, name);
                    console.log(`[${new Date().toISOString()}] Command executed: ${command}`);
                    return;
                }

                if (bot.hasAction(maybeCommand, maybeAction ?? "")) {
                    const command = maybeCommand;
                    const action = maybeAction ?? "";
                    const data = textSplit.slice(2).join(" ");

                    await bot.work(command, action, data, name);
                    console.log(`[${new Date().toISOString()}] Command executed: ${command} ${action}`);
                    return;
                }
            }
        }
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error processing message:`, error);
    }
});

export { router as messageRouter };
