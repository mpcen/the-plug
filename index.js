const app = require('express')();
const bodyParser = require('body-parser');
const axios = require('axios');

const BOT_ID = 'd382286aeb9b6e070d3997395b';
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/test', (req, res) => {
	console.log('test hit');

	res.send({ msg: 'ok' });
});

app.post('/', (req, res) => {
	console.log('Got:', req.body);
	
	const botResponse = 'yo my realest niggas ever';
	const options = {
		method: 'post',
		url: 'https://api.groupme.com/v3/bots/post',
		data: {
			'bot_id': BOT_ID,
			'text': botResponse
		}
	};

	// axios(options)
	// 	.then(response => {
	// 		res.send({ msg: 'ok' });
	// 	})
	// 	.catch(err => {
	// 		res.sendStatus(500);
	// 	});
	res.send({ msg: 'ok' });
});

app.listen(PORT, () => {
	console.log('Server running on port', PORT);
});