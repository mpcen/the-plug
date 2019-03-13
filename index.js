const
	app = require('express')(),
	bodyParser = require('body-parser'),
	axios = require('axios'),
	{ cloneDeep } = require('lodash'),
	PORT = process.env.PORT || 5113;

const
	{ BOT_ID } = require('./config/keys'),
	Bot = require('./Bot'),
	bot = new Bot(BOT_ID),
	BOT_POST_URI = 'https://api.groupme.com/v3/bots/post';


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/', (req, res) => {
	const { sender_type, name, text } = req.body;

	if(sender_type !== 'bot') {
		const
			textSplit = text.split(' '),
			[ command, action ] = textSplit,
			options = {
				method: 'post',
				url: BOT_POST_URI,
				data: {
					'bot_id': bot.getBotId(),
					'text': null
				}
			};

		if(bot.hasCommand(command)) {
			if(bot.hasAction(command, action)) {
				const data = textSplit.slice(2).join(' ');					
	
				bot.work(command, action, data, name)
					.then(botResponse => {
						if(typeof botResponse === 'string') {
							options.data['text'] = botResponse;			
							bot.respond(axios, options, res);
						} else {
							const promises = botResponse.map(betResponseStr => {
								options.data['text'] = betResponseStr;

								return axios(cloneDeep(options));
							});
			
							Promise.all(promises)
								.then(() => res.sendStatus(200))
								.catch(() => res.sendStatus(500));
						}
					})
					.catch(err => {
						options.data['text'] = err;
						bot.respond(axios, options, res);
					});
			} else {
				options.data['text'] = `\nIdk what action ${action} does\n`;
				bot.respond(axios, options, res);
			}
		} else {
			res.sendStatus(301);
		}	
	} else {
		res.sendStatus(301);
	}
});

app.listen(PORT, () => {
	console.log('Server running on port', PORT);
});