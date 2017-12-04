const fs = require('fs');
const promisify = require('es6-promisify');

const readDirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);

module.exports = {
    readDirIfExistsAsync: function(path) {
        return statAsync(path).then(() => {
            return readDirAsync(path);
        }).catch(err => {
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
