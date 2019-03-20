const fs = require('fs');
const promisify = require('es6-promisify');

module.exports = {
    readFileAsync: promisify(fs.readFile),
    readFileIfExistsAsync: async function(path) {
        try {
            return await this.readFileAsync(path);
        } catch (err) {
            if (err.code === 'ENOENT') {
                return null;
            }
            // Unknown error, so throw it.
            throw err;
        }
    },
    writeFileAsync: promisify(fs.writeFile),
    mkdirAsync: promisify(fs.mkdir),
    mkdirIfDoesntAlreadyExistAsync: function(dirPath) {
        this.mkdirAsync(dirPath).catch(err => {
            // Throw if we get any error other than that dirPath already exists.
            if (err.code !== 'EEXIST') {
                throw err;
            }
        });
    },
    readDirAsync: promisify(fs.readdir),
    readDirIfExistsAsync: function(path) {
        return this.readDirAsync(path).catch(err => {
            if (err.code === 'ENOENT') {
                return null;
            }
            // Unknown error, so throw it.
            throw err;
        });
    },
    copyFileSync: function copyFileSync(sourceFile, targetFile) {
        const contents = fs.readFileSync(sourceFile);
        fs.writeFileSync(targetFile, contents);
    },
    symlinkAsync: promisify(fs.symlink),
    symlinkIfNeededAsync: function(target, path) {
        this.symlinkAsync(target, path).catch(err => {
            // Throw if we get any error other than that the symlink already exists.
            if (err.code !== 'EEXIST') {
                throw err;
            }
        });
    },
    statAsync: promisify(fs.stat),
    statIfExistsAsync: function(path) {
        return this.statAsync(path).catch(err => {
            if (err.code === 'ENOENT') {
                return null;
            }
            // Throw if we get any error other than that the file doesn't exist.
            throw err;
        });
    },
    renameAsync: promisify(fs.rename),
};
