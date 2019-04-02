const fs = require('fs');
const promisify = require('es6-promisify');
const path = require('path');

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
    mkdirIfDoesntAlreadyExistAsync: async function(dirPath) {
        try {
            await this.mkdirAsync(dirPath);
        } catch (err) {
            // Throw if we get any error other than that dirPath already exists.
            if (err.code !== 'EEXIST') {
                throw err;
            }
        }
    },
    mkdirPathAsync: async function(dirPath) {
        try {
            // Try to make a directory for the given path.
            await this.mkdirIfDoesntAlreadyExistAsync(dirPath);
        } catch (err) {
            if (err.code !== 'ENOENT') {
                throw err;
            }

            // Couldn't make a directory for the given path because previous path
            // components don't exist yet.
            // Start by recursively trying to make the path one level up.
            await this.mkdirPathAsync(path.dirname(dirPath));

            // Now we can try making the original dirPath (since previous components
            // have already been made at this point).
            await this.mkdirIfDoesntAlreadyExistAsync(dirPath);
        }
    },
    readDirAsync: promisify(fs.readdir),
    readDirIfExistsAsync: function(dirPath) {
        return this.readDirAsync(dirPath).catch(err => {
            if (err.code === 'ENOENT') {
                return null;
            }
            // Unknown error, so throw it.
            throw err;
        });
    },
    copyFileAsync: async function(sourceFile, targetFile) {
        const contents = await this.readFileAsync(sourceFile);
        await this.writeFileAsync(targetFile, contents);
    },
    symlinkAsync: promisify(fs.symlink),
    symlinkIfNeededAsync: function(target, filePath) {
        this.symlinkAsync(target, filePath).catch(err => {
            // Throw if we get any error other than that the symlink already exists.
            if (err.code !== 'EEXIST') {
                throw err;
            }
        });
    },
    statAsync: promisify(fs.stat),
    statIfExistsAsync: function(filePath) {
        return this.statAsync(filePath).catch(err => {
            if (err.code === 'ENOENT') {
                return null;
            }
            // Throw if we get any error other than that the file doesn't exist.
            throw err;
        });
    },
    renameAsync: promisify(fs.rename),
};
