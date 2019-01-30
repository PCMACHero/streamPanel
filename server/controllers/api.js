const mongoose = require('mongoose'),
      request = require('request'),
      session = require('express-session'),
      config = require('../../common_config/config'),
      User = mongoose.model('User'),
      twitchCredentials = config.TwitchCredentials,
      UserManager = require('../models/usermanager');

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
                }
            } else {
                res.json(UserManager.invalidSessionMessage());
            }
        }
    },
    deleteCommand: async (req, res) => {

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

    },
}