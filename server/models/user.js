const mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    idToken: {type: String, required: false},
    refreshToken: {type: String, required: true},
    accessToken: {type: String, required: true},
    expiresIn: {type: Number, required: true},
    twitchId: {type: String, required: true, unique: true},
    displayName: {type: String, minlength: 4, required: true},
    email: {type: String, minlength: 5, required: true, unique: true},
    hasPaid: {type: Boolean},
    imgUrl: {type: String},
    twitchLogin: {type: String, minlength: 2, required: true},
    referredBy: {type: String, maxlength: 6, required: false},
    acceptedPP: {type: String, required: false},
    localIp: {type: String, required: false},
    password: {type: String, required: false},
    custom: {type: Array, required: false},
    winMsg: {type: String, required: false}
}, {timestamps: true});

mongoose.model('User', UserSchema);