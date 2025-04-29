const fs = require('fs');
const path = require('path');

const packagesDir = path.resolve(__dirname, '..');
const sdkDir = path.resolve(__dirname, '..', 'sdk');
const testingDir = path.resolve(__dirname, '..', 'blocks-testing');

const makeExclusions = (directory, exceptions) => {
    return fs
        .readdirSync(directory)
        .filter(fileName => !exceptions.includes(fileName))
        .map(fileName => path.resolve(directory, fileName))
        .map(fileName => {
            return fs.statSync(fileName).isDirectory() ? path.join(fileName, '**') : fileName;
        });
};

module.exports = {
    mode: 'modules',
    includeDeclarations: true,
    excludePrivate: true,
    excludeProtected: true,
    exclude: [
        ...makeExclusions(packagesDir, ['sdk', 'blocks-testing']),
        ...makeExclusions(testingDir, ['src', 'types']),
        ...makeExclusions(sdkDir, ['src', 'types']),
        // Exclude the interface directory in the base blocks documentation.
        path.resolve(sdkDir, 'src', 'interface') + '/**',
        '**/node_modules/**',
    ],
    readme: './src/api-readme.md',
    'src-dir-path': `${path.resolve(testingDir, 'src')}:${path.resolve(sdkDir, 'src')}`,
};
