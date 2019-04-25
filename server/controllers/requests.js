const request = require('request'), 
      twitchCredentials = require('../../common_config/config').twitchCredentials;

module.exports = {
    returnJSONFromTwitch: (options) => {
        return new Promise((resolve) => {
            request(options, (error, response, body) => {
                if (error) {
                    console.log("error in request from Twitch. Reload or login again. ", error);
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
    refreshTwitchTokens: (user, jsonInfo) => {
        if (!user || !jsonInfo) {
            return null;
        }
        if (jsonInfo['access_token']) {
            user.accessToken = jsonInfo['access_token']
        }
        if (jsonInfo['refresh_token']) {
            user.refreshToken = jsonInfo['refresh_token']
        }
        if (jsonInfo['expires_in']) {
            let currT = (new Date()).getTime();
            currT += parseInt(jsonInfo["expires_in"]) * 1000;
            user.expiresIn = currT;
        }
        return user;
    },
    updateTwitchUserInfo: (user, infoInJSON) => {
        console.log('update twitch user called ', infoInJSON);
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
        console.log('hola user after function ', user);
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
    accessTokenHasExpired: (user) => {
        if (!user || !user.expiresIn) {
            return null;
        }
        let currTime = (new Date()).getTime();
        currTime += 120000;
        if (currTime >= user.expiresIn) {
            return true;
        }
        return false;
    },
    getTwitchRefreshRequestOpts: (user) => {
        let twitchRefreshRequestUrl = "https://id.twitch.tv/oauth2/token";
        let opts = {
            method: 'POST',
            url: twitchRefreshRequestUrl,
            timeout: 10000,
            headers: {
                "Authorization": "Bearer ".concat(user.data.accessToken),
                "Client-ID": "1w72cq9l8ub9r1pzuqrh91pwduz8r2",
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/vnd.twitchtv.v5+json",
            },
            form: {
                "grant_type": "refresh_token",
                "refresh_token": user.refreshToken,
                "client_id": twitchCredentials.twitchCltId,
                "client_secret": twitchCredentials.twitchSecret 
            }
        };
        return opts;
    },
    twitchFailMessage: () => {
        return { message: "Error", err: "Error connecting with Twitch" }
    }
}
