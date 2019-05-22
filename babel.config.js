// @noflow

// Transpile for node 8 and the set of browsers currently supported by Airtable
// TODO(alex): once we're moved onto blocks-cli for builds and it supports transpiling node_modules,
// replace this with a set of lighter-weight transforms.
const targets = {
    node: '8.10',
    browsers: ['firefox >= 29', 'chrome >= 32', 'safari >= 9', 'edge >= 13'],
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
        [
            '@babel/env',
            {
                useBuiltIns: 'usage',
                corejs: 3,
                targets,
            },
        ],
        '@babel/react',
    ],
    plugins: [
        // Rather than using @babel/preset-flow, we use the two plugins that make up that preset
        // directly. This is to make sure they run before @babel/proposal-class-properties, which
        // otherwise sets flow annotated properties without initial values to undefined:
        // https://github.com/babel/babel/issues/8417
        //
        // TODO: remove this workaround. @babel/proposal-class-properties implements the spec
        // correctly, but the code in this repo was written against an earlier version of the
        // plugin which had different behaviour.
        '@babel/syntax-flow',
        '@babel/transform-flow-strip-types',
        '@babel/proposal-class-properties',
        ['@babel/transform-runtime', {corejs: 3}],
        ['transform-define', require('./global_constants')],
    ],
};
