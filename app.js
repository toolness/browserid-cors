var express = require('express'),
    browserid = require('./browserid'),
    app = express.createServer();

app.use(express.bodyParser());

app.verify = browserid.verify;

app.post('/auth', function(req, res) {
  var origin = req.header('Origin'),
      assertion = req.param('assertion');

  res.header('Access-Control-Allow-Origin', '*');
  if (!origin)
    return res.send('origin header required', 400);
  if (!assertion)
    return res.send('assertion required', 400);
  
  app.verify(origin, assertion, function(err, email) {
    if (err)
      res.send(err, 400);
    else
      res.send({
        email: email
      });
  });
});

module.exports = app;

if (!module.parent)
  app.listen(3000);
