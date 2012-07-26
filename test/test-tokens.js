var expect = require('expect.js'),
    tokens = require('../tokens');

describe("tokens.generateRandomString()", function() {
  it("should return a string w/ random characters", function(done) {
    tokens.generateRandomString(8, function(err, string) {
      expect(err).to.be(null);
      expect(string).to.have.length(8);
      expect(string).to.match(/^([A-Za-z0-9])+$/);
      done();
    });
  });
});

describe("tokens.findUniqueRandomString()", function() {
  it("should call its callback w/ a random string", function(done) {
    tokens.findUniqueRandomString(8, function(string, retry) {
      expect(string).to.have.length(8);
      done();
    });
  });
  
  it("should retry if necessary", function(done) {
    var strings = [];
    tokens.findUniqueRandomString(8, function(string, retry) {
      expect(string).to.have.length(8);
      strings.forEach(function(otherString) {
        expect(string).to.not.eql(otherString);
      });
      strings.push(string);
      if (strings.length == 3)
        done();
      else
        setTimeout(retry, 1);
    });
  });
});
