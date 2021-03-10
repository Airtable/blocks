const fs = require('fs');
const path = require('path');

const dirsToInclude = ['src', 'types'];

const dirsToExclude = fs
    .readdirSync(__dirname)
    .filter(fileName => fs.statSync(fileName).isDirectory())
    .filter(dirName => !dirsToInclude.includes(dirName))
    .map(dirName => `./${dirName}/**`);

module.exports = {
    mode: 'modules',
    includeDeclarations: true,
    excludePrivate: true,
    excludeProtected: true,
    exclude: [...dirsToExclude, '**/node_modules/**', './*.js'],
    readme: './src/api-readme.md',
    'src-dir-path': path.resolve('./src'),
};
