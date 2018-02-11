var express = require('express');

var Twitter = require('twitter');


var app = express();

var bark = require('./requests/bark');
var analyze = require('./requests/analyze')

var watson = require('watson-developer-cloud');
var alchemy_language = watson.alchemy_language({
  api_key: process.env.BLUEMIX_API_KEY//add later
});

app.set('view engine', 'ejs');
app.set('views', __dirname + '/../public/views');

app.use(express.static(__dirname + '/../public' ));

app.get('/', function(req, res){
  res.render((__dirname + '/../public/views/home.ejs'));
});

//Twitter authentications
var client = new Twitter({

    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.ACCESS,
    access_token_secret: process.env.SECRET

});

app.get('/results', function(req, res) {
    var options = {
        screen_name: req.query.user,
        exclude_replies: true,
        count: 200
    };

    var ret = [];
    client.get('statuses/user_timeline', options, function(err, data) {
        if (data[0] == undefined) {
            return res.send("No user found");
        }
        var name = data[0].user.name;
        for (var i = 0; i < 5 && i < data.length; ++i) {
            ret.push({id: data[i].id, text: data[i].text});
        }

        var arr = [];
        var fin = [];
        for (var i = 0; i < ret.length; ++i) {
            text = ret[i].text;
            id = ret[i].id;
            arr.push(bark.scoreMessage(id, text).then(function (obj) {
                fin.push({id: obj.id, text: obj.text, score: obj.score})
            }));
        }

        var tweets = extract_tweets(data);

        //modify options
        options.count = 150;
        options.max_id = data[data.length - 1].id -1;
        client.get('statuses/user_timeline', options, function(err, data2) {

            tweets += extract_tweets(data2);


            var parameters = {
                sentiment: 1,
                emotion: 1,
                text: tweets
            };

            alchemy_language.entities(parameters, function (err, response) {
                if (err)
                  console.log('error:', err);

              Promise.all(arr).then(function() {
                //res.json(obj);
                res.render('results.ejs', {name: name, data: fin, 
                    analysis: analyze.extract_analysis(response)});
            });
          });

            //var obj = analyze.analyze_text(tweets);
            //console.log(obj);


        });
    });

});

function extract_tweets(data) {
    var tweets = "";
    for (var i = 0; i < data.length; i++)
        tweets += data[i].text + "\n";
    return tweets;
}

module.exports = app;