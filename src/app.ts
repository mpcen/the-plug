import express from "express";
import { urlencoded, json } from "body-parser";
import cors from "cors";

import { messageRouter } from "./routes/message";
import { membersRouter } from "./routes/members";

const app = express();

app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json());

app.use("/message", messageRouter);
app.use("/members", membersRouter);

app.get("/", (req, res) => res.send("ok"));

export { app };
