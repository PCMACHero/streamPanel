const users = require('../controllers/user'),
      api = require('../controllers/api');

module.exports = function(app) {
    app.get('/', users.root);
    app.get('/home', users.index);
    app.get('/success/payment-portal', users.twitch);
    // app.get('/payment', users.pay);
    app.get('/privacy-agreement', users.beta);
    app.post('/privacy-accepted', users.privacy);
    app.post('/newUrl', users.manualUpdate);
    app.post('/newIp', users.autoUpdate);
    // app.post('/paypal-accepted/:purchaseId', users.paid);
    // app.get('/login', users.login);
    app.post('/update-password/:id', users.password);
    app.get('/user/:username', users.dashboard);
    app.get('/user/:username/boarding', users.boarding);
    app.get('/user/:username/app', users.app);
    app.post('/twitter', users.twitter);
    app.post('/new-button', users.newButton);
    app.post('/winning-str', users.updateWinStr);
    app.delete('/new-button/:id', users.delButton);
    app.get('/login', users.loginPlain);
    app.post('/login', users.logThemIn);
    app.post('/api/*', )
    app.all('*', users.renderReact);
    // app.get('/success', users.success);
}