var crypto = require('crypto');

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
                 "abcdefghijklmnopqrstuvwxyz" +
                 "0123456789";

exports.generateRandomString = function(length, cb) {
  crypto.randomBytes(length, function(err, buf) {
    var chars = [];
    if (err) return cb(err);
    for (var i = 0; i < buf.length; i++)
      chars.push(ALPHABET[buf[i] % ALPHABET.length]);
    cb(null, chars.join(''));
  });
};

exports.findUniqueRandomString = function(length, isUniqueFunc) {
  function retry() {
    exports.generateRandomString(length, function(err, string) {
      if (err)
        isUniqueFunc(null);
      else {
        isUniqueFunc(string, retry);
      }
    });
  }
  
  retry();
};
