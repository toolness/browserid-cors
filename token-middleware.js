module.exports = function(tokenStorage) {
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
