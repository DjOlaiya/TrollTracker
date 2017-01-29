var watson = require('watson-developer-cloud');
var alchemy_language = watson.alchemy_language({
  api_key: process.env.BLUEMIX_API_KEY//add later
});
/*
module.exports.analyze_text = function(text) {
  var obj = request_analysis(text);
  //console.log(text_json);
  var obj = extract_analysis(text_json);
  return obj;
}
*/
/*
module.exports.analyze_text = function(a_text) {
  //return require("./../delete2.json");
  var parameters = {
    sentiment: 1,
    emotion: 1,
    text: a_text
  };

  console.log("something!!!-------------")
  alchemy_language.entities(parameters, function (err, response) {
    console.log("==============================something else");
    if (err)
      console.log('error:', err);
    else
      console.log(JSON.stringify(response, null, 2));

    return extract_analysis(response);
  });
}*/

module.exports.extract_analysis = function(text_json) {
  var obj = {score:null, pos:0, neut:0, neg:0, person:[]};

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