module.exports = {
    require: ['./test/ts-node-register'],
    recursive: true,
    watchExtensions: ['ts'],
    reporter: 'spec',
    timeout: 5000,
};
