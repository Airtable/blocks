// @flow
const path = require('path');
const fsUtils = require('./fs_utils');
const {npmAsync} = require('./node_modules_command_helpers');
const NodeGit = require('nodegit');

const TMP_DIRECTORY_NAME = 'tmp';
const cloneOptions = {
    fetchOpts: {
        callbacks: {
            // > Unfortunately in OS X there is a problem where libgit2 is
            // > unable to look up GitHub certificates correctly. In order to
            // > bypass this problem, we’re going to passthrough the certificate
            // > check.
            // >
            // > Note: this is not a problem with Windows or Linux
            //
            // https://github.com/nodegit/nodegit/tree/8a59c1cbedf8f70404ebc923f9d212052a4205ca/guides/cloning#github-certificate-issue-in-os-x
            certificateCheck() {
                return 0;
            },
            credentials(url, userName) {
                return NodeGit.Cred.sshKeyFromAgent(userName);
            },
        },
    },
};

async function downloadTemplateAsync(blockDirPath: string, template: string): Promise<string> {
    const destination = path.join(blockDirPath, TMP_DIRECTORY_NAME);

    await NodeGit.Clone(template, destination, cloneOptions);

    // We remove the .git directory since users might find the git history confusing especially
    // since we make some uncommitted changes and the git remote isn't one they can push to.
    await fsUtils.removeAsync(path.join(blockDirPath, TMP_DIRECTORY_NAME, '.git'));
    // Maybe add a flag to handle blocks that aren't at the top level of the repo?
    return destination;
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
