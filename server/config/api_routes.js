const prefix = '/api';

module.exports = function(app) {
    app.get(prefix, (req, res, next) => {
        res.send('hola there')
    })
}