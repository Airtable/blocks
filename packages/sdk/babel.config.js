// Transpile for node 8 and the set of browsers currently supported by Airtable
// TODO(alex): once we're moved onto blocks-cli for builds and it supports transpiling node_modules,
// replace this with a set of lighter-weight transforms.
const targets = {
    node: '8.10',
    browsers: ['firefox >= 45', 'chrome >= 49', 'safari >= 10', 'edge >= 25'],
};

// We also use @babel/preset-env with useBuiltIns set to 'usage', and @babel/plugin-transform-runtime.
// Together, these make it so that any polyfills needed are imported directly in the files that use
// them. As only the polyfills needed for our targets & usage are included, we don't need to worry
// about using unavailable parts of the JS std lib, or over-inflating bundle size with lots of
// unnecessary polyfills. @babel/plugin-transform-runtime switches babel's helpers to be imported
// from a central module rather than inlined in every file, which also helps reduce bundle size.
// We're using these with corejs 3 - see [1] for more details.
// [1]: https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md
module.exports = {
    presets: [
        '@babel/typescript',
        [
            '@babel/env',
            {
                useBuiltIns: 'usage',
                corejs: 3,
                targets,
                // TODO: remove this once https://github.com/babel/babel/issues/10023 is fixed
                include: ['transform-classes'],
            },
        ],
        '@babel/react',
    ],
    plugins: [
        '@babel/proposal-class-properties',
        '@babel/transform-runtime',
        ['transform-define', require('./global_constants')],
    ],
    parserOpts: {
        allowAwaitOutsideFunction: true,
    },
};
