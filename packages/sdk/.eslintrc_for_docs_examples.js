const path = require('path');

module.exports = {
    extends: './.eslintrc.js',
    parser: 'babel-eslint',
    parserOptions: {
        babelOptions: {
            configFile: path.join(__dirname, './babel.config.js'),
        },
    },
    rules: {
        'no-unused-expressions': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-no-undef': 'off',
        'flowtype/require-valid-file-annotation': 'off',
        'jsdoc/require-jsdoc': 'off',
        'react/prop-types': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
    },
};
