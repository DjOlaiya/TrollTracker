require('dotenv').config()
var Twitter = require('twitter');

var client = new Twitter({

	 consumer_key: process.env.CONKEY,
	 consumer_secret: process.env.CONSEC,
	 access_token_key: process.env.ACCESS,
	 access_token_secret: process.env.SECRET

});

var options = { screen_name: 'realDonaldTrump',
								exclude_replies: true,
								count: 20 };


client.get('statuses/user_timeline', options, function(err, data) {

	//console.log(data);

	for (var i=0; i < data.length; i++) {
		console.log(data[i].text);
		console.log('\n');
		
	}
});