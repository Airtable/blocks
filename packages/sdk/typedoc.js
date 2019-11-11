const fs = require('fs');
const path = require('path');
const pkg = require('./package.json');

const dirsToInclude = ['src', 'types'];

const dirsToExclude = fs
    .readdirSync(__dirname)
    .filter(fileName => fs.statSync(fileName).isDirectory())
    .filter(dirName => !dirsToInclude.includes(dirName))
    .map(dirName => `./${dirName}/**`);

const releaseTag = `@airtable/blocks@${pkg.version}`;

module.exports = {
    out: './docs/api',
    mode: 'modules',
    includeDeclarations: true,
    excludePrivate: true,
    excludeProtected: true,
    exclude: [...dirsToExclude, '**/node_modules/**', './*.js'],
    readme: './src/api-readme.md',
    theme: path.join(__dirname, './doc-generator/lib/theme'),
    'sourcefile-url-prefix': `https://github.com/airtable/blocks/blob/${releaseTag}/packages/sdk/`,
};
