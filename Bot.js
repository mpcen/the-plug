const { betsRemove, betsView, betsAdd, betsHelp } = require('./utils/betsUtil');
const help = require('./utils/helpUtil');

function buildCommandMap() {
	return new Map([
		[
			'!bets',
			new Map([
				['add', () => betsAdd],
				['view', () => betsView],
				['remove', () => betsRemove],
				['help', () => betsHelp]
			])
		],
		[
			'!help',
			new Map([
				[undefined, () => help]
			])
		]
	]);
}

class Bot {
	constructor(botId) {
		this.botId = botId;
		this.commandMap = buildCommandMap();
		this.bets = [];
	}

	getBotId() {
		return this.botId;
	}

	hasAction(command, action) {
		if(!this.commandMap.get(command).has(action)) return false;
		return true;
	}

	hasCommand(command) {
		if(!this.commandMap.has(command)) return false;
		return true;
	}

	work(command, action, data, name) {
		return new Promise((resolve, reject) => {
			const
				_command = this.commandMap.get(command),
				_action = _command.get(action);
			
			_action().call(this, data, name)
				.then(response => resolve(response))
				.catch(response => reject(response));
		});
	}

	respond(fetcher, options, res) {
		fetcher(options)
			.then(response => {
				res.send({ msg: response.data });
			})
			.catch(() => {
				res.sendStatus(500);
			});
	}
}

module.exports = Bot;