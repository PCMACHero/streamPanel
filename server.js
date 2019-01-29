var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
var app = express();
var reactApp = express();
var port = 8000;

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, './build/static')));
app.set('views', path.join(__dirname, './client/views'));
app.set('view engine', 'ejs');

reactApp.use(bodyParser.urlencoded({extended:true}));
reactApp.use(express.static(path.join(__dirname, './build/static')))

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

require('./server/config/routes')(app, reactApp);

app.listen(port, function() {
    console.log(`listening on port ` + port);
});