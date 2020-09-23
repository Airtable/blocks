// @noflow

// This file is only to make eslint and flow work in UI Playground and is not actually used to build/run the app.
// `block run` and `block release` have their own babel config that strip out flow config.

module.exports = {
    presets: ['@babel/preset-env', '@babel/preset-react'],
    plugins: ['@babel/syntax-flow'],
};
