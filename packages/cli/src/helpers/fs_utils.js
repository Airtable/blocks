// @flow
const fs = require('fs');
const fsExtra = require('fs-extra');
const {promisify} = require('util');
const path = require('path');

module.exports = {
    readFileAsync: promisify(fs.readFile),
    readFileIfExistsAsync: async function(
        filepath: string | Buffer | URL | number,
        optionsOrEncoding?: {encoding?: string | null, flag?: string} | string,
    ): Promise<string | Buffer | null> {
        try {
            return await this.readFileAsync(filepath, optionsOrEncoding);
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
    mkdirIfDoesntAlreadyExistAsync: async function(dirPath: string | Buffer | URL): Promise<void> {
        try {
            await this.mkdirAsync(dirPath);
        } catch (err) {
            // Throw if we get any error other than that dirPath already exists.
            if (err.code !== 'EEXIST') {
                throw err;
            }
        }
    },
    mkdirPathAsync: async function(dirPath: string): Promise<void> {
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
    mkdirPathSync: function(dirPath: string): void {
        fsExtra.ensureDirSync(dirPath);
    },
    readDirAsync: promisify(fs.readdir),
    readDirIfExistsAsync: async function(
        dirPath: string | Buffer | URL,
    ): Promise<Array<string> | Array<Buffer> | null> {
        try {
            return await this.readDirAsync(dirPath);
        } catch (err) {
            if (err.code === 'ENOENT') {
                return null;
            }
            // Unknown error, so throw it.
            throw err;
        }
    },
    copyFileAsync: async function(
        sourceFile: string | Buffer | URL | number,
        targetFile: string | Buffer | URL | number,
    ): Promise<void> {
        const contents = await this.readFileAsync(sourceFile);
        await this.writeFileAsync(targetFile, contents);
    },
    /**
     * Like cp -r
     */
    copyAsync: async function(fromPath: string, toPath: string): Promise<void> {
        await fsExtra.copy(fromPath, toPath);
    },
    /**
     * The node docs state that the `type` parameter is only used for Windows; it's ignored on other
     * platforms (see: https://nodejs.org/api/fs.html#fs_fs_symlink_target_path_type_callback).
     * Therefore, we always pass it in.
     *
     * In Windows 10, it seems you have to run the process as an Administrator for fs.symlink to
     * work properly. However, it might not be desirable to require the end-user to always run
     * as an Administrator. As a workaround, passing in type='junction' seems to bypass requiring
     * the Administrator role.
     * src: https://github.com/nodejs/node/issues/18518#issuecomment-513866491
     */
    symlinkAsync: async function(
        target: string | Buffer | URL,
        fileOrDirPath: string | Buffer | URL,
        type?: string = 'junction',
    ): Promise<void> {
        const promisifiedFsSymlink = promisify(fs.symlink);

        return await promisifiedFsSymlink(target, fileOrDirPath, type);
    },
    symlinkIfNeededAsync: async function(
        target: string | Buffer | URL,
        filePath: string | Buffer | URL,
    ): Promise<void> {
        try {
            await this.symlinkAsync(target, filePath);
        } catch (err) {
            // Throw if we get any error other than that the symlink already exists.
            if (err.code !== 'EEXIST') {
                throw err;
            }
        }
    },
    statAsync: promisify(fs.stat),
    statIfExistsAsync: async function(filePath: string | Buffer | URL): Promise<fs.Stats | null> {
        try {
            return await this.statAsync(filePath);
        } catch (err) {
            if (err.code === 'ENOENT') {
                return null;
            }
            // Throw if we get any error other than that the file doesn't exist.
            throw err;
        }
    },
    existsAsync: async function(filePath: string | Buffer | URL): Promise<boolean> {
        const statIfExists = await this.statIfExistsAsync(filePath);

        return statIfExists !== null;
    },
    renameAsync: promisify(fs.rename),
    unlinkAsync: promisify(fs.unlink),
    removeAsync: async function(filePath: string): Promise<void> {
        return await fsExtra.remove(filePath);
    },
    emptyDirAsync: async function(dirPath: string): Promise<void> {
        await fsExtra.emptyDir(dirPath);
    },
    readJsonIfExistsAsync: async function(filePath: string): Promise<mixed | null> {
        try {
            return await fsExtra.readJson(filePath);
        } catch (err) {
            if (err.code === 'ENOENT') {
                return null;
            }
            // Throw if we get any error other than that the file doesn't exist.
            throw err;
        }
    },
    outputJsonAsync: async function(filePath: string, content: mixed): Promise<void> {
        await fsExtra.outputJson(filePath, content, {spaces: 4});
    },
};
