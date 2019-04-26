// @flow
const {h, u} = window.__requirePrivateModuleFromAirtable('client_server_shared/hu');
const liveappColors = window.__requirePrivateModuleFromAirtable('client_server_shared/colors');
const colors = require('block_sdk/shared/colors');

// Construct a set of all the possible color values, so the below
// methods have constant time lookup when validating that a color
// exists.
const colorValuesSet = u.arrayToSet(u.values(colors));

/**
 * @example
 * import {UI} from 'airtable-block';
 * UI.colorUtils.getHexForColor(UI.colors.RED);
 */
const colorUtils = {
    /** */
    getHexForColor(color: string): string | null {
        if (!colorValuesSet[color]) {
            return null;
        }

        return liveappColors.getHexForColor(color);
    },
    /** */
    getRgbForColor(color: string): {r: number, g: number, b: number} | null {
        if (!colorValuesSet[color]) {
            return null;
        }

        return liveappColors.getRgbObjForColor(color);
    },
    /** */
    shouldUseLightTextOnColor(color: string): boolean {
        if (!colorValuesSet[color]) {
            // Don't have a color for this. Let's just return false as a default
            // instead of throwing.
            return false;
        }

        // Light1 and Light2 colors use dark text.
        // Bright, Dark1 and no suffix colors use light text.
        // NOTE: use shouldUseDarkText instead of shouldUseLightText just to make
        // checking the suffix easier, since no suffix uses light text.
        const shouldUseDarkText = u.some(['Light1', 'Light2'], suffix => {
            return u.endsWith(color, suffix);
        });
        return !shouldUseDarkText;
    },
};

module.exports = colorUtils;
