const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

const packageName = packageJson.name;

const config = {
    git: {
        tagName: `${packageName}@\${version}`,
        commitMessage: `Release ${packageName}@\${version}`,
    },
    hooks: {
        'before:init': '../../bin/check-repo-for-release && yarn lint',
        'after:release': `../../tools/git-mirror/bin/git-mirror sync ${packageName}@\${version}`,
    },
    npm: {
        publish: 'false',
    },
};

console.log(`Running release-it in ${process.cwd()} with config:`, config);
module.exports = config;
