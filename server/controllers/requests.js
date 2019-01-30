const request = require('request');

module.exports = {
    returnJSONFromTwitch: (options) => {
        return new Promise((resolve) => {
            request(options, (error, response, body) => {
                if (error) {
                    console.log("error in request from Twitch ", error);
                    resolve({ message: 'Error', err: error });
                } else {
                    let responseFormatted = JSON.parse(body);
                    resolve({ message: 'Success', data: responseFormatted });
                }
            });
        });
    },
}