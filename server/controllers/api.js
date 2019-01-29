const mongoose = require('mongoose'),
      request = require('request'),
      session = require('express-session'),
      config = require('../../common_config/config'),
      twitchCredentials = config.TwitchCredentials,
      UserManager = require('../models/usermanager');

module.exports = {
    isAuthenticated: async (req, res, next) => {
        let response = {
            isAuthenticated: false,
            message: ''
        }
        if (!req.session || !req.session.userId) {
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
}