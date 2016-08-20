// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: semver-aas
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

'use strict';

var handler = require('./');
var http = require('http');

var PORT = 'PORT' in process.env ? process.env.PORT : '3000';

http.createServer(handler).listen(PORT, function() {
  var addr = this.address();
  console.log('Listening: http://%s:%d/', addr.address, addr.port);
});
