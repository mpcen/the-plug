# League of Thrones GroupMe bot

## What does it do?
Keeps track of bets made by the members. Adding other features sometime...
## To Run:
1. Create a GroupMe bot. Note the bot_id
2. Create an mLab instance
3. Clone repo
4. Create ./config/index.js with the following code (its better to use environment variables but you get the point):
```
module.exports = {
	BOT_ID: YOUR_BOT_ID,
	MONGO_URI: YOUR_MONGO_URI
};
```
5. yarn install
6. yarn run dev/yarn start
7. Deploy your app to heroku/aws/azure/etc and pass the cloud app's url into your GroupMe bot's callback URL OR forward your routers port 80 to port 5113 and pass http://YOUR_IP_ADDRESS to the bot's callback URL [DO THE LATTER AT YOUR OWN RISK]
8. Make $$$