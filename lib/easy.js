var auth = require('./auth'),
    browserid = require('./browserid'),
    LocalTokenStorage = require('./local-token-storage'),
    TokenMiddleware = require('./token-middleware');

exports.middleware = function() {
  var lts = LocalTokenStorage(),
      tokenMiddleware = TokenMiddleware(lts),
      authHandler = auth.handler({
        verify: browserid.verify,
        createToken: lts.createToken
      });

  return function(req, res, next) {
    if (req.method == 'POST' && req.path == '/auth')
      return authHandler(req, res);
    res.header('Access-Control-Allow-Origin', '*');
    return tokenMiddleware(req, res, next);
  };
};
