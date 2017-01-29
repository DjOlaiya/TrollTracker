var watson = require('watson-developer-cloud');
var alchemy_language = watson.alchemy_language({
  api_key: process.env.BLUEMIX_API_KEY//add later
});

module.exports.analyze_text = function(text) {
  //make call
  var text_json = request_analysis(text);
  //clean data
  var obj = extract_analysis(text_json);
  //return data
  return obj;
}

function request_analysis(a_text) {
  return require("./../delete2.json");
  var parameters = {
    sentiment: 1,
    emotion: 1,
    text: a_text
  };

  alchemy_language.entities(parameters, function (err, response) {
    if (err)
      console.log('error:', err);
    else
      console.log(JSON.stringify(response, null, 2));
  });
  return response;//what if error???
}

function extract_analysis(text_json) {
  var obj = {score:null, pos:0, neut:0, neg:0, person:[]};

  /*
  var obj = {score:null, pos:0, neut:0, neg:0,
    sentiment:[],
    relevance:[],
    count:[],
    person:[],
    emotions:{
      anger:[],
      disgust:[],
      fear:[],
      joy:[],
      sadness:[]
    }
  };
  */

  for (var i = 0, j = 0; i < text_json.entities.length; i++) {
    var entity = text_json.entities[i];
    if (entity.type == "Person") {
      //calculate entity score
      switch (entity.sentiment.type){
        case "negative":
          obj.neg++;
          break;
        case "neutral":
          obj.neut++;
          break;
        case "positive":
          obj.pos++;
          break;
      }
      console.log(entity.text);
      var person = {};
      person.name = entity.text;
      person.sentiment = entity.sentiment.type != "neutral" ? Number(entity.sentiment.score) : 0;
      person.relevance = Number(entity.relevance);
      person.count = Number(entity.count);
      person.emotions = {};
      person.emotions.anger   = Number(entity.emotions.anger);
      person.emotions.disgust = Number(entity.emotions.disgust);
      person.emotions.fear    = Number(entity.emotions.fear);
      person.emotions.joy     = Number(entity.emotions.joy);
      person.emotions.sadness = Number(entity.emotions.sadness);


      /*

      obj.sentiment[j] = entity.sentiment.type != "neutral" ? Number(entity.sentiment.score) : 0;
      obj.relevance[j] = Number(entity.relevance);
      obj.count[j]     = Number(entity.count);
      obj.person[j]    = entity.text;

      obj.emotions.anger[j]   = Number(entity.emotions.anger);
      obj.emotions.disgust[j] = Number(entity.emotions.disgust);
      obj.emotions.fear[j]    = Number(entity.emotions.fear);
      obj.emotions.joy[j]     = Number(entity.emotions.joy);
      obj.emotions.sadness[j] = Number(entity.emotions.sadness);
      j++;
      */

      obj.person.push(person);
    }
  }

  var score = 0;
  for (var i = 0; i < obj.person.length; i++)
    score += obj.person[i].sentiment;
  score /= obj.person.length;
  obj.score = score;
  return obj;
}