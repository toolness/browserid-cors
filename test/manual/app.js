var express = require('express'),
    bic = require('../../lib/easy')(),
    app = express.createServer(),
    staticServer = express.createServer();

app.use(express.bodyParser());
app.post('/token', bic.handleTokenRequest);
app.get('/token-info', bic.accessToken, bic.fullCORS, function(req, res) {
  res.send(req.user);
});

staticServer.use(express.static(__dirname));

app.listen(3001, function() {
  console.log("CORS endpoint ready on port 3001.");
  staticServer.listen(3000, function() {
    console.log("Static file server ready on port 3000.");
    console.log("Please visit http://localhost:3000 to manually test.");
  });
});
