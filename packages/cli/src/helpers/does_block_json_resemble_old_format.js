// @flow
function doesBlockJsonResembleOldFormat(blockJson: {[string]: mixed}): boolean {
    return (
        typeof blockJson.frontendEntryModuleName === 'string' &&
        typeof blockJson.applicationId === 'string' &&
        typeof blockJson.blockId === 'string' &&
        Array.isArray(blockJson.modules)
    );
}

module.exports = doesBlockJsonResembleOldFormat;
