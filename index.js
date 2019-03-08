const app = require('express')();
const bodyParser = require('body-parser');
const axios = require('axios');

const BOT_ID = 'd382286aeb9b6e070d3997395b';
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/', (req, res) => {
	if(req.body.sender_type !== 'bot') {
		const botResponse = `${req.body.name} said: ${req.body.text}`;
		const options = {
			method: 'post',
			url: 'https://api.groupme.com/v3/bots/post',
			data: {
				'bot_id': BOT_ID,
				'text': botResponse
			}
		};

		axios(options)
			.then(response => {
				res.send({ msg: 'ok' });
			})
			.catch(err => {
				res.sendStatus(500);
			});
	} else {
		res.sendStatus(200);
	}
});

app.listen(PORT, () => {
	console.log('Server running on port', PORT);
});