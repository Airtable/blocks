// Transpile for node 18 and the set of browsers currently supported by Airtable
const targets = {
    node: '18',
    firefox: '94',
    chrome: '91',
    safari: '14.1',
    edge: '107',
};

module.exports = {
    presets: ['@babel/typescript', ['@babel/env', {targets}], '@babel/react'],
    plugins: [['transform-define', require('./global_constants.cjs')]],
    parserOpts: {
        allowAwaitOutsideFunction: true,
    },
};
