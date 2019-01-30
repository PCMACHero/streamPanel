const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = {
    findUserByID: (userId) => {
        return new Promise((resolve, reject) => {
            User.findOne({_id: userId}, (err, foundUser) => {
                if (err) {
                    console.log('Error finding User ', err);
                    resolve({ message: "Error", err: err });
                } else {
                    resolve({ message: "Success", info: foundUser });
                }
            });
        });
    },
    saveUserWithoutReturn: (user) => {
        return new Promise((resolve, reject) => {
            user.save(err => {
                if (err) {
                    console.log('Error Saving User ', err);
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    },
    saveUserReturnUser: (user) => {
        return new Promise((resolve, reject) => {
            user.save((err, savedUser) => {
                if (err) {
                    console.log('Error Saving User ', err);
                    resolve({ message: "Error", err: err });
                } else {
                    resolve({ message: "Success", info: savedUser });
                }
            });
        });
    },
    userNotInSession: (session) => {
        if (!session || !session.userId) return true;
        return false;
    },
    isAuthenticated: (userId) => {
        return new Promise((resolve, reject) => {
            User.findOne({_id: userId}, (err, usr) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        })
    },
    ipAddressIsValid: (ip) => {
        if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip)) {
          return true;
        }
        return false;
    },
    notLoggedInMessage: () => {
        return { message: 'Error', err: 'User is not logged in' };
    },
    saveFailMessage: () => {
        return { message: 'Error', err: 'Could not save to db' };
    },
    invalidSessionMessage: () => {
        return { message: 'Error', err: 'Invalid Session' };
    },
}