exports.requireAccessToken = function(tokenStorage) {
  var accessToken = exports.accessToken(tokenStorage);
  return function(req, res, next) {
    accessToken(req, res, function() {
      if (!req.user)
        return res.send('valid access token required', 403);
      next();
    });
  };
};

exports.accessToken = function(tokenStorage) {
  return function(req, res, next) {
    var accessToken = req.param('accessToken');
    if (accessToken) {
      tokenStorage.getTokenInfo(accessToken, function(err, info) {
        if (err)
          return res.send('unable to get access token info', 500);
        req.user = info;
        next();
      });
    } else
      next();
  };
};
