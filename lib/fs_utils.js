const fs = require('fs');
const promisify = require('es6-promisify');

const readDirAsync = promisify(fs.readdir);

module.exports = {
    readDirIfExistsAsync: function(path) {
        return readDirAsync(path).catch(err => {
            if (err.code === 'ENOENT') {
                return null;
            }
            // Unknown error, so throw it
            throw err;
        });
    },
    readFileAsync: promisify(fs.readFile),
    writeFileAsync: promisify(fs.writeFile),
    mkdirAsync: promisify(fs.mkdir),
};
