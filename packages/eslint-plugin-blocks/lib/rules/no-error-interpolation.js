const getPropertyName = require('eslint/lib/rules/utils/ast-utils').getStaticPropertyName;

function getNodeName(node) {
    if (node.type === 'Identifier') {
        return node.name;
    }
    return getPropertyName(node);
}

module.exports = {
    meta: {
        type: 'problem',
        schema: [
            {
                type: 'object',
                additionalProperties: {
                    type: 'number',
                },
            },
        ],
    },
    create(context) {
        return {
            CallExpression(node) {
                const calleeName = getNodeName(node.callee);

                const errorFns = context.options[0];
                for (const errorFnName of Object.keys(errorFns)) {
                    const messageArgumentIndex = errorFns[errorFnName];

                    if (
                        calleeName === errorFnName &&
                        node.arguments[messageArgumentIndex] &&
                        node.arguments[messageArgumentIndex].type === 'TemplateLiteral'
                    ) {
                        context.report({
                            node,
                            message:
                                'Unexpected string interpolation in error message, use %s placeholders to interpolate instead',
                        });
                    }
                }
            },
        };
    },
};
