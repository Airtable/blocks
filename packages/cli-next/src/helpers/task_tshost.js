const {dirname} = require('path');

const debug = require('debug')('block-cli:task:tshost');

try {
    require('ts-node').register({
        dir: dirname(dirname(__dirname)),
        transpileOnly: true,
    });
} catch (err) {
    debug('ts-node unavailable, skipping.');
}

require('./task_host');
