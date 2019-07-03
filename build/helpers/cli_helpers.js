"use strict"; /* eslint-disable no-console */
var prompt = require('prompt');
var promisify = require('es6-promisify');

var helpers = {
  promptAsync: promisify(prompt.get),
  exitWithError: function exitWithError(message, err) {
    console.error('Error:', message);
    if (err) {
      console.error(err.stack);
    }
    process.exit(1);
  } };


module.exports = helpers;