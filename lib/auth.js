exports.handler = function(options) {
  return function(req, res) {
    var origin = req.header('Origin'),
        assertion = req.param('assertion');

    res.header('Access-Control-Allow-Origin', '*');
    if (!origin)
      return res.send('origin header required', 400);
    if (!assertion)
      return res.send('assertion required', 400);

    options.verify(origin, assertion, function(err, email) {
      if (err)
        res.send(err, 400);
      else {
        options.createToken({
          email: email,
          origin: origin
        }, function(err, token) {
          if (err)
            return res.send('unable to generate token', 500);
          res.send({
            email: email,
            accessToken: token
          });
        });
      }
    });
  };
};
