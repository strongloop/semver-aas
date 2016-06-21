// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: semver-aas
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

var semver = require('semver');
var url = require('url');

module.exports = handler;

return;

function handler(req, res) {
  var r = url.parse(req.url, true);
  var v = r.pathname.slice(1);
  if (r.query.v) {
    multi([v].concat(r.query.v), r.query.q, res);
  } else {
    single(v, r.query.q, res);
  }
}

function single(v, r, res) {
  var valid = semver.parse(v);
  var range = semver.validRange(r);
  if (!valid) {
    res.statusCode = 400;
    res.statusMessage = 'Invalid version';
  } else if (r && !range) {
    res.statusCode = 400;
    res.statusMessage = 'Invalid range';
  } else if (r && !semver.satisfies(valid, range)) {
    res.statusCode = 404;
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(valid.version));
  }
  res.end();
}

function multi(v, r, res) {
  var valid = v.map(semver.valid).filter(identity);
  var range = semver.validRange(r);
  if (r && !range) {
    res.statusCode = 400;
    res.statusMessage = 'Invalid range';
  } else if (!r) {
    // no range given, just return all the valid version that were given
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(valid));
  } else {
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify(valid.filter(function satisfies(v) {
      return semver.satisfies(v, range);
    })));
  }
  res.end();
}

function identity(x) {
  return x;
}
