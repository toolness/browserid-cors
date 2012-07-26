var expect = require('expect.js'),
    request = require('request'),
    express = require('express'),
    auth = require('../auth');

var TEST_PORT = 4320;

function req(options, cb) {
  var app = express.createServer();
  app.use(express.bodyParser());
  app.post('/auth', auth.handler({
    verify: function(audience, assertion, cb) {
      var verify = options.verify || function(cb) {
        cb(null, 'blah@blah.com');
      };
      expect(audience).to.be('http://foo.com');
      expect(assertion).to.be('blah');
      setTimeout(function() { verify(cb); }, 1);
    },
    createToken: function(info, cb) {
      expect(info).to.eql({
        email: 'blah@blah.com',
        origin: 'http://foo.com'
      });
      cb(options.createTokenError || null, "abcd");
    }
  }));
  app.listen(TEST_PORT, function() {
    request({
      method: 'POST',
      headers: options.headers || {'Origin': 'http://foo.com'},
      form: options.form || {assertion: 'blah'},
      url: 'http://127.0.0.1:' + TEST_PORT + '/auth'
    }, function(error, response, body) {
      app.close();
      cb(error, response, body);
    });
  });
}

describe('POST /auth', function(done) {
  it('should fail if origin is not provided', function(done) {
    req({
      headers: {},
      form: {assertion: 'blah'}
    }, function(error, response, body) {
      expect(response.statusCode).to.be(400);
      expect(body).to.be('origin header required');
      done();
    });
  });

  it('should fail if assertion is not provided', function(done) {
    req({
      headers: {'Origin': 'http://foo.com'},
      form: {}
    }, function(error, response, body) {
      expect(response.statusCode).to.be(400);
      expect(body).to.be('assertion required');
      done();
    });
  });
  
  it('should return 500 if token creation fails', function(done) {
    req({createTokenError: true}, function(error, response, body) {
      expect(response.statusCode).to.be(500);
      expect(body).to.be('unable to generate token');
      done();
    });
  });
  
  it('should support CORS', function(done) {
    req({}, function(error, response, body) {
      expect(response.headers['access-control-allow-origin']).to.be('*');
      done();
    });
  });
  
  it('should return 200 with a valid assertion', function(done) {
    req({}, function(error, response, body) {
      expect(response.statusCode).to.be(200);
      expect(JSON.parse(body)).to.eql({
        email: 'blah@blah.com',
        accessToken: 'abcd'
      });
      done();
    });
  });
  
  it('should return 400 with a bad assertion', function(done) {
    req({
      verify: function(cb) { cb('fail'); }
    }, function(error, response, body) {
      expect(response.statusCode).to.be(400);
      expect(body).to.be('fail');
      done();
    });
  });
});
