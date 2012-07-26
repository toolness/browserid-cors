var express = require('express'),
    auth = require('./auth'),
    browserid = require('./browserid'),
    app = express.createServer(),
    LocalTokenStorage = require('./local-token-storage'),
    lts = LocalTokenStorage();

app.use(express.bodyParser());
app.post('/auth', auth.handler({
  verify: browserid.verify,
  createToken: lts.createToken
}));

module.exports = app;

if (!module.parent)
  app.listen(3000);
