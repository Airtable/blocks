const fs = require('fs');
const path = require('path');

const dirsToInclude = ['src', 'types'];

const dirsToExclude = fs
    .readdirSync(__dirname)
    .filter(fileName => !dirsToInclude.includes(fileName))
    .filter(fileName => fs.statSync(fileName).isDirectory())
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
