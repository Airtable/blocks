// @flow

// Wherever the constants below are referenced, they'll be replaced by the values listed here at
// compile time. IMPORTANT: if you change these, remember to update the corresponding flow
// declarations in ./flow-typed/global_constants.js too!
module.exports = {
    PACKAGE_VERSION: require('./package.json').version,
    PACKAGE_NAME: require('./package.json').name,
};
