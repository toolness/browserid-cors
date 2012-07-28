var expect = require('expect.js');

describe('BrowserIDCORS', function() {
  var BrowserIDCORS = require('../');

  it("should expose handleTokenRequest handler", function() {
    var bic = BrowserIDCORS();
    expect(bic.handleTokenRequest).to.be.a('function');
  });

  it("should expose accessToken middleware", function() {
    var bic = BrowserIDCORS();
    expect(bic.accessToken).to.be.a('function');
  });

  it("should expose requireAccessToken middleware", function() {
    var bic = BrowserIDCORS();
    expect(bic.requireAccessToken).to.be.a('function');
  });
  
  it("should expose fullCORS middleware", function(done) {
    var bic = BrowserIDCORS();
    var headers = {};
    bic.fullCORS(null, {
      header: function(name, value) {
        headers[name] = value;
      }
    }, function next() {
      expect(headers).to.eql({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
        'Access-Control-Allow-Headers': 'Content-Type,X-Access-Token'
      });
      done();
    });
  });
  
  it("should provide access to tokenStorage", function() {
    var bic = BrowserIDCORS();
    expect(bic.tokenStorage).to.be.an('object');
  });
});
