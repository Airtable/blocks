import React from 'react';
import {colors, colorUtils, Box, Text} from '@airtable/blocks/ui';

export const severityColorCode = level => {
    let colorCode = '';
    switch (level) {
        case 0: {
            return 'transparent';
        }
        case 1: {
            colorCode = colors.PURPLE_BRIGHT;
            break;
        }
        case 2: {
            colorCode = colors.RED;
            break;
        }
        default: {
            colorCode = '';
            break;
        }
    }

    return colorUtils.getHexForColor(colorCode);
};

/**
 * @param {object} props
 * @param {import('./useSettingsStore').SettingsStore} props.settings
 */
export default function SettingsStatus(props) {
    const {settings, showAction = true, showReason = true} = props;

    const {
        validated: {isValid, action, severity, reason},
    } = settings;

    const textColor = severityColorCode(severity);

    return !isValid ? (
        <Box>
            {reason && showReason ? (
                <Text textColor={textColor} marginRight={3}>
                    {reason}
                </Text>
            ) : null}
            {action && showAction ? (
                <Text textColor="light" marginRight={3}>
                    {action}
                </Text>
            ) : null}
        </Box>
    ) : null;
}
