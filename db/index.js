const mongoose = require('mongoose');
const { MONGO_URI } = require('../config');

mongoose.set('useFindAndModify', false);
mongoose.connect(
	MONGO_URI,
	{ useNewUrlParser: true }
);

const nextBetIdSchema = new mongoose.Schema({
	nextBetId: { type: Number, default: 0 }
});

const betSchema = new mongoose.Schema({
	id: Number,
	createdAt: Date,
	createdBy: String,
	active: Boolean,
	data: String
});

module.exports = {
	BetModel: mongoose.model('Bet', betSchema),
	NextBetIdModel: mongoose.model('NextBetId', nextBetIdSchema, 'nextBetId')
};