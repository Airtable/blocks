// Wherever the constants below are referenced, they'll be replaced by the values listed here at
// compile time. It's important that they're all under `global`, as otherwise the resulting flow
// errors will cause problems both here (which we can easily mitigate) and for consumers (which we
// can't)
module.exports = {
    'global.PACKAGE_VERSION': require('./package.json').version,
    'global.PACKAGE_NAME': require('./package.json').name,
};
