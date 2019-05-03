// @flow
import getSdk from './get_sdk';

// we need to use module.exports syntax here because we want people to be able to do destructuring
// imports. Usually, this isn't possible when exporting a class with ESM - it's a quirk of how
// babel handles inter-op between commonjs and es modules.
// TODO: use direct es exports rather than an SDK instance
module.exports = getSdk();
