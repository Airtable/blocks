module.exports = {
    meta: {
        schema: [],
    },
    create(context) {
        return {
            CallExpression(node) {
                if (
                    node.callee.type === 'Identifier' &&
                    node.callee.name === 'require' &&
                    node.arguments[0] &&
                    node.arguments[0].type === 'Literal' &&
                    node.arguments[0].value === 'invariant'
                ) {
                    context.report({
                        node,
                        message:
                            'Cannot require "invariant" from node_modules - use our custom invariant instead',
                    });
                }
            },
            ImportDeclaration(node) {
                if (node.source.type === 'Literal' && node.source.value === 'invariant') {
                    context.report({
                        node,
                        message:
                            'Cannot require "invariant" from node_modules - use our custom invariant instead',
                    });
                }
            },
        };
    },
};
