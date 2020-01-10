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
        'after:release': 'git push --tags git@github.com:Airtable/blocks.git master',
        'before:npm:release': 'cp .gitignore __gitignore',
        'after:npm:release': 'rm __gitignore',
    },
    npm: {
        access: 'restricted',
    },
};

console.log(`Running release-it in ${process.cwd()} with config:`, config);
module.exports = config;
