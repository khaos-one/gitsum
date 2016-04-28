#!/usr/bin/env node

const intel = require('intel');
const app = require('./app');

app.set('port', process.env.PORT || 8082);

const server = app.listen(app.get('port'), function () {
  const address = server.address();
  intel.info('Server started listening on ' + address.host + ':' + address.port);
});
