/* eslint-disable no-console */
const {promisify} = require('util');

const helpers = {
    exitWithError(message, err) {
        console.error('Error:', message);
        if (err) {
            console.error(err.stack);
        }
        process.exit(1);
    },
};

module.exports = helpers;
