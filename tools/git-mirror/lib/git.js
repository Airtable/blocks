const path = require('path');
const runCommandAsync = require('./runCommandAsync');

async function runGitAsync(cwd, ...args) {
    const {stdout} = await runCommandAsync('git', args, {cwd});
    return stdout.replace(/\n$/, '');
}

function lastLine(str) {
    const lines = str.split('\n');
    return lines[lines.length - 1];
}

module.exports = {
    async getTopLevelAsync(cwd) {
        return runGitAsync(cwd, 'rev-parse', '--show-toplevel');
    },
    async initAsync(cwd) {
        await runGitAsync(cwd, 'init', '.');
    },
    async lsFilesAsync(cwd) {
        const filePaths = await runGitAsync(cwd, 'ls-files');
        return filePaths.split('\n');
    },
    async cloneAsync(source, destinationPath) {
        await runGitAsync(
            path.dirname(destinationPath),
            'clone',
            source,
            path.basename(destinationPath),
        );
    },
    async listTagsAsync(cwd) {
        const tags = await runGitAsync(cwd, 'tag');
        return tags.split('\n');
    },
    async getTagInfoAsync(cwd, tagName) {
        const hash = await runGitAsync(cwd, 'rev-parse', tagName);
        const date = await runGitAsync(cwd, 'show', '--no-patch', '--format=%aI', hash);

        return {
            name: tagName,
            hash,
            date: new Date(lastLine(date)),
        };
    },
    async checkoutAsync(cwd, commit) {
        await runGitAsync(cwd, 'checkout', commit);
    },
    async checkoutHardAsync(cwd, commit) {
        await this.checkoutAsync(cwd, commit);
        await runGitAsync(cwd, 'add', '-A');
        await runGitAsync(cwd, 'reset', '--hard');
    },
    async commitAndTagAsync(cwd, name, authorName, authorEmail, date) {
        await runGitAsync(cwd, 'add', '-A');
        await runGitAsync(
            cwd,
            'commit',
            '--no-verify',
            '--allow-empty',
            '-m',
            name,
            '--author',
            `${authorName} <${authorEmail}>`,
            '--date',
            date.toJSON(),
        );
        await runGitAsync(cwd, 'tag', name);
    },
    async pushAsync(cwd) {
        await runGitAsync(cwd, 'push', '--tags', 'origin', 'master');
    },
};
