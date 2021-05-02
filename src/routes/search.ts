import { Router } from "express";

import { MongooseClient } from "../services/MongooseClient";

const router = Router();
const dbClient = new MongooseClient();

router.get("/message", async (req, res) => {
    res.send("ok");
});

router.post("/message", async (req, res) => {
    const { text } = req.body;

    if (!text) {
        res.status(400).send({ message: "You must enter some text " });
    }

    const results = await dbClient.getMessages(text);

    res.send(results);
});

export { router as searchRouter };
