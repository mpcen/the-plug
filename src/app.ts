import express from 'express';
import { urlencoded, json } from 'body-parser';

import { messageRouter } from './routes/message';

const app = express();

app.use(urlencoded({ extended: true }));
app.use(json());

app.use('/message', messageRouter);

export { app };
