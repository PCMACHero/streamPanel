// import React from 'react';
const mongoose = require('mongoose');
const request = require('request');
const RequestManager = require('./requests');
const UserManager = require('../models/usermanager');
const path = require('path');
const session = require('express-session');
const config = require('../../common_config/config')
const permittedUsers = config.PermittedUsers;
const ReactDOM = require('react-dom');
    //   App = require('../../src/App');
const twitchCltId = config.TwitchCredentials.twitchCltId,
      twitchSecret = config.TwitchCredentials.twitchSecret,
      randState = config.TwitchCredentials.randState,
      redirectUri = config.TwitchCredentials.redirectUri,
      responseStr = "https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=" + twitchCltId + "&redirect_uri=" + redirectUri + "&scope=channel_editor+channel_read+chat:read+chat:edit+channel:moderate+viewing_activity_read+user:read:email+bits:read+clips:edit&state=" + randState;

var User = mongoose.model('User');

module.exports = {
    renderReact: (req, res, next) => {
        // req.session.userId = "test"
        res.sendFile(path.join(__dirname, '../../build', 'index.html'), {root: path.join('/')});
    },
    twitch: async (req, res) => {
        console.log('twitch link hit!')
        if (req.query.state === randState && req.query.code) {
            let twitchUser = new User();
            const code = req.query.code;

            let firstTwitchUrl = "https://id.twitch.tv/oauth2/token?client_id=" + twitchCltId + "&client_secret=" + twitchSecret + "&grant_type=authorization_code&redirect_uri=" + redirectUri + "&code=" + code;
            let opts = {
                method: 'POST',
                url: firstTwitchUrl,
                timeout: 10000,
                followRedirect: true,
                maxRedirects: 10
            }

            let jsonResponse = await RequestManager.returnJSONFromTwitch(opts);
            if (jsonResponse.message !== "Success") {
                console.log('Error getting info from Twitch ' + jsonResponse.err);
                res.json(RequestManager.twitchFailMessage());
            }
            console.log("TWITCH DATA 1", jsonResponse.data)
            twitchUser.accessToken = jsonResponse.data["access_token"];
            twitchUser.refreshToken = jsonResponse.data["refresh_token"];
            const expires_in = jsonResponse.data["expires_in"];
            twitchUser.expiresIn = parseInt(expires_in) * 1000 + (new Date()).getTime();

            let secondTwitchUrl = "https://api.twitch.tv/helix/users";
            opts = {
                method: 'GET',
                url: secondTwitchUrl,
                timeout: 10000,
                headers: {
                    "Authorization": "Bearer ".concat(twitchUser.accessToken)
                }
            };

            jsonResponse = await RequestManager.returnJSONFromTwitch(opts);
            if (!jsonResponse || jsonResponse.message === 'Error') {
                res.json(RequestManager.twitchFailMessage());
            }
            let userIsNew = await UserManager.isNewUserByTwitchId(jsonResponse.data.data[0]["id"]);
            if (userIsNew.results === null) {
                console.log('invalid data provided by user');
                res.json(RequestManager.twitchFailMessage());
            } else if (userIsNew.results === false) {
                let registeredUser = userIsNew.user;
                req.session.userId = registeredUser._id;

                // Check if the tokens have changed and update them
                registeredUser = RequestManager.updateTwitchTokens(registeredUser, twitchUser);
                registeredUser = RequestManager.updateTwitchUserInfo(registeredUser, jsonResponse.data.data[0]);

                const thirdTwitchUrl = "https://api.twitch.tv/kraken/channel";
                opts = {
                    method: 'GET',
                    url: thirdTwitchUrl,
                    timeout: 10000,
                    headers: {
                        "Authorization": "OAuth ".concat(twitchUser.accessToken)
                    }
                };
                jsonResponse = await RequestManager.returnJSONFromTwitch(opts);
                if (!jsonResponse || jsonResponse.message === 'Error') {
                    res.json(RequestManager.twitchFailMessage());
                }

                registeredUser = RequestManager.updateTwitchChannelInfo(registeredUser, jsonResponse.data);
                console.log('registered user = ', registeredUser);
                let savedSuccessfully = UserManager.saveUserWithoutReturn(registeredUser);
                if (savedSuccessfully === false) {
                    return savedSuccessfully;
                } else {
                    req.session.userId = registeredUser._id;
                    res.redirect('/panel');
                }
            } else if (userIsNew.results === true) {
                if (!permittedUsers[jsonResponse.data.data[0]["email"]]) {
                    res.json(RequestManager.twitchFailMessage());
                }
                // Register new user
                twitchUser.twitchId = jsonResponse.data.data[0]["id"];
                twitchUser = RequestManager.updateTwitchUserInfo(twitchUser, jsonResponse.data.data[0]);
                const thirdTwitchUrl = "https://api.twitch.tv/kraken/channel";
                opts = {
                    method: 'GET',
                    url: thirdTwitchUrl,
                    timeout: 10000,
                    headers: {
                        "Authorization": "OAuth ".concat(twitchUser.accessToken)
                    }
                };
                jsonResponse = await RequestManager.returnJSONFromTwitch(opts);
                twitchUser = RequestManager.updateTwitchChannelInfo(twitchUser, jsonResponse.data);

                // Remove after initial setup
                if (twitchUser.displayName === 'twboapp') {
                    twitchUser.isAdmin = 10;
                }
                let saved = await UserManager.saveUserReturnUser(twitchUser);
                if(saved.message === 'Success') {
                    req.session.userId = saved.info._id;
                    res.redirect('/panel');
                } else {
                    res.json(UserManager.saveFailMessage());
                }
            }
        } else {
            res.json(RequestManager.twitchFailMessage())
        }
    },
    // pay: (req, res) => {
    //     if (!req.session.userId) {
    //         console.log('no id in session');
    //         res.redirect('/home');
    //     } else {
    //         if (!mongoose.Types.ObjectId.isValid(req.session.userId)){
    //             res.redirect('/home');
    //             return;
    //         }
    //         User.findOne({_id:req.session.userId}, function(err, foundUser) {
    //             if (err) {
    //                 console.log("error finding user", err);
    //                 res.redirect('/home');
    //             } else {
    //                 res.render('payment', {user: foundUser});
    //             }
    //         });
    //     }
    // },
    // beta: (req, res) => {
    //     if (!req.session.userId) {
    //         console.log('no id in session');
    //         res.redirect('/home');
    //     } else {
    //         if (!mongoose.Types.ObjectId.isValid(req.session.userId)){
    //             res.redirect('/home');
    //             return;
    //         }
    //         User.findOne({_id:req.session.userId}, function(err, foundUser) {
    //             if (err) {
    //                 console.log("error finding user", err);
    //                 res.redirect('/home');
    //             } else {
    //                 res.render('pp', {user: foundUser});
    //             }
    //         });
    //     }
    // },
    // paid: (req, res) => {
    //     // Get an authentication token every day.
    //     // Take the id that is submitted and verify it with Paypal
    //     let purchaseId = req.params.purchaseId;
    //     console.log(purchaseId);
    //     // var options = {
    //     //     method: 'GET',
    //     //     url: "https://api.sandbox.paypal.com/v1/payments/orders/".concat(purchaseId),
    //     //     timeout: 10000,
    //     //     headers: {
    //     //         "Content-Type": "application/json",
    //     //         "Authorization": "Bearer ".concat(accessToken)
    //     //     }
    //     // };
    //     // Check for the referral code and place it in the correct place

    //     // Once verified change their account to has paid
        
    //     // If there is a referral code
    //     User.findOne({_id:req.session.userId}, function(err, foundUser) {
    //         if(err) {
    //             console.log("error finding", err);
    //             res.send(err);
    //         } else {
    //             foundUser.hasPaid = true;
    //             foundUser.referredBy = req.body.referralCode;
    //             // save changes
    //             res.send({message: "Success"});
    //         }
    //     });
    //     // Redirect to a thank you page with the direct link to the app
    // },
    // privacy: (req, res) => {
    //     // check form data and if there is someone logged in
    //     if (!req.session.userId) {
    //         res.redirect('/home');
    //     } else if (req.body.accepted != "true") {
    //         res.redirect('/home');
    //     }
    //     // if ok, add date to the user object
    //     User.findOne({_id:req.session.userId}, function(err, foundUser) {
    //         if(err) {
    //             console.log("error finding ", err);
    //             res.send(err);
    //         } else {
    //             let tDate = new Date();
    //             foundUser.acceptedPP = tDate;
    //             // save changes
    //             foundUser.save(function(err, user) {
    //                 if (err) {
    //                     console.log('error saving ', err);
    //                     res.redirect('/home');
    //                 } else {
    //                     res.redirect('/user/' + user.displayName);
    //                 }
    //             });
    //         }
    //     });
    //     // redirect to the app link w/o data
    // },
    // dashboard: (req, res) => {
    //     if(!req.session.userId) {
    //         res.redirect('/login');
    //         return
    //     }
    //     User.findOne({_id: req.session.userId}, function(err, foundUser) {
    //         if(err) {
    //             console.log('error finding ', err);
    //             res.redirect('/login');
    //         } else {
    //             if (foundUser.displayName != req.params.username) {
    //                 res.redirect('/' + foundUser.displayName);
    //             } else if (foundUser.acceptedPP == undefined) {
    //                 res.redirect('/privacy-agreement');
    //             } else {
    //                 // sanitize user data
    //                 let user = {
    //                     "_id": foundUser._id,
    //                     "twitchId": foundUser.twitchId,
    //                     "displayName": foundUser.displayName,
    //                     "email": foundUser.email,
    //                     "imgUrl": foundUser.imgUrl,
    //                     "ip": foundUser.localIp,
    //                     "custom": foundUser.custom
    //                 };
    //                 // render the dashboard
    //                 res.render('dash', {user: user});
    //             }
    //         }
    //     });
    // },
    // login: (req, res) => {
    //     res.render('login', {twitchLink: responseStr});
    // },
    // boarding: (req, res) => {
    //     if(!req.session.userId) {
    //         res.redirect('/login');
    //         return
    //     }
    //     User.findOne({_id: req.session.userId}, function(err, foundUser) {
    //         if(err) {
    //             console.log('error finding ', err);
    //             res.redirect('/login');
    //         } else {
    //             if (foundUser.displayName != req.params.username) {
    //                 res.redirect('/' + foundUser.displayName);
    //             } else if (foundUser.acceptedPP == undefined) {
    //                 res.redirect('/privacy-agreement');
    //             } else {
    //                 // sanitize user data
    //                 let user = {
    //                     _id: foundUser._id,
    //                     displayName: foundUser.displayName,
    //                     localIp: foundUser.localIp
    //                 };
    //                 // render the dashboard
    //                 res.render('boarding', {user: user});
    //             }
    //         }
    //     });
    // },
    // manualUpdate: (req, res) => {
    //     if (!req.session.userId || !req.body.ip) {
    //         res.redirect('/login');
    //     } else {
    //         User.findOne({_id: req.session.userId}, function(err, foundUser) {
    //             if(err) {
    //                 console.log('error finding ', err);
    //                 res.redirect('/login');
    //             } else {
    //                 foundUser.localIp = req.body.ip;
    //                 foundUser.save(function(err) {
    //                     if(err) {
    //                         console.log('error saving ', err);
    //                         res.redirect(`/user/${foundUser.displayName}/boarding`);
    //                     } else {
    //                         res.redirect(`/user/${foundUser.displayName}/app`);
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // },
    // autoUpdate: (req, res) => {
    //     if (!req.session.userId || !req.body.ip) {
    //         res.send({message: "Error", error: "Not logged in"});
    //     } else {
    //         User.findOne({_id: req.session.userId}, function(err, foundUser) {
    //             if(err) {
    //                 console.log('error finding ', err);
    //                 res.send({message: "Error", error: err});
    //             } else {
    //                 foundUser.localIp = req.body.ip;
    //                 foundUser.save(function(err) {
    //                     if(err) {
    //                         console.log('error saving ', err);
    //                         res.send({message: "Error", error: err});
    //                     } else {
    //                         res.send({message: "Success", ip: req.body.ip});
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // },
    // app: (req, res) => {
    //     if(!req.session.userId) {
    //         res.redirect('/login');
    //         return
    //     }
    //     User.findOne({_id: req.session.userId}, function(err, foundUser) {
    //         if(err) {
    //             console.log('error finding ', err);
    //             res.redirect('/login');
    //         } else {
    //             if (foundUser.displayName != req.params.username) {
    //                 res.redirect('/' + foundUser.displayName);
    //             } else if (foundUser.acceptedPP == undefined) {
    //                 res.redirect('/privacy-agreement');
    //             } else {
    //                 // check if user accesstoken has expired or is within 2 mins of expiring
    //                 let curr = new Date();
    //                 let currT = curr.getTime();
    //                 currT += 120000;
    //                 console.log(currT, foundUser.expiresIn);
    //                 if(currT >= foundUser.expiresIn) {
    //                     // refresh the token
    //                     let pUrl = "https://id.twitch.tv/oauth2/token";
    //                     let opts = {
    //                         method: 'POST',
    //                         url: pUrl,
    //                         timeout: 10000,
    //                         headers: {
    //                             "Authorization": "Bearer ".concat(foundUser.accessToken),
    //                             "Client-ID": "1w72cq9l8ub9r1pzuqrh91pwduz8r2",
    //                             "Content-Type": "application/x-www-form-urlencoded",
    //                             "Accept": "application/vnd.twitchtv.v5+json",
    //                         },
    //                         form: {
    //                             "grant_type": "refresh_token",
    //                             "refresh_token": foundUser.refreshToken,
    //                             "client_id": twitchCltId,
    //                             "client_secret": twitchSecret 
    //                         }
    //                     };
    //                     request(opts, function(error, response, body) {
    //                         if(error) {
    //                             console.log("error in request for refresh token: ", error);
    //                             res.redirect('/user/' + foundUser.displayName);
    //                         } else {
    //                             let jRes = JSON.parse(body);
    //                             console.log(jRes);
    //                             foundUser.accessToken = jRes["access_token"];
    //                             foundUser.refreshToken = jRes["refresh_token"];
    //                             let curr = new Date();
    //                             let currT = curr.getTime();
    //                             currT += parseInt(jRes["expires_in"]) * 1000;
    //                             foundUser.expiresIn = currT;
    //                             // save changes to db
    //                             foundUser.save(function(err) {
    //                                 if (err) {
    //                                     console.log('error saving refresh update, ', err);
    //                                     res.redirect('/' + foundUser.displayName);
    //                                 } else {
    //                                     // sanitize user data
    //                                     let user = {
    //                                         userId: foundUser._id,
    //                                         displayName: foundUser.displayName,
    //                                         twitchId: foundUser.twitchId,
    //                                         email: foundUser.email,
    //                                         imgUrl: foundUser.imgUrl,
    //                                         localIp: foundUser.localIp,
    //                                         oauth: foundUser.accessToken,
    //                                         password: foundUser.password,
    //                                         custom: foundUser.custom,
    //                                         winMsg: foundUser.winMsg
    //                                     };
    //                                     // render the application
    //                                     res.render('obs', {user: user});
    //                                 }
    //                             });
    //                         }
    //                     });
    //                 } else {
    //                     // sanitize user data
    //                     let user = {
    //                         userId: foundUser._id,
    //                         displayName: foundUser.displayName,
    //                         twitchId: foundUser.twitchId,
    //                         email: foundUser.email,
    //                         imgUrl: foundUser.imgUrl,
    //                         localIp: foundUser.localIp,
    //                         oauth: foundUser.accessToken,
    //                         password: foundUser.password,
    //                         custom: foundUser.custom,
    //                         winMsg: foundUser.winMsg
    //                     };
    //                     // render the application
    //                     res.json({ message: "success", data: user});
    //                 }
    //             }
    //         }
    //     });
    // },
    // password: (req, res) => {
    //     // check if logged in
    //     if (!req.session.userId) {
    //         res.redirect('/login');
    //     // check if correct route was used
    //     } else if (req.session.userId != req.params.id) {
    //         res.redirect('/login');
    //         // maybe send them to the dashboard instead?
    //     } else {
    //         // update user info
    //         User.findOne({_id: req.session.userId}, function(err, foundUser) {
    //             if(err) {
    //                 console.log('error finding ', err);
    //                 res.redirect('/login');
    //             } else {
    //                 foundUser.password = req.body.password;
    //                 foundUser.save(function(err) {
    //                     if(err) {
    //                         console.log('error saving new password ', err);
    //                         res.redirect('/login');
    //                     } else {
    //                         res.redirect('/user/' + foundUser.displayName + "/app");
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // },
    // twitter: (req, res) => {
    //     console.log(req.body, req.query, req);
    // },
    // newButton: (req, res) => {
    //     if(!req.session.userId) {
    //         res.redirect('/home');
    //     } else {
    //         // check body
    //         if(req.body.title && req.body.command && req.body.icon) {
    //             // get user
    //             User.findOne({_id: req.session.userId}, function(err, foundUser) {
    //                 if(err) {
    //                     console.log('error finding', err);
    //                     res.send({message: "Error", error: err});
    //                 } else {
    //                     // check if user has too many buttons already
    //                     if(foundUser.custom.length == 3) {
    //                         res.send({message: "Error", error: "Already have 3 custom buttons"});
    //                     } else {
    //                         let newBtn = {
    //                             title: req.body.title,
    //                             command: req.body.command,
    //                             icon: req.body.icon
    //                         }
    //                     // update and save user
    //                         foundUser.custom.push(newBtn);
    //                         foundUser.save(function(err, savedUser) {
    //                             if(err) {
    //                                 console.log("error saving", err);
    //                                 res.send({message: "Error", error: err});
    //                             } else {
    //                                 res.send({message: "Success", data: savedUser.custom});
    //                             }
    //                         });
    //                     }
    //                 }
    //             });
    //         } else {
    //             res.send({message: "Error", error: "Must submit a title, command and icon."})
    //         }
    //     }
    // },
    // delButton: (req, res) => {
    //     if(!req.session.userId) {
    //         res.redirect('/home');
    //     } else {
    //         // get user
    //         User.findOne({_id: req.session.userId}, function(err, foundUser) {
    //             if(err) {
    //                 console.log('error finding', err);
    //                 res.send({message: "Error", error: err});
    //             } else {
    //                 if(req.params.id < 3 && req.params.id >= 0) {
    //                     var newArr = [];
    //                     if(req.params.id == 2) {
    //                         newArr = foundUser.custom;
    //                         newArr.pop();
    //                     } else if (req.params.id == 0) {
    //                         newArr = foundUser.custom;
    //                         newArr.shift();
    //                     } else {
    //                         newArr.push(foundUser.custom[0]);
    //                         if(foundUser.custom.length == 3) {
    //                             newArr.push(foundUser.custom[2]);
    //                         }
    //                     }
    //                     foundUser.custom = newArr;
    //                     foundUser.save(function(err, savedUser) {
    //                         if(err) {
    //                             console.log("error saving", err);
    //                             res.send({message: "Error", error: err});
    //                         } else {
    //                             res.send({message: "Success", data: savedUser.custom});
    //                         }
    //                     });
    //                 }
                    
    //             }
    //         });
    //     }
    // },
    // updateWinStr: (req, res) => {
    //     if(!req.session.userId) {
    //         res.redirect('/home');
    //     } else {
    //         // get user
    //         User.findOne({_id: req.session.userId}, function(err, foundUser) {
    //             if(err) {
    //                 console.log('error finding', err);
    //                 res.send({message: "Error", error: err});
    //             } else {
    //                 foundUser.winMsg = req.body.winMsg;
    //                 foundUser.save(function(err, user) {
    //                     if(err) {
    //                         console.log('error saving ', err);
    //                         res.send({message: 'Error', error: err});
    //                     } else {
    //                         res.send({message: "Success"});
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // },
    // fourohfour: (req, res) => {
    //     res.render('fourohfour');
    // },
    // logThemIn: (req, res) => {
    //     if(req.body.username) {
    //         if (permittedUsers[req.body.username]) {
    //             // give cookie
    //             User.findOne({displayName: req.body.username}, function(err, foundUser) {
    //                 if (err) {
    //                     console.log(err);
    //                     res.send(err);
    //                 } else {
    //                     req.session.userId = foundUser._id;
    //                     res.redirect('/user/' + foundUser.displayName);
    //                 }
    //             });
    //         } else {
    //             res.redirect('/home');
    //         }
    //     } else {
    //         res.redirect('/home');
    //     }
    // },
    // loginPlain: (req, res) => {
    //     res.render('loginPlain');
    // }
}