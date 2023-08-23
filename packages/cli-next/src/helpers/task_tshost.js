const {dirname} = require('path');

const debug = require('debug')('block-cli:task:tshost');

try {
    require('ts-node').register({
        dir: dirname(dirname(__dirname)),
        scope: true,
        transpileOnly: true,
    });
    require('ts-node').register({
        transpileOnly: true,
    });
} catch (err) {
    debug('ts-node unavailable, skipping.');
}

require('./task_host');
