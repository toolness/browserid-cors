[![Build Status](https://secure.travis-ci.org/toolness/browserid-cors.png?branch=master)](http://travis-ci.org/toolness/browserid-cors)

This node module contains Express middleware for creating 
BrowserID-authenticated, CORS-enabled REST APIs.

The idea is that a static web page on any domain can send a BrowserID
assertion to any number of CORS REST endpoints and receive a token back,
which can be used for further authenticated access. The endpoints keep
track not only of the email address of the user, but also the origin
(e.g. `http://foo.com`) that is mediating interactions between the user
and the endpoint.

For illustration, here's an example of a front-end at mysite.org
communicating with two unrelated APIs at comments.org and
favorites.org to provide backing services for the application:

<img src="http://u.toolness.org/qidya">

This software is still in an embryonic state. Use at your own risk.

For an example of this middleware in use, see [git-browserid-cors][].

## Quick Start

    git clone git://github.com/toolness/browserid-cors.git
    cd browserid-cors
    npm install
    npm test

  [git-browserid-cors]: https://github.com/toolness/git-browserid-cors
