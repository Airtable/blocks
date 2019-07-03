// @noflow

const targets = {
    node: '8.10',
    browsers: ['firefox >= 45', 'chrome >= 49', 'safari >= 10', 'edge >= 25'],
};

module.exports = {
    presets: [
        [
            '@babel/env',
            {
                useBuiltIns: 'usage',
                corejs: 3,
                targets,
                include: ['transform-classes'],
            },
        ],
        '@babel/react',
    ],
    plugins: [
        '@babel/syntax-flow',
        '@babel/transform-flow-strip-types',
        '@babel/proposal-class-properties',
        '@babel/transform-runtime',
        ['transform-define', require('./global_constants')],
    ],
    parserOpts: {
        allowAwaitOutsideFunction: true,
    },
};
