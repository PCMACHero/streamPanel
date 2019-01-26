const mongoose = require('mongoose');
const request = require('request');
const session = require('express-session');
// const url = require('url');
const twitchCltId = "1w72cq9l8ub9r1pzuqrh91pwduz8r2";
const twitchSecret = "kbindvae0yd2g2c6lbsfq83f86rezr";
const randState = "77bfce89f4169e4e4e79d45af98d0c04";
const redirectUri = "http://localhost:8000/success/payment-portal";
const responseStr = "https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=" + twitchCltId + "&redirect_uri=" + redirectUri + "&scope=channel_editor+chat_login+viewing_activity_read+user:read:email+bits:read&state=" + randState;

const permittedUsers = {
    "twboapp@gmail.com": true,
    "twboapp": true
}

var User = mongoose.model('User');

module.exports = {
    root: (req, res) => {
        // check if they're logged in
        if(!req.session.userId) {
            res.redirect('/home');
        } else {
            // find user info
            User.findOne({_id: req.session.userId}, function(err, foundUser) {
                if(err) {
                    console.log('error finding ', err);
                    res.redirect('/home');
                } else {
                    // send to dashboard if they're logged in
                    res.redirect('/user/' + foundUser.displayName);
                }
            });
        }
    },
    index: (req, res) => {
        res.render('landingPage', {twitchLink: responseStr});
    },
    twitch: (req, res) => {
        if (req.query.state == randState && req.query.code) {
            const code = req.query.code;
            request({
                uri: "https://id.twitch.tv/oauth2/token?client_id=" + twitchCltId + "&client_secret=" + twitchSecret + "&grant_type=authorization_code&redirect_uri=" + redirectUri + "&code=" + code,
                method: "POST",
                timeout: 10000,
                followRedirect: true,
                maxRedirects: 10
              }, function(error, response, body) {
                // Todo: Validate the response id_token

                if(error) {
                    console.log("error in Twitch handshake", error);
                    res.send(error);
                    return;
                } 

                var jsonResponse = JSON.parse(body);
                var idToken = jsonResponse["id_token"];
                var accessToken = jsonResponse["access_token"];
                var refreshToken = jsonResponse["refresh_token"];
                var expires_in = jsonResponse["expires_in"];
                // set the exact time that this expires using date
                let d = new Date();
                var expires = parseInt(expires_in) * 1000;
                expires += d.getTime();

                var postUrl = "https://api.twitch.tv/helix/users";
                var options = {
                    method: 'GET',
                    url: postUrl,
                    timeout: 10000,
                    headers: {
                        "Authorization": "Bearer ".concat(accessToken)
                    }
                };
                request(options, function(error,response,body){
                    // Store in the db
                    if(error) {
                        console.log("error in request", error);
                        res.send(error);
                        return
                    }
                    // console.log(response);
                    var jsonResponse = JSON.parse(body);
                    if(!jsonResponse.data) {
                        res.redirect('home');
                        return;
                    } else if (jsonResponse.data.length === 0) {
                        res.redirect('home');
                        return;
                    }
                    var userData = jsonResponse.data[0];
                // check if duplicate key error
                    if (!userData.email) {
                        res.redirect('/home');
                        return;
                    }
                    User.findOne({email: userData.email}, function(err, user) {
                        if (err) {
                            console.log('error finding: ', err);
                            res.redirect('/home');
                        } else {
                            if (user) {
                                // console.log("user: ", user);
                                req.session.userId = user._id;
                                // res.redirect('/payment');
                                // Check if the tokens have changed and update them
                                if (user.accessToken != accessToken && user.refreshToken != refreshToken) {
                                    user.accessToken = accessToken;
                                    user.refreshToken = refreshToken;
                                    user.expiresIn = expires;
                                } else if (user.accessToken != accessToken) {
                                    user.accessToken = accessToken;
                                    user.expiresIn = expires;
                                } else {
                                    // Check if user has already accepted the privacy agreement
                                    if(user.acceptedPP == undefined) {
                                        res.redirect('/privacy-agreement');
                                        return
                                    } else {
                                        res.redirect(`/user/${user.displayName}`);
                                        return
                                    }
                                }
                                user.save(function(err) {
                                    if(err) {
                                        console.log('error saving ', err);
                                        res.redirect('/home');
                                    } else {
                                    // Check if user has already accepted the privacy agreement
                                        if(user.acceptedPP == undefined) {
                                            res.redirect('/privacy-agreement');
                                        } else {
                                            console.log(user.accessToken, user.refreshToken);
                                            res.redirect(`/user/${user.displayName}`);
                                        }
                                    }
                                });
                            } else {
                                // So only beta testers can use...
                                if (permittedUsers[userData.email] != undefined) {
                                    let newUser = new User({
                                        idToken: idToken,
                                        refreshToken: refreshToken,
                                        accessToken: accessToken,
                                        expiresIn: expires,
                                        twitchId: userData.id,
                                        email: userData.email,
                                        displayName: userData.display_name,
                                        imgUrl: userData.profile_image_url,
                                        twitchLogin: userData.login
                                    });
                                    newUser.save(function(err, user) {
                                        if (err) {
                                            console.log("error saving: ", err);
                                            res.redirect('/home');
                                        } else {
                                            console.log('user saved successfully!');
                                            req.session.userId = user._id;
                                            // res.redirect('/payment');
                                            res.redirect('/privacy-agreement');
                                        }
                                    });
                                } else {
                                    console.log('not a permitted user');
                                    res.redirect('/home');
                                }
                            }
                        }
                    });
                });
              });
        } else {
            res.redirect('/home');
        }
    },
    pay: (req, res) => {
        if (!req.session.userId) {
            console.log('no id in session');
            res.redirect('/home');
        } else {
            if (!mongoose.Types.ObjectId.isValid(req.session.userId)){
                res.redirect('/home');
                return;
            }
            User.findOne({_id:req.session.userId}, function(err, foundUser) {
                if (err) {
                    console.log("error finding user", err);
                    res.redirect('/home');
                } else {
                    res.render('payment', {user: foundUser});
                }
            });
        }
    },
    beta: (req, res) => {
        if (!req.session.userId) {
            console.log('no id in session');
            res.redirect('/home');
        } else {
            if (!mongoose.Types.ObjectId.isValid(req.session.userId)){
                res.redirect('/home');
                return;
            }
            User.findOne({_id:req.session.userId}, function(err, foundUser) {
                if (err) {
                    console.log("error finding user", err);
                    res.redirect('/home');
                } else {
                    res.render('pp', {user: foundUser});
                }
            });
        }
    },
    paid: (req, res) => {
        // Get an authentication token every day.
        // Take the id that is submitted and verify it with Paypal
        let purchaseId = req.params.purchaseId;
        console.log(purchaseId);
        // var options = {
        //     method: 'GET',
        //     url: "https://api.sandbox.paypal.com/v1/payments/orders/".concat(purchaseId),
        //     timeout: 10000,
        //     headers: {
        //         "Content-Type": "application/json",
        //         "Authorization": "Bearer ".concat(accessToken)
        //     }
        // };
        // Check for the referral code and place it in the correct place

        // Once verified change their account to has paid
        
        // If there is a referral code
        User.findOne({_id:req.session.userId}, function(err, foundUser) {
            if(err) {
                console.log("error finding", err);
                res.send(err);
            } else {
                foundUser.hasPaid = true;
                foundUser.referredBy = req.body.referralCode;
                // save changes
                res.send({message: "Success"});
            }
        });
        // Redirect to a thank you page with the direct link to the app
    },
    privacy: (req, res) => {
        // check form data and if there is someone logged in
        if (!req.session.userId) {
            res.redirect('/home');
        } else if (req.body.accepted != "true") {
            res.redirect('/home');
        }
        // if ok, add date to the user object
        User.findOne({_id:req.session.userId}, function(err, foundUser) {
            if(err) {
                console.log("error finding ", err);
                res.send(err);
            } else {
                let tDate = new Date();
                foundUser.acceptedPP = tDate;
                // save changes
                foundUser.save(function(err, user) {
                    if (err) {
                        console.log('error saving ', err);
                        res.redirect('/home');
                    } else {
                        res.redirect('/user/' + user.displayName);
                    }
                });
            }
        });
        // redirect to the app link w/o data
    },
    success: (req, res) => {
        res.send("Welcome partner!");
    },
    dashboard: (req, res) => {
        if(!req.session.userId) {
            res.redirect('/login');
            return
        }
        User.findOne({_id: req.session.userId}, function(err, foundUser) {
            if(err) {
                console.log('error finding ', err);
                res.redirect('/login');
            } else {
                if (foundUser.displayName != req.params.username) {
                    res.redirect('/' + foundUser.displayName);
                } else if (foundUser.acceptedPP == undefined) {
                    res.redirect('/privacy-agreement');
                } else {
                    // sanitize user data
                    let user = {
                        "_id": foundUser._id,
                        "twitchId": foundUser.twitchId,
                        "displayName": foundUser.displayName,
                        "twitchId": foundUser.twitchId,
                        "email": foundUser.email,
                        "imgUrl": foundUser.imgUrl,
                        "ip": foundUser.localIp,
                        "custom": foundUser.custom
                    };
                    // render the dashboard
                    res.render('dash', {user: user});
                }
            }
        });
    },
    login: (req, res) => {
        res.render('login', {twitchLink: responseStr});
    },
    boarding: (req, res) => {
        if(!req.session.userId) {
            res.redirect('/login');
            return
        }
        User.findOne({_id: req.session.userId}, function(err, foundUser) {
            if(err) {
                console.log('error finding ', err);
                res.redirect('/login');
            } else {
                if (foundUser.displayName != req.params.username) {
                    res.redirect('/' + foundUser.displayName);
                } else if (foundUser.acceptedPP == undefined) {
                    res.redirect('/privacy-agreement');
                } else {
                    // sanitize user data
                    let user = {
                        _id: foundUser._id,
                        displayName: foundUser.displayName,
                        localIp: foundUser.localIp
                    };
                    // render the dashboard
                    res.render('boarding', {user: user});
                }
            }
        });
    },
    manualUpdate: (req, res) => {
        if (!req.session.userId || !req.body.ip) {
            res.redirect('/login');
        } else {
            User.findOne({_id: req.session.userId}, function(err, foundUser) {
                if(err) {
                    console.log('error finding ', err);
                    res.redirect('/login');
                } else {
                    foundUser.localIp = req.body.ip;
                    foundUser.save(function(err) {
                        if(err) {
                            console.log('error saving ', err);
                            res.redirect(`/user/${foundUser.displayName}/boarding`);
                        } else {
                            res.redirect(`/user/${foundUser.displayName}/app`);
                        }
                    });
                }
            });
        }
    },
    autoUpdate: (req, res) => {
        if (!req.session.userId || !req.body.ip) {
            res.send({message: "Error", error: "Not logged in"});
        } else {
            User.findOne({_id: req.session.userId}, function(err, foundUser) {
                if(err) {
                    console.log('error finding ', err);
                    res.send({message: "Error", error: err});
                } else {
                    foundUser.localIp = req.body.ip;
                    foundUser.save(function(err) {
                        if(err) {
                            console.log('error saving ', err);
                            res.send({message: "Error", error: err});
                        } else {
                            res.send({message: "Success", ip: req.body.ip});
                        }
                    });
                }
            });
        }
    },
    app: (req, res) => {
        if(!req.session.userId) {
            res.redirect('/login');
            return
        }
        User.findOne({_id: req.session.userId}, function(err, foundUser) {
            if(err) {
                console.log('error finding ', err);
                res.redirect('/login');
            } else {
                if (foundUser.displayName != req.params.username) {
                    res.redirect('/' + foundUser.displayName);
                } else if (foundUser.acceptedPP == undefined) {
                    res.redirect('/privacy-agreement');
                } else {
                    // check if user accesstoken has expired or is within 2 mins of expiring
                    let curr = new Date();
                    let currT = curr.getTime();
                    currT += 120000;
                    console.log(currT, foundUser.expiresIn);
                    if(currT >= foundUser.expiresIn) {
                        // refresh the token
                        let pUrl = "https://id.twitch.tv/oauth2/token";
                        let opts = {
                            method: 'POST',
                            url: pUrl,
                            timeout: 10000,
                            headers: {
                                "Authorization": "Bearer ".concat(foundUser.accessToken),
                                "Client-ID": "1w72cq9l8ub9r1pzuqrh91pwduz8r2",
                                "Content-Type": "application/x-www-form-urlencoded",
                                "Accept": "application/vnd.twitchtv.v5+json",
                            },
                            form: {
                                "grant_type": "refresh_token",
                                "refresh_token": foundUser.refreshToken,
                                "client_id": twitchCltId,
                                "client_secret": twitchSecret 
                            }
                        };
                        request(opts, function(error, response, body) {
                            if(error) {
                                console.log("error in request for refresh token: ", error);
                                res.redirect('/user/' + foundUser.displayName);
                            } else {
                                let jRes = JSON.parse(body);
                                console.log(jRes);
                                foundUser.accessToken = jRes["access_token"];
                                foundUser.refreshToken = jRes["refresh_token"];
                                let curr = new Date();
                                let currT = curr.getTime();
                                currT += parseInt(jRes["expires_in"]) * 1000;
                                foundUser.expiresIn = currT;
                                // save changes to db
                                foundUser.save(function(err) {
                                    if (err) {
                                        console.log('error saving refresh update, ', err);
                                        res.redirect('/' + foundUser.displayName);
                                    } else {
                                        // sanitize user data
                                        let user = {
                                            userId: foundUser._id,
                                            displayName: foundUser.displayName,
                                            twitchId: foundUser.twitchId,
                                            email: foundUser.email,
                                            imgUrl: foundUser.imgUrl,
                                            localIp: foundUser.localIp,
                                            oauth: foundUser.accessToken,
                                            password: foundUser.password,
                                            custom: foundUser.custom,
                                            winMsg: foundUser.winMsg
                                        };
                                        // render the application
                                        res.render('obs', {user: user});
                                    }
                                });
                            }
                        });
                    } else {
                        // sanitize user data
                        let user = {
                            userId: foundUser._id,
                            displayName: foundUser.displayName,
                            twitchId: foundUser.twitchId,
                            email: foundUser.email,
                            imgUrl: foundUser.imgUrl,
                            localIp: foundUser.localIp,
                            oauth: foundUser.accessToken,
                            password: foundUser.password,
                            custom: foundUser.custom,
                            winMsg: foundUser.winMsg
                        };
                        // render the application
                        res.render('obs', {user: user});
                    }
                }
            }
        });
    },
    password: (req, res) => {
        // check if logged in
        if (!req.session.userId) {
            res.redirect('login');
        // check if correct route was used
        } else if (req.session.userId != req.params.id) {
            res.redirect('login');
            // maybe send them to the dashboard instead?
        } else {
            // update user info
            User.findOne({_id: req.session.userId}, function(err, foundUser) {
                if(err) {
                    console.log('error finding ', err);
                    res.redirect('/login');
                } else {
                    foundUser.password = req.body.password;
                    foundUser.save(function(err) {
                        if(err) {
                            console.log('error saving new password ', err);
                            res.redirect('/login');
                        } else {
                            res.redirect('/user/' + foundUser.displayName + "/app");
                        }
                    });
                }
            });
        }
    },
    twitter: (req, res) => {
        console.log(req.body, req.query, req);
    },
    newButton: (req, res) => {
        if(!req.session.userId) {
            res.redirect('/home');
        } else {
            // check body
            if(req.body.title && req.body.command && req.body.icon) {
                // get user
                User.findOne({_id: req.session.userId}, function(err, foundUser) {
                    if(err) {
                        console.log('error finding', err);
                        res.send({message: "Error", error: err});
                    } else {
                        // check if user has too many buttons already
                        if(foundUser.custom.length == 3) {
                            res.send({message: "Error", error: "Already have 3 custom buttons"});
                        } else {
                            let newBtn = {
                                title: req.body.title,
                                command: req.body.command,
                                icon: req.body.icon
                            }
                        // update and save user
                            foundUser.custom.push(newBtn);
                            foundUser.save(function(err, savedUser) {
                                if(err) {
                                    console.log("error saving", err);
                                    res.send({message: "Error", error: err});
                                } else {
                                    res.send({message: "Success", data: savedUser.custom});
                                }
                            });
                        }
                    }
                });
            } else {
                res.send({message: "Error", error: "Must submit a title, command and icon."})
            }
        }
    },
    delButton: (req, res) => {
        if(!req.session.userId) {
            res.redirect('/home');
        } else {
            // get user
            User.findOne({_id: req.session.userId}, function(err, foundUser) {
                if(err) {
                    console.log('error finding', err);
                    res.send({message: "Error", error: err});
                } else {
                    if(req.params.id < 3 && req.params.id >= 0) {
                        var newArr = [];
                        if(req.params.id == 2) {
                            newArr = foundUser.custom;
                            newArr.pop();
                        } else if (req.params.id == 0) {
                            newArr = foundUser.custom;
                            newArr.shift();
                        } else {
                            newArr.push(foundUser.custom[0]);
                            if(foundUser.custom.length == 3) {
                                newArr.push(foundUser.custom[2]);
                            }
                        }
                        foundUser.custom = newArr;
                        foundUser.save(function(err, savedUser) {
                            if(err) {
                                console.log("error saving", err);
                                res.send({message: "Error", error: err});
                            } else {
                                res.send({message: "Success", data: savedUser.custom});
                            }
                        });
                    }
                    
                }
            });
        }
    },
    updateWinStr: (req, res) => {
        if(!req.session.userId) {
            res.redirect('/home');
        } else {
            // get user
            User.findOne({_id: req.session.userId}, function(err, foundUser) {
                if(err) {
                    console.log('error finding', err);
                    res.send({message: "Error", error: err});
                } else {
                    foundUser.winMsg = req.body.winMsg;
                    foundUser.save(function(err, user) {
                        if(err) {
                            console.log('error saving ', err);
                            res.send({message: 'Error', error: err});
                        } else {
                            res.send({message: "Success"});
                        }
                    });
                }
            });
        }
    },
    fourohfour: (req, res) => {
        res.render('fourohfour');
    },
    logThemIn: (req, res) => {
        if(req.body.username) {
            if (permittedUsers[req.body.username]) {
                // give cookie
                User.findOne({displayName: req.body.username}, function(err, foundUser) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    } else {
                        req.session.userId = foundUser._id;
                        res.redirect('/user/' + foundUser.displayName);
                    }
                });
            } else {
                res.redirect('/home');
            }
        } else {
            res.redirect('/home');
        }
    },
    loginPlain: (req, res) => {
        res.render('loginPlain');
    }
}