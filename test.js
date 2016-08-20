// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: semver-aas
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

var handler = require('./');
var test = require('tap').test;
var request = require('supertest');

test('single (validation)', function(t) {
  t.plan(4);

  request(handler).get('/1.2.3')
    .expect('Content-Type', /json/)
    .expect(200, JSON.stringify('1.2.3'))
    .end(t.ifErr);

  request(handler).get('/1.2')
    .expect(400)
    .end(t.ifErr);

  // 1.x is a valid semver range, not version
  request(handler).get('/1.x')
    .expect(400)
    .end(t.ifErr);

  request(handler).get('/1.2.3.4')
    .expect(400)
    .end(t.ifErr);
});

test('single (range query)', function(t) {
  t.plan(9);

  request(handler).get('/1.2.3?q=1')
    .expect('Content-Type', /json/)
    .expect(200, JSON.stringify('1.2.3'))
    .end(t.ifErr);

  // valid range and version, just not a match
  request(handler).get('/1.2.3?q=2')
    .expect(404)
    .end(t.ifErr);

  // bad range
  request(handler).get('/1.2.3?q=inv')
    .expect(400)
    .end(t.ifErr);

  request(handler).get('/1.2.3?q=1.2.3')
    .expect('Content-Type', /json/)
    .expect(200, JSON.stringify('1.2.3'))
    .end(t.ifErr);

  request(handler).get('/1.2.3', {q: '1 || 2 || 4.3.2'})
    .expect('Content-Type', /json/)
    .expect(200, JSON.stringify('1.2.3'))
    .end(t.ifErr);

  request(handler).get('/1.2.3?q=^1')
    .expect('Content-Type', /json/)
    .expect(200, JSON.stringify('1.2.3'))
    .end(t.ifErr);

  request(handler).get('/1.2?q=1')
    .expect(400)
    .end(t.ifErr);

  // 1.x is a valid semver range, not version
  request(handler).get('/1.x?q=1')
    .expect(400)
    .end(t.ifErr);

  request(handler).get('/1.2.3.4?q=1')
    .expect(400)
    .end(t.ifErr);
});

test('multi (validation)', function(t) {
  t.plan(3);

  request(handler).get('/?v=1.2.3')
    .expect('Content-Type', /json/)
    .expect(200, ['1.2.3'])
    .end(t.ifErr);

  request(handler).get('/?v=1.2.3&v=1.2.4&v=1.2.5')
    .expect('Content-Type', /json/)
    .expect(200, ['1.2.3', '1.2.4', '1.2.5'])
    .end(t.ifErr);

  request(handler).get('/?v=1&v=1.2&v=1.2.3')
    .expect('Content-Type', /json/)
    .expect(200, ['1.2.3'])
    .end(t.ifErr);
});

test('multi (range query)', function(t) {
  t.plan(4);

  request(handler).get('/?v=1.2.3&q=v')
    .expect(400)
    .end(t.ifErr);

  request(handler).get('/?v=1.2.3&q=1.2.3')
    .expect('Content-Type', /json/)
    .expect(200, ['1.2.3'])
    .end(t.ifErr);

  request(handler).get('/?v=1.2.3&v=1.2.4&v=1.2.5&q=1.2')
    .expect('Content-Type', /json/)
    .expect(200, ['1.2.3', '1.2.4', '1.2.5'])
    .end(t.ifErr);

  request(handler).get('/?v=1&v=1.2&v=1.2.3&q=^1')
    .expect('Content-Type', /json/)
    .expect(200, ['1.2.3'])
    .end(t.ifErr);
});
