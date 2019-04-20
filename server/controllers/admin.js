const session = require('express-session'),
      config = require('../../common_config/config'),
      ApiHelper = require('../helpers/api_helpers'),
      UserManager = require('../models/usermanager'),
      RequestManager = require('../controllers/requests');
const twitchCltId = config.TwitchCredentials.twitchCltId,
      twitchSecret = config.TwitchCredentials.twitchSecret,
      randState = config.TwitchCredentials.randState,
      redirectUri = config.TwitchCredentials.redirectUri;

module.exports = {
    returnAllUsers: async (req, res) => {
        let isUserAdmin = await UserManager.isAdmin(req.session.userId);
        if (!isUserAdmin) {
            res.json(UserManager.notAuthorizedMessage());
        } else {
            let allUsers = await UserManager.findAllUsers();
            if (allUsers.message === "Success") {
                res.json({ message: "Success", data: allUsers.info });
            } else {
                res.json({ message: "Error. Unable to retrieve users at the moment" });
            }
        }
    },
    updateOneUser: async (req, res) => {
        if (!req.body.twitchId || !req.body.userInfo) {
            res.json({ message: "Error. Must submit a twitchId and userInfo" });
        } else {
            let isUserAdmin = await UserManager.isAdmin(req.session.userId);
            if (!isUserAdmin) {
                res.json(UserManager.notAuthorizedMessage());
            } else {
                let updatedSuccessfully = await UserManager.updateUser(req.body.twitchId, req.body.userInfo);
                if (updatedSuccessfully.message === "Success") {
                    res.json({ message: "Successfully updated user info." });
                } else {
                    res.json({ message: "Unable to update user." });
                }
            }
        }
    },
    deleteOneUser: async (req, res) => {
        if (!req.body.twitchId) {
            res.json({ message: "Error. Must submit a twitchId." });
        } else {
            let isUserAdmin = await UserManager.isAdmin(req.session.userId);
            if (!isUserAdmin) {
                res.json(UserManager.notAuthorizedMessage());
            } else {
                let delUserMessage = await UserManager.deleteUser(req.body.twitchId);
                if (delUserMessage === "Success") {
                    res.json(delUserMessage);
                } else {
                    res.json({ message: "Error deleting user" });
                }
            }
        }
    }
}