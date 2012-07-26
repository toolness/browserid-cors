var tokens = require('./tokens');

module.exports = function(options) {
  options = options || {};
  
  var tokenLength = options.tokenLength || 40,
      accessTokens = {};
  
  return {
    createToken: function(info, cb) {
      tokens.findUniqueRandomString(tokenLength, function(token, retry) {
        if (!token)
          return cb('cannot generate random string');
        if (token in accessTokens)
          return retry();
        accessTokens[token] = info;
        cb(null, token);
      });
    },
    getTokenInfo: function(token, cb) {
      cb(null, accessTokens[token] || null);
    }
  };
};
