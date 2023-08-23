const targets = {
    node: '8.10',
    browsers: ['firefox >= 45', 'chrome >= 49', 'safari >= 10', 'edge >= 25'],
};

module.exports = {
    presets: [
        '@babel/typescript',
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
        '@babel/proposal-class-properties',
        '@babel/proposal-nullish-coalescing-operator',
        '@babel/proposal-optional-chaining',
        '@babel/transform-runtime',
        [
            'transform-define',
            {
                'global.COMPATIBLE_SDK_VERSIONS': require('./package.json').peerDependencies[
                    '@airtable/blocks'
                ],
                'global.PACKAGE_VERSION': require('./package.json').version,
            },
        ],
    ],
    parserOpts: {
        allowAwaitOutsideFunction: true,
    },
};
