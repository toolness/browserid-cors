var expect = require('expect.js'),
    LocalTokenStorage = require('../lib/local-token-storage.js');

describe("LocalTokenStorage", function() {
  it("should create tokens", function(done) {
    var lts = LocalTokenStorage({tokenLength: 12});
    lts.createToken({blah: 1}, function(err, token) {
      expect(err).to.be(null);
      expect(token).to.have.length(12);
      done();
    });
  });
  
  it("should return null info for nonexistent tokens", function(done) {
    var lts = LocalTokenStorage();
    lts.getTokenInfo("blah", function(err, info) {
      expect(err).to.be(null);
      expect(info).to.be(null);
      done();
    });
  });
  
  it("should retrieve info for valid tokens", function(done) {
    var lts = LocalTokenStorage();
    lts.createToken({blah: 1}, function(err, token) {
      lts.getTokenInfo(token, function(err, info) {
        expect(err).to.be(null);
        expect(info).to.eql({blah: 1});
        done();
      });
    });
  });
});
