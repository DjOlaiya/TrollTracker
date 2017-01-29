var request = require('request-promise-native');

const HEADERS = {
    'Content-Type': 'application/json',
    'X-Token-Auth': process.env.BARK_ACCESS_TOKEN
};

module.exports.scoreMessage = function( tweet ) {
    return request({
        method: 'POST',
        url: 'https://partner.bark.us/api/v1/messages',
        headers: HEADERS,
        body: JSON.stringify({message: tweet})
    }).then(JSON.parse);
};