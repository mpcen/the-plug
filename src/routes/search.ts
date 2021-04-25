import { Router } from 'express';

import { MongooseClient } from '../services/MongooseClient';

const router = Router();
const dbClient = new MongooseClient();

router.post('/message', async (req, res) => {
    const { text } = req.body;

    console.log('calling w', text);

    const results = await dbClient.getMessages(text);

    res.send(results);
});

export { router as searchRouter };
