var express = require('express');

var Twitter = require('twitter');


var app = express();

var bark = require('./requests/bark');
var analyze = require('./requests/analyze')

app.set('view engine', 'ejs');
app.set('views', __dirname + '/../public/views');

app.use(express.static(__dirname + '/../public' ));

app.get('/', function(req, res){
  res.render((__dirname + '/../public/views/home.ejs'));
});

app.get('/results', function(req, res){
  res.render((__dirname + '/../public/views/results.ejs'));
});

//Twitter authentications
var client = new Twitter({

    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.ACCESS,
    access_token_secret: process.env.SECRET

});

app.get('/:s', function(req, res) {
    var options = {
        screen_name: req.params.s,
        exclude_replies: true,
        count: 10
    };

    var ret = [];
    client.get('statuses/user_timeline', options, function(err, data) {
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

        var obj = analyze.analyze_text('a block of tweets');

        Promise.all(arr).then(function() {
            //res.json(obj);
            res.render('results.ejs', {name: name, data: fin, analysis: obj})
        });
    });

});

module.exports = app;