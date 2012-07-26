exports.handler = function(verify) {
  return function(req, res) {
    var origin = req.header('Origin'),
        assertion = req.param('assertion');

    res.header('Access-Control-Allow-Origin', '*');
    if (!origin)
      return res.send('origin header required', 400);
    if (!assertion)
      return res.send('assertion required', 400);

    verify(origin, assertion, function(err, email) {
      if (err)
        res.send(err, 400);
      else
        res.send({
          email: email
        });
    });
  };
};
