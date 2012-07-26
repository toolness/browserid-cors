var express = require('express'),
    auth = require('./auth'),
    browserid = require('./browserid'),
    app = express.createServer();

app.use(express.bodyParser());
app.post('/auth', auth.handler(browserid.verify));

module.exports = app;

if (!module.parent)
  app.listen(3000);
