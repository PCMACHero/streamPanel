var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
var app = express();
var port = 8000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, './client/static')));
app.set('views', path.join(__dirname, './client/views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: "77bfce89f4169e4e4e79d45af98d0c04",
    name: "Stream Daddy",
    proxy: true,
    resave: true,
    saveUninitialized: true,
    maxAge  : new Date(Date.now() + 3600000)
}));

app.use(cors());

require('./server/config/mongoose');

require('./server/config/routes')(app);

var server = app.listen(port, function() {
    console.log('listening on 8000');
});