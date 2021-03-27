import mongoose from 'mongoose';

export type BetType = {
    id: number;
    createdAt: Date | string;
    createdBy: string;
    removedBy: string;
    active: boolean;
    data: string;
};

export type LeanBetDocument = mongoose.LeanDocument<BetType>;

const betSchema = new mongoose.Schema({
    id: Number,
    createdAt: Date,
    createdBy: String,
    removedBy: String,
    active: Boolean,
    data: String,
});

const Bet: mongoose.Model<mongoose.Document<BetType>> = mongoose.model(
    'Bet',
    betSchema
);

export { Bet };
