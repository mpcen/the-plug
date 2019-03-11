if(process.env.NODE_ENV === 'production') {
	console.log('Using PROD environment variables');
	module.exports = {
		BOT_ID: process.env.BOT_ID,
		MONGO_URI: process.env.MONGO_URI
	};
} else {
	console.log('Using DEV environment variables');
	module.exports = {
		BOT_ID: 'd382286aeb9b6e070d3997395b',
		MONGO_URI: 'mongodb://bot:lotchat!23@ds211096.mlab.com:11096/lot-groupme-db'
	};
}