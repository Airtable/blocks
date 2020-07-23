// @flow
/* eslint-disable no-console */

const helpers = {
    exitWithError(message: string, err?: Error): void {
        console.error(`
❌ Error: ${message}`);
        if (err) {
            console.error(err.stack);
        }
        process.exit(1);
    },
};

module.exports = helpers;
