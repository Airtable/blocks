const {dirname} = require('path');
require('@oclif/config/lib/ts-node').tsPath(dirname(__dirname), './lib/commands');
