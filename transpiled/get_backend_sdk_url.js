"use strict";
var Environments = require('./types/environments');



function getBackendSdkUrl(environment) {
  var baseUrl;
  switch (environment) {
    case Environments.PRODUCTION:
      // NOTE: this should probably download from the cdn, but we can't do that
      // right now, since the cdn url contains the hyperbase code version. In
      // the future, we should add a public endpoint to fetch the cdn url, so
      // we could hit that endpoint and then download the sdk from the cdn.
      baseUrl = 'https://airtable.com/js/compiled';
      break;
    case Environments.STAGING:
      // NOTE: see comment above.
      baseUrl = 'https://staging.airtable.com/js/compiled';
      break;
    case Environments.LOCAL:
      baseUrl = 'https://hyperbasedev.com:3000/js/build';
      break;
    default:
      throw new Error("Unrecognized environment: ".concat(environment));}

  var sdkUrl = "".concat(baseUrl, "/block_backend_sdk.js");
  return sdkUrl;
}

module.exports = getBackendSdkUrl;