const { BetModel, NextBetIdModel } = require('../db');

function betsAdd(data, name) {
	return new Promise((resolve, reject) => {
		if(!data.length) {
			return reject(
				`
				\nYou must add a bet criteria\n
				`
			);
		}

		NextBetIdModel.findOneAndUpdate({}, {$inc: { nextBetId: 1 }}, (err, doc) => {
			const bet = new BetModel({
				id: doc.nextBetId,
				createdAt: Date.now(),
				createdBy: name,
				active: true,
				data
			});

			bet.save()
				.then(() => {
					resolve(`
						\nSaved bet: ${data}\n
					`);
				})
				.catch(() => {
					reject(`
						\nThere was an error saving the bet. Manny prob f'd up somewhere...\n
					`);
				});
		});
	
	});
}

function betsView() {
	return new Promise((resolve, reject) => {
		let betResponses = [];

		BetModel.countDocuments({ active: true }, (err, count) => {
			if(!count) {
				return reject(`
					\nThere are no active bets\n	
				`);
			}

			BetModel.find({ active: true }, (err, docs) => {
				betResponses = docs.map(({ id, createdBy, data }) => {
					return `
						\nID: ${id}\nCREATED BY: ${createdBy}\nCRITERIA: ${data}\n
					`;
				});

				return resolve(betResponses);
			});
		});
	});
}

function betsRemove(betId) {
	return new Promise((resolve, reject) => {
		if(betId === '') {
			reject(`
				\nYou're missing a bet ID. Try '!bets view' to find the bet ID\n
			`);
			return;
		}

		BetModel.findOneAndUpdate({ id: betId, active: true }, { active: false }, (err, doc) => {
			if(!doc) {
				reject(`
					\nBet with ID [${betId}] has already been removed or doesn't exist\n
				`);
				return;
			}

			resolve(`
				\nBet with ID [${betId}] has been removed\n
			`);
		});
	});
}

function betsHelp() {
	return Promise.resolve(`
		\nBelow are the available commands for !bets:\n
		!bets add BET_CRITERIA_HERE\n
		!bets view\n
		!bets remove BET_ID\n
	`);
}

module.exports = {
	betsRemove,
	betsView,
	betsAdd,
	betsHelp
};