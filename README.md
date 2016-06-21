semver-aas - SemVer as a Service
================================

Thin http wrapper around semver.satisfies() for when you have curl but not node.

# Usage

Server:
```
$ git clone ...
$ npm install --production
$ npm start
...
```

Client:
```
$ curl 'localhost:3000/1.2.3'
"1.2.3"
$ curl 'localhost:3000?v1.2.3&v=2.3.4&q=^1.0'
["1.2.3"]
$ curl --fail 'localhost:3000/1.2.3.4' || echo 'invalid'
invalid
```
