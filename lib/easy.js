var auth = require('./auth'),
    browserid = require('./browserid'),
    LocalTokenStorage = require('./local-token-storage'),
    tokenMiddleware = require('./token-middleware');

module.exports = function BrowserIDCORS(options) {
  options = options || {};
  
  var tokenStorage = options.tokenStorage || LocalTokenStorage();

  return {
    tokenStorage: tokenStorage,
    handleTokenRequest: auth.handler({
      verify: browserid.verify,
      createToken: tokenStorage.createToken
    }),
    accessToken: tokenMiddleware.accessToken(tokenStorage),
    requireAccessToken: tokenMiddleware.requireAccessToken(tokenStorage),
    fullCORS: function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers',
                 'Content-Type,X-Access-Token');
      next();
    }
  };
};
