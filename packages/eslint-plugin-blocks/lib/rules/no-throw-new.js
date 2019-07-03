module.exports = {
    meta: {
        schema: [],
    },
    create(context) {
        return {
            ThrowStatement(node) {
                if (node.argument.type === 'NewExpression') {
                    context.report({
                        node,
                        message: 'Unexpected throw new, use throw spawnError() instead',
                    });
                }
            },
        };
    },
};
