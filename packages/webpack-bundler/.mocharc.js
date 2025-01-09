module.exports = {
    require: ['ts-node/register'],
    recursive: true,
    watchExtensions: ['ts'],
    reporter: 'spec',
    timeout: 5000,
    exit: true,
};
