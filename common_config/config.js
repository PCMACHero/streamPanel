const TwitchCredentials = {
    twitchCltId : "1w72cq9l8ub9r1pzuqrh91pwduz8r2",
    twitchSecret : "kbindvae0yd2g2c6lbsfq83f86rezr",
    randState : "77bfce89f4169e4e4e79d45af98d0c04",
    redirectUri : "http://localhost:8000/success/payment-portal",
}

const PermittedUsers = {
    "twboapp@gmail.com": true,
    "twboapp": true
}

const SessionCredentials = {
    secret: "77bfce89f4169e4e4e79d45af98d0c04",
    name: "Stream Daddy",
    maxAge: 3600000
}

module.exports = {
    TwitchCredentials,
    PermittedUsers,
    SessionCredentials
}