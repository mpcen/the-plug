import mongoose from 'mongoose';

export type LeanBetIdType = mongoose.LeanDocument<BetIdType>;

type BetIdType = {
    nextBetId: number;
};

const betIdSchema = new mongoose.Schema({
    nextBetId: {
        type: Number,
        default: 0,
    },
});

const BetId: mongoose.Model<mongoose.Document<BetIdType>> = mongoose.model(
    'BetId',
    betIdSchema
);

export { BetId };
