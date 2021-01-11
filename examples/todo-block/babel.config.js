module.exports = {
    presets: [
        '@babel/react',
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'usage',
                corejs: 3,
            },
        ],
    ],
};
