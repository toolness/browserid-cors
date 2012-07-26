var expect = require('expect.js'),
    request = require('request'),
    app = require('../app');

function req(options, cb) {
  if (!cb) {
    cb = options;
    options = {
      headers: {
        'Origin': 'http://foo.com'
      },
      form: {
        assertion: 'blah'
      }
    };
  }
  app.listen(4320, function() {
    request({
      method: 'POST',
      headers: options.headers,
      form: options.form,
      url: 'http://127.0.0.1:4320/auth'
    }, function(error, response, body) {
      app.close();
      cb(error, response, body);
    });
  });
}

function setVerify(verify) {
  app.verify = function(audience, assertion, cb) {
    expect(audience).to.be('http://foo.com');
    expect(assertion).to.be('blah');
    setTimeout(function() { verify(cb); }, 1);
  };
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
  
  it('should support CORS', function(done) {
    setVerify(function(cb) { cb(null, 'blah@blah.com'); });
    req(function(error, response, body) {
      expect(response.headers['access-control-allow-origin']).to.be('*');
      done();
    });
  });
  
  it('should return 200 with a valid assertion', function(done) {
    setVerify(function(cb) { cb(null, 'blah@blah.com'); });
    req(function(error, response, body) {
      expect(response.statusCode).to.be(200);
      expect(JSON.parse(body)).to.eql({
        email: 'blah@blah.com'
      });
      done();
    });
  });
  
  it('should return 400 with a bad assertion', function(done) {
    setVerify(function(cb) { cb('fail'); });
    req(function(error, response, body) {
      expect(response.statusCode).to.be(400);
      expect(body).to.be('fail');
      done();
    });
  });
});
