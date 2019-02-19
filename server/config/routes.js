const users = require('../controllers/user'),
      api = require('../controllers/api');

module.exports = function(app) {

    // Twitch
    app.get('/success/payment-portal', users.twitch);
    app.get('*', users.renderReact);
    
    // API Routes
    
    app.post('/api/isuserauthenticated', api.isAuthenticated);
    app.post('/api/updatelocalip', api.updateUserLocalIP);
    app.post('/api/updateobspassword', api.updateOBSPassword);
    app.post('/api/newcommand', api.createNewCommand);
    app.delete('/api/command/', api.deleteCommand);
    app.post('/api/updatewinmessage', api.updateWinMessage);
    app.post('/api/getuserinfo', api.getUserInfo);
    app.post('/api/getresponsestring', api.returnResponseString);
    app.post('/api/testroute', api.testRoute);
    
    // React Routes
    // app.all('*', users.renderReact);
    
    // Old Routes

        // Static Website

    // app.get('/', users.root);
    // app.get('/home', users.index);
    // app.get('/privacy-agreement', users.beta);
    // app.post('/privacy-accepted', users.privacy);
    // app.post('/newUrl', users.manualUpdate);
    // app.post('/newIp', users.autoUpdate);
    // app.post('/update-password/:id', users.password);
    // app.get('/user/:username', users.dashboard);
    
    // app.get('/payment', users.pay);
    // app.post('/paypal-accepted/:purchaseId', users.paid);
    // app.get('/login', users.login);
    // app.get('/user/:username/boarding', users.boarding);
    // app.get('/user/:username/app', users.app);
    // app.post('/twitter', users.twitter);
    // app.post('/new-button', users.newButton);
    // app.post('/winning-str', users.updateWinStr);
    // app.delete('/new-button/:id', users.delButton);
    // app.get('/login', users.loginPlain);
    // app.post('/login', users.logThemIn);
}