import { Bet, BetType, LeanBetDocument } from "../models/bet";
import { BetId, LeanBetIdType } from "../models/betId";
import { Message, MessageDoc } from "../models/message";

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

    public async storeMessage(props: MessageDoc) {
        await new Message(props).save();
    }

    public async getMessages(searchText: string) {
        const messages = await Message.find({
            text: { $regex: searchText, $options: "i" },
        });
        const sortedMessages = messages.sort(
            (mA: MessageDoc, mB: MessageDoc) => {
                if (mA.created_at < mB.created_at) return 1;
                return -1;
            }
        );

        return sortedMessages;
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
