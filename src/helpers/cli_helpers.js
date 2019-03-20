const prompt = require('prompt');
const promisify = require('es6-promisify');

const helpers = {
    promptAsync: promisify(prompt.get),
    exitWithError(message, err) {
        console.error('Error:', message);
        if (err) {
            console.error(err.stack);
        }
        process.exit(1);
    },
};

module.exports = helpers;
