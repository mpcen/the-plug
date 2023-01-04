import { Bet, BetType, LeanBetDocument } from "../models/bet";
import { BetId, LeanBetIdType } from "../models/betId";

export class MongooseClient {
    public async getAllActiveBets() {
        const activeBetsDoc: LeanBetDocument[] = await Bet.find({
            active: true,
        }).lean();

        return activeBetsDoc;
    }

    public async createBet(name: string, data: string) {
        const nextBetId: number = await this.getNextBetId();
        const newBet: BetType = {
            id: nextBetId,
            createdAt: new Date().toISOString(),
            createdBy: name,
            removedBy: "",
            active: true,
            data,
        };

        await new Bet(newBet).save();

        return newBet;
    }

    public async removeBet(name: string, betId: string) {
        const removedBet: LeanBetDocument = await Bet.findOneAndUpdate(
            { id: parseInt(betId, 10) },
            { active: false, removedBy: name } as LeanBetDocument
        ).lean();

        return removedBet;
    }

    private async getNextBetId() {
        const betIdDoc: LeanBetIdType = await BetId.findOne({}).lean();

        if (!betIdDoc) {
            await new BetId().save();
            return 0;
        }

        await BetId.updateOne({}, { $inc: { nextBetId: 1 } });

        return betIdDoc.nextBetId + 1;
    }
}
