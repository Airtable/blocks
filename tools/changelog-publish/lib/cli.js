// @flow
const fs = require('fs');
const yargs = require('yargs');
const changelogPublish = require('./changelogPublish');

const args = yargs.options({
    'git-tag-prefix': {
        demandOption: true,
    },
    'github-repo-url': {
        demandOption: true,
    },
}).argv;

const changelogContents = fs.readFileSync('CHANGELOG.md', 'utf-8');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
const packageVersion = packageJson.version;

const publishResult = changelogPublish(changelogContents, {
    version: packageVersion,
    date: new Date(),
    githubRepoUrl: args['git-tag-prefix'],
    gitTagPrefix: args['github-repo-url'],
});

if (publishResult.isValid) {
    fs.writeFileSync('CHANGELOG.md', publishResult.changelog, 'utf-8');
    console.log(`CHANGELOG.md: moved unreleased to ${packageVersion}`);
} else {
    console.error(`CHANGELOG.md error: ${publishResult.message}`);
}
