var express = require('express'),
    auth = require('./auth'),
    browserid = require('./browserid'),
    app = express.createServer(),
    LocalTokenStorage = require('./local-token-storage'),
    TokenMiddleware = require('./token-middleware'),
    lts = LocalTokenStorage();

app.use(express.bodyParser());
app.use(TokenMiddleware(lts));
app.post('/auth', auth.handler({
  verify: browserid.verify,
  createToken: lts.createToken
}));
app.get('/token-info', function(req, res) {
  res.header('Access-Control-Allow-Origin', '*');
  res.send(req.user);
});

module.exports = app;

if (!module.parent)
  app.listen(3000);
