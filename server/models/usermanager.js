const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = {
    isNewUserByTwitchId: (twitchId) => {
        return new Promise((resolve) => {
            if (!twitchId) resolve({ results: null, err: "No TwitchId provided" })
            User.findOne({twitchId: twitchId}, (err, results) => {
                if (err) {
                    console.log('Error finding user with twitchId: ' + twitchId)
                    resolve({ results: null, err: err });
                } else if (results) {
                    resolve({ results: false, user: results });
                } else {
                    resolve({ results: true });
                }
            });
        });
    },
    findUserByID: (userId) => {
        return new Promise((resolve, reject) => {
            User.findOne({_id: userId}, (err, foundUser) => {
                if (err) {
                    console.log('Error finding User ', err);
                    resolve({ message: "Error", err: err });
                } else {
                    resolve({ message: "Success", data: foundUser });
                }
            });
        });
    },
    findAllUsers: () => {
        return new Promise((resolve, reject) => {
            User.find({}, (err, foundUsers) => {
                if (err) {
                    console.log('Error getting users');
                    resolve({ message: "Error", err: err });
                } else {
                    resolve({ message: "Success", info: foundUsers });
                }
            });
        })
    },
    deleteUser: (twitchId) => {
        return new Promise((resolve, reject) => {
            if (!twitchId) resolve({ message: "Error. Invalid Twitch ID submitted." });
            let userToDel = await this.findUserByTwitchID(twitchId);
            if (userToDel.message === "Success") {
                userToDel.data.remove(err => {
                    if (err) {
                        console.log("Error trying to delete user ", err);
                        resolve({ message: "Error", err: err });
                    } else {
                        resolve({ message: "Successfully removed user with " + twitchId + " from the database" });
                    }
                });
            }
        })
    },
    updateUser: (twitchId, updatedUser) => {
        return new Promise((resolve, reject) => {
            if (!twitchId || !updatedUser) resolve({ message: "Error. Invalid Twitch ID submitted." });
            User.findOneAndUpdate({ twitchId: twitchId }, updatedUser, (err) => {
                if (err) {
                    resolve({ message: "Error", err: err });
                } else {
                    resolve({ message: "Success" });
                }
            });
        });
    },
    findUserByTwitchID: (twitchId) => {
        return new Promise((resolve) => {
            User.findOne({twitchId: twitchId}, (err, foundUser) => {
                if (err) {
                    console.log('Error finding User ', err);
                    resolve({ message: "Error", err: err });
                }
                resolve({ message: "Success", data: foundUser });
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
                    console.log('saved successfully ');
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
            if (!userId) resolve(false);
            User.findOne({_id: userId}, (err, usr) => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        })
    },
    isAdmin: (userId) => {
        return new Promise((resolve, reject) => {
            if (!userId) resolve(false);
            User.findOne({_id: userId}, (err, usr) => {
                if (err) {
                    console.log(`error finding user with userId ` + userId);
                    resolve(false);
                } else {
                    if (usr.isAdmin > 5) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
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
    notAuthorizedMessage: () => {
        return ({ message: "Error", err: "User is not authorized" });
    },
    getOnlyTokens: (user) => {
        return {
            accessToken: user.accessToken,
            refreshToken: user.refreshToken,
            expiresIn: user.expiresIn
        }
    },
    updatePreset: (currentPresets, index, newPreset) => {
        currentPresets[index] = newPreset;
        return currentPresets
    },
}