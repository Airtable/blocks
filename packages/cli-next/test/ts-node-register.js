// The source in this test directly is mostly typescript. Normally you might add
// `--register ts-node/register` to mocha options or the commands in
// package.json. Doing so though creates an issue when oclif initializes its
// typescript support. This issue will cause the line coverage reporting to not
// align with the original ts files in src. This is because the files are being
// compiled once, first by the registered oclif support, and secondly by the
// ts-node/register registration. This causes the transpiled source istanbul
// receives to have a sourcemap containing the output of the first completion
// instead of the original source.
//
// To resolve this, trigger oclif's typescript support from the beginning. When
// oclif would normally try to add its support it'll shortcut because we have
// already done that here.
const {dirname} = require('path');
require('@oclif/config/lib/ts-node').tsPath(dirname(__dirname), './lib/commands');
