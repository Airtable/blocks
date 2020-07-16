// @flow
const path = require('path');
const fsUtils = require('./fs_utils');
const {createWriteStream} = require('fs');
const {npmAsync} = require('./node_modules_command_helpers');
const {Octokit} = require('@octokit/rest');
const request = require('postman-request');
const tar = require('tar');

const TMP_DIRECTORY_NAME = 'tmp';
const TARBALL_FILE_NAME = 'template.tar.gz';

async function downloadTemplateAsync(blockDirPath: string, template: string): Promise<string> {
    const tmpDirPath = path.join(blockDirPath, TMP_DIRECTORY_NAME);
    const tarballPath = path.join(blockDirPath, TARBALL_FILE_NAME);
    const writeStream = createWriteStream(tarballPath, {encoding: null});
    await fsUtils.mkdirAsync(tmpDirPath);

    let downloadUrl;
    const octokit = new Octokit({});
    const pathComponents = new URL(template).pathname.split('/');
    const owner = pathComponents[1];
    const repo = pathComponents[2];
    try {
        const {url} = await octokit.repos.downloadArchive({owner, repo, archive_format: 'tarball'});
        downloadUrl = url;
    } catch (e) {
        if (e.status === 404) {
            e.message = `Template ${template} is not a public repo that could be found on Github`;
        }
        throw e;
    }

    await new Promise((resolve, reject) => {
        request(downloadUrl)
            .pipe(writeStream)
            .on('finish', resolve)
            .on('error', reject);
    });

    await tar.extract({file: tarballPath, gzip: true, cwd: tmpDirPath});
    await fsUtils.unlinkAsync(tarballPath);
    const files = await fsUtils.readDirAsync(tmpDirPath, {withFileTypes: true, encoding: 'utf8'});
    const templateDir = files.find(dirent => dirent.isDirectory());
    return path.join(tmpDirPath, templateDir.name);
}

async function cleanUpDownloadedTemplateAsync(blockDirPath: string): Promise<void> {
    await fsUtils.removeAsync(path.join(blockDirPath, TMP_DIRECTORY_NAME));
}

async function installBlockDependenciesAsync(blockDirPath: string): Promise<void> {
    await npmAsync(blockDirPath, ['install', '--loglevel=error']);
}

const initCommandHelpers = {
    downloadTemplateAsync,
    cleanUpDownloadedTemplateAsync,
    installBlockDependenciesAsync,
};

module.exports = initCommandHelpers;
