var expect = require('expect.js'),
    request = require('request'),
    express = require('express'),
    tokenMiddleware = require('../lib/token-middleware');

function req(method, accessToken, cb, constructor, useHeader) {
  var server = express.createServer();
  var headers = useHeader ? {'X-Access-Token': 'abcd'} : {};
  server.use(express.bodyParser());
  server.use((constructor || tokenMiddleware.accessToken)({
    getTokenInfo: function(token, cb) {
      expect(token).to.be(accessToken);
      if (token == "abcd")
        cb(null, {name: "foo"});
      else if (token == "error")
        cb("FAIL");
      else
        cb(null, null);
    }
  }));
  server.get("/", function(req, res) { res.send(req.user); });
  server.post("/", function(req, res) { res.send(req.user); });
  server.listen(5234, function() {
    var url = 'http://127.0.0.1:5234/';
    
    function finishReq(e, r, b) {
      server.close();
      cb(e, r, b);
    }
    
    if (method == 'GET') {
      if (accessToken)
        url += '?accessToken=' + accessToken;
      request(url, finishReq);
    } else if (method == 'POST') {
      request({
        method: 'POST',
        url: url,
        form: {
          accessToken: accessToken
        },
        headers: headers
      }, finishReq);
    }
  });
}

describe("tokenMiddleware.requireAccessToken()", function() {
  it("should deny requests without valid access tokens", function(done) {
    req('GET', null, function(error, response, body) {
      expect(response.statusCode).to.be(403);
      expect(body).to.eql('valid access token required');
      done();
    }, tokenMiddleware.requireAccessToken);
  });
  
  it("should accept requests with valid access tokens", function(done) {
    req('POST', 'abcd', function(error, response, body) {
      expect(response.statusCode).to.be(200);
      expect(JSON.parse(body)).to.eql({name: 'foo'});
      done();
    }, tokenMiddleware.requireAccessToken);
  });
});

describe("tokenMiddleware.accessToken()", function() {
  it("should work when token is passed in HTTP header", function(done) {
    req('POST', 'abcd', function(error, response, body) {
      expect(response.statusCode).to.be(200);
      expect(JSON.parse(body)).to.eql({name: 'foo'});
      done();
    }, undefined, true);
  });
  
  it("should work when token is passed in POST requests", function(done) {
    req('POST', 'abcd', function(error, response, body) {
      expect(response.statusCode).to.be(200);
      expect(JSON.parse(body)).to.eql({name: 'foo'});
      done();
    });
  });

  it("should not set req.user when no token is passed", function(done) {
    req('GET', null, function(error, response, body) {
      expect(response.statusCode).to.be(204);
      expect(body).to.eql(undefined);
      done();
    });
  });

  it("should set req.user on valid tokens", function(done) {
    req('GET', 'abcd', function(error, response, body) {
      expect(response.statusCode).to.be(200);
      expect(JSON.parse(body)).to.eql({name: 'foo'});
      done();
    });
  });

  it("should set req.user to null on invalid tokens", function(done) {
    req('GET', 'invalid', function(error, response, body) {
      expect(response.statusCode).to.be(200);
      expect(body).to.eql('null');
      done();
    });
  });

  it("should respond w/ 500 on getTokenInfo() failure", function(done) {
    req('GET', 'error', function(error, response, body) {
      expect(response.statusCode).to.be(500);
      expect(body).to.eql('unable to get access token info');
      done();
    });
  });
});
