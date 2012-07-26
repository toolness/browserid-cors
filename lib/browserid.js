var https = require('https'),
    querystring = require('querystring');

exports.verify = function(audience, assertion, cb) {
  var body = querystring.stringify({
    audience: audience,
    assertion: assertion
  });

  var verifyReq = https.request({
    host: 'browserid.org',
    port: 443,
    path: '/verify',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': body.length.toString()
    }
  }, function(verifyRes) {
    var chunks = [];
    if (verifyRes.statusCode == 200) {
      verifyRes.setEncoding('utf8');
      verifyRes.on('data', function(chunk) { chunks.push(chunk); });
      verifyRes.on('end', function() {
        var result = JSON.parse(chunks.join(''));
        if (result.status == "okay")
          cb(null, result.email);
        else
          cb('bad assertion');
      });
    } else {
      cb('bad response from verifier');
    }
  });

  verifyReq.on('error', function() {
    cb('could not reach verify server');
  });
  verifyReq.write(body);
  verifyReq.end();
};
