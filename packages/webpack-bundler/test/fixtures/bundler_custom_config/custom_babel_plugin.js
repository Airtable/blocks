/* eslint-disable */
const t = require('@babel/types');

module.exports = (api) => {
    return {
        name: 'console-log-hello-world',
        visitor: {
            CallExpression(path) {
                const {callee, arguments: callArguments} = path.node;
                if (
                    t.isMemberExpression(callee) &&
                    t.isIdentifier(callee.object) &&
                    callee.object.name === 'console' &&
                    callee.computed === false &&
                    t.isIdentifier(callee.property) &&
                    callee.property.name === 'log'
                ) {
                    callArguments.push(t.stringLiteral("hello world"));
                }
            },
        },
    };
};
