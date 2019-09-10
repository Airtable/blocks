module.exports = function(api) {
    api.cache(true);
    return {
        // Allow sub-packages to override .babelrc.
        babelrcRoots: ['.', './blocks_backend_wrapper'],
        // We use the '@babel/transform-flow-strip-types' plugin instead of the
        // '@babel/preset-flow' preset due to a Babel bug:
        // https://github.com/babel/babel/issues/8593#issuecomment-419862386
        presets: ['@babel/preset-env', '@babel/preset-react'],
        plugins: [
            '@babel/plugin-transform-flow-strip-types',
            '@babel/plugin-proposal-class-properties',
        ],
        retainLines: true,
    };
};
