require('dotenv').config();

import mongoose from 'mongoose';

import { app } from './app';

const start = async () => {
    const PORT = process.env.PORT || 5113;

    mongoose.connect(process.env.MONGO_URI as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });

    mongoose.connection.on('connected', function () {
        console.log('Connected to DB');

        app.listen(PORT, () => {
            console.log('Server running on port', PORT);
        });
    });

    mongoose.connection.on('error', function () {
        throw new Error('Failed to connect to DB');
    });
};

start();
