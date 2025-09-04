const targets = {
    node: '18',
    firefox: '94',
    chrome: '91',
    safari: '14.1',
    edge: '107',
};

module.exports = {
    presets: ['@babel/typescript', ['@babel/env', {targets}], '@babel/react'],
    plugins: [['transform-define', require('./global_constants')]],
    parserOpts: {
        allowAwaitOutsideFunction: true,
    },
};
