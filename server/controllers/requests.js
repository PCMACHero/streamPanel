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
    updateTwitchTokens: (user, newInfo) => {
        if (user.refreshToken !== newInfo.refreshToken) {
            user.refreshToken = newInfo.refreshToken;
        }
        if (user.accessToken !== newInfo.accessToken) {
            user.accessToken = newInfo.accessToken;
        }
        user.expiresIn = newInfo.expiresIn;
        return user;
    },
    updateTwitchUserInfo: (user, infoInJSON) => {
        if (user.displayName !== infoInJSON['display_name']) {
            if (infoInJSON['display_name']) {
                user.displayName = infoInJSON['display_name'];
            }
        }
        if (user.email !== infoInJSON['email']) {
            if (infoInJSON['email']) {
                user.email = infoInJSON['email'];
            }
        }
        if (user.imgUrl !== infoInJSON['profile_image_url']) {
            if (infoInJSON['profile_image_url']) {
                user.imgUrl = infoInJSON['profile_image_url'];
            }
        }
        if (user.offline_image_url !== infoInJSON['offline_image_url']) {
            if (infoInJSON['offline_image_url']) {
                user.offline_image_url = infoInJSON['offline_image_url'];
            }
        }
        return user;
    },
    updateTwitchChannelInfo: (user, infoInJSON) => {
        if (infoInJSON['partner']) {
            if (user.isPartner !== (infoInJSON['partner'].toLowerCase() === 'true')) {
                user.isPartner = (infoInJSON['partner'].toLowerCase() === 'true');
            }
        }
        if (infoInJSON['language']) {
            if (user.language !== infoInJSON['language']) {
                user.language = infoInJSON['language'];
            }
        }
        return user;
    },
}