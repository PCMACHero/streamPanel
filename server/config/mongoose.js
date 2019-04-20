const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

var db = 'mongodb://localhost/streamPanel';

mongoose.Promise = global.Promise;

mongoose.connect(db, function() {
    console.log("mongo db connected");
});

var models_path = path.join(__dirname, './../models');

fs.readdirSync(models_path).forEach(function(file) {
    if(file.indexOf('.js') >= 0) {
        require(models_path + '/' + file);
    }
});