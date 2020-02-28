'use strict';

const SPACE_OR_TAB_REGEX = /^[\ \t]*$/;

const compile = (cst, options = {}) => {
    const keepProtected = options.safe === true || options.keepProtected === true;
    let firstSeen = false;

    const walk = (node, parent) => {
        let output = '';
        let inner;
        let lines;

        for (const [index, child] of node.nodes.entries()) {
            switch (child.type) {
                case 'block':
                    if (!options.block) {
                        output += walk(child, node);
                    }

                    if (options.first && firstSeen === true) {
                        output += walk(child, node);
                        break;
                    }

                    if (options.preserveNewlines === true) {
                        inner = walk(child, node);
                        lines = inner.split('\n');
                        output += '\n'.repeat(lines.length - 1);
                        break;
                    }

                    if (keepProtected === true && child.protected === true) {
                        output += walk(child, node);
                        break;
                    }

                    firstSeen = true;
                    break;
                case 'line':
                    if (options.first && firstSeen === true) {
                        output += child.value;
                        break;
                    }

                    if (keepProtected === true && child.protected === true) {
                        output += child.value;
                    }

                    // Line comments can exist inline with code, or on their own line.
                    // If they're on their own line, we want to remove the line entirely. The proxy
                    // for whether it is on its own line is whether the previous node is a text
                    // node with only spaces & tabs. When true, we want to remove those leading
                    // spaces & tabs, and remove the newline that follows the line comment.
                    const previousNode = node.nodes[index - 1];
                    if (
                        !previousNode ||
                        (previousNode.type === 'text' &&
                            SPACE_OR_TAB_REGEX.test(previousNode.value)) ||
                        previousNode.type === 'newline'
                    ) {
                        // If there were leading spaces/tabs, remove them. If the previous node was
                        // a newline, no need to remove -- we'll strip the trailing newline instead.
                        output =
                            previousNode && previousNode.type === 'text'
                                ? output.substring(0, output.length - previousNode.value.length)
                                : output;

                        const nextNode = node.nodes[index + 1];
                        if (nextNode && nextNode.type === 'newline') {
                            nextNode.value = '';
                        }
                    }

                    firstSeen = true;
                    break;
                case 'open':
                case 'close':
                case 'text':
                case 'newline':
                default: {
                    output += child.value || '';
                    break;
                }
            }
        }

        return output;
    };

    return walk(cst);
};

module.exports = compile;
