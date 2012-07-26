var expect = require('expect.js'),
    request = require('request'),
    express = require('express'),
    TokenMiddleware = require('../token-middleware');

describe("TokenMiddleware", function() {
  function req(method, accessToken, cb) {
    var server = express.createServer();
    server.use(express.bodyParser());
    server.use(TokenMiddleware({
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
          }
        }, finishReq);
      }
    });
  }

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
