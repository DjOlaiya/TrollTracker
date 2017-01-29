require('dotenv').config();
var bark = require('./app/requests/bark')

var app = require('./app/server');

var Twitter = require('twitter');


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

    client.get('statuses/user_timeline', options, function(err, data) {
      ret = [];
      for (var i = 0; i < 5 && i < data.length; ++i) {
        ret.push({id: data[i].id, text: data[i].text});
      }

      res.json(ret);

    });

  /*
  bark.scoreMessage(req.params.s).then(function(score) {
    res.json({
      score: score
    });
  });
  */
});

app.listen(8080, function(){
  console.log('server is running');
})