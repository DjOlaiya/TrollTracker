require('dotenv').config()

const getStdin = require('get-stdin');
var Twitter = require('twitter');
var readline = require('readline');


//Twitter authentications
var client = new Twitter({

	 consumer_key: process.env.CONKEY,
	 consumer_secret: process.env.CONSEC,
	 access_token_key: process.env.ACCESS,
	 access_token_secret: process.env.SECRET

});

//This function will strip each tweet of any images or links.
function stripper(array){

	var outString = "";

	//look through all the words
	for(var i=0; i <array.length; i++){

		if(!(array[i].substring(0,4) === "http") ){

			outString = outString + array[i] + " ";
			
		}

	}

return outString;

}


//get the user name 
getStdin().then(str=>{
	console.log(str);


	//options for the tweets
	var options = { screen_name: str,
  				  			exclude_replies: true,
									count: 5
								};


	client.get('statuses/user_timeline', options, function(err, data) {

	for (var i=0; i < data.length; i++) {
		
		var arr = data[i].text.split(" ");
		var out = stripper(arr);

		console.log(out);
		console.log('\n');
		
	}

	});
	
});