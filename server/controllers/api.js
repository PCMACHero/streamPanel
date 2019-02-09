const session = require('express-session'),
      config = require('../../common_config/config'),
      ApiHelper = require('../helpers/api_helpers'),
      UserManager = require('../models/usermanager'),
      RequestManager = require('../controllers/requests');
const twitchCltId = config.TwitchCredentials.twitchCltId,
      twitchSecret = config.TwitchCredentials.twitchSecret,
      randState = config.TwitchCredentials.randState,
      redirectUri = config.TwitchCredentials.redirectUri,
      responseStr = "https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=" + twitchCltId + "&redirect_uri=" + redirectUri + "&scope=channel_editor+channel_read+chat:read+chat:edit+viewing_activity_read+user:read:email+bits:read&state=" + randState;

module.exports = {
    isAuthenticated: async (req, res, next) => {
        let response = {
            isAuthenticated: false,
            message: ''
        }
        if (UserManager.userNotInSession(req.session)) {
            response.isAuthenticated = false;
            response.message = 'User is not logged in';
        } else {
            response.isAuthenticated = await UserManager.isAuthenticated(req.session.userId);
            if (response.isAuthenticated === true) {
                response.message = "Success: User is Authenticated";
            } else {
                response.message = "Error: User is not Authenticated";
            }
        }
        res.json(response);
    },
    updateUserLocalIP: async (req, res) => {
        if (UserManager.userNotInSession(req.session)) {
            res.json(UserManager.notLoggedInMessage());
        } else if (!req.body.ip) {
            res.json({ message: 'Error', err: 'No local IP address given' });
        } else {
            let user = await UserManager.findUserByID(req.sessions.userId);
            if (user.message === "Success") {
                if (!UserManager.ipAddressIsValid(req.body.ip)) {
                    res.json({ message: 'Error', err: 'IP Address given is not a valid IP Address' })
                } else {
                    user.data.localIp = req.body.ip;
                    let savedSuccessfully = await UserManager.saveUserWithoutReturn(user.data);
                    if (savedSuccessfully === true) {
                        res.json({ message: `Successfully updated your local IP to ${req.body.ip}` });
                    } else {
                        res.json(UserManager.saveFailMessage());
                    }
                }
            } else {
                res.json(UserManager.invalidSessionMessage());
            }
        }
    },
    updateOBSPassword: async (req, res) => {
        if (UserManager.userNotInSession(req.session)) {
            res.json(UserManager.notLoggedInMessage());
        } else if (!req.body.password) {
            res.json({ message: 'Error', err: 'No password given' });
        } else {
            let user = await UserManager.findUserByID(req.session.userId)
            if (user.message === "Success") {
                user.data.password = req.body.password;
                let savedSuccessfully = await UserManager.saveUserWithoutReturn(user.data);
                if (savedSuccessfully === true) {
                    res.json({ message: `Successfully updated your OBS Password` });
                } else {
                    res.json(UserManager.saveFailMessage());
                }
            } else {
                res.json(UserManager.invalidSessionMessage());
            }
        }
    },
    createNewCommand: async (req, res) => {
        if (UserManager.userNotInSession(req.session)) {
            res.json(UserManager.notLoggedInMessage());
        } else if (!req.body.name || !req.body.reply) {
            res.json({ message: "Error", err: "Must submit a name and reply for your new command." })
        } else {
            let user = await UserManager.findUserByID(req.session.userId);
            if (user.message === "Success") {
                let newBtn = {
                    name: req.body.name,
                    reply: req.body.reply
                }
                user.data.custom.push(newBtn);
                let saved = await UserManager.saveUserReturnUser(user.data);
                if (saved.message === "Success") {
                    res.json({ message: `Successfully added new command ${newBtn.title}`, data: saved.data.custom });
                } else {
                    res.json(UserManager.saveFailMessage());
                }
            } else {
                res.json(UserManager.invalidSessionMessage());
            }
        }
    },
    deleteCommand: async (req, res) => {
        // will take in index and delete from array
        if (UserManager.userNotInSession(req.session)) {
            res.json(UserManager.notLoggedInMessage());
        } else if (!req.body.index) {
            res.json({ message: "Error", err: "Must provide an index to delete from." })
        } else {
            let user = await UserManager.findUserByID(req.session.userId);
            if (user.message === "Success") {
                let newArrayOfCommands = ApiHelper.removeFromArrayAtIndex(user.data.custom, req.body.index);
                user.data.custom = newArrayOfCommands;
                let saved = await UserManager.saveUserReturnUser(user.data);
                if (saved.message === "Success") {
                    res.json({ message: `Successfully removed command from index ${req.body.index}`, data: saved.data.custom });
                } else {
                    res.json(UserManager.saveFailMessage());
                }
            } else {
                res.json(UserManager.invalidSessionMessage());
            }
        }
    },
    updateWinMessage: async (req, res) => {
        if (UserManager.userNotInSession(req.session)) {
            res.json(UserManager.notLoggedInMessage());
        } else if (!req.body.winMessage) {
            res.json({ message: "Error", err: "Must submit a message you'd like to save" })
        } else {
            let user = await UserManager.findUserByID(req.session.userId);
            if (user.message === "Success") {
                user.data.winMsg = req.body.winMessage;
                let savedSuccessfully = await UserManager.saveUserWithoutReturn(user.data);
                if (savedSuccessfully === true) {
                    res.json({ message: `Successfully saved your win message` })
                } else {
                    res.json(UserManager.saveFailMessage());
                }
            } else {
                res.json(UserManager.invalidSessionMessage());
            }
        }
    },
    getUserInfo: async (req, res) => {
        if (UserManager.userNotInSession(req.session)) {
            res.json(UserManager.notLoggedInMessage());
        } else {
            let user = await UserManager.findUserByID(req.session.userId);
            if (user.message === "Success") {
                if (RequestManager.accessTokenHasExpired(user.data)) {
                    let opts = RequestManager.getTwitchRefreshRequestOpts(user.data),
                        jsonResponse = await RequestManager.returnJSONFromTwitch(opts);
                    user.data = RequestManager.refreshTwitchTokens(user.data, jsonResponse);
                    const savedSuccessfully = await UserManager.saveUserWithoutReturn(user.data);
                    if (!savedSuccessfully) {
                        res.json(UserManager.saveFailMessage());
                        return
                    }
                }
                res.json({ message: "Success", data: user.data });
            } else {
                res.json(UserManager.invalidSessionMessage());
            }
        }
    },
    getTokensRefreshed: async (req, res) => {
        if (!req.body.accessToken || !req.body.refreshToken || !req.body.expiresIn || !req.body.twitchId) {
            res.json({ message: "Error", err: "Must provide an accessToken, refreshToken, expiresIn and TwitchId" });
            return
        }
        let opts = RequestManager.getTwitchRefreshRequestOpts(req.body);
        let jsonResponse = await RequestManager.returnJSONFromTwitch(opts);
        let user = await UserManager.findUserByTwitchID(req.body.twitchId);
        if (user.message === "Error") {
            res.json({ message: "Error", err: "Invalid data provided" });
            return
        }
        user = RequestManager.refreshTwitchTokens(user, jsonResponse);
        let savedSuccessfully = await UserManager.saveUserWithoutReturn(user);
        if (!savedSuccessfully) {
            res.json(UserManager.saveFailMessage());
            return
        }
        if (UserManager.userNotInSession(user)) {
            req.session.userId = user._id;
        }
        let tokens = UserManager.getOnlyTokens(user)
        res.json({ message: "Success", data: tokens });
    },
    returnResponseString: async (req, res) => {
        res.json({ message: "Success", responseString: responseStr });
    },
}