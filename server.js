var express = require('express');
var path = require('path');
const fs = require('fs');
var bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const SessionCredentials = require('./common_config/config').SessionCredentials;
var app = express();
var port = 8000;

// app.use(cors())
app.use(bodyParser.urlencoded({extended:true}));
// app.use('/assets', express.static(path.resolve(__dirname, 'assets')));
// app.use('/media', express.static(path.resolve(__dirname, 'media')));

// hide powered by express
app.disable('x-powered-by');
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, './build')));

app.use(session({
    secret: SessionCredentials.secret,
    name: SessionCredentials.name,
    proxy: true,
    resave: true,
    saveUninitialized: true,
    maxAge  : new Date(Date.now() + SessionCredentials.maxAge)
}));

app.use(cors());

require('./server/config/mongoose');

require('./server/config/routes')(app);

app.listen(port, function() {
    console.log(`listening on port ` + port);
});