const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = {
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
    }
}