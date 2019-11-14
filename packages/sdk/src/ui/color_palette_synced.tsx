/** @module @airtable/blocks/ui: ColorPalette */ /** */
import * as React from 'react';
import {spawnError} from '../error_utils';
import {GlobalConfigKey} from '../global_config';
import ColorPalette, {
    colorPaletteStylePropTypes,
    sharedColorPalettePropTypes,
    SharedColorPaletteProps,
} from './color_palette';
import Synced from './synced';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';

/**
 * Props for the {@link ColorPaletteSynced} component. Also accepts:
 * * {@link ColorPaletteStyleProps}
 */
interface ColorPaletteSyncedProps extends SharedColorPaletteProps {
    /** A string key or array key path in {@link GlobalConfig}. The selected color will always reflect the value stored in {@link GlobalConfig} for this key. Selecting a new color will update {@link GlobalConfig}. */
    globalConfigKey: GlobalConfigKey;
}

/**
 * A wrapper around the {@link ColorPalette} component that syncs with {@link GlobalConfig}.
 *
 * @example
 * ```js
 * import {ColorPaletteSynced, colors} from '@airtable/blocks/ui';
 * import {globalConfig} from '@airtable/blocks';
 * import React from 'react';
 *
 * function DisplayOptions() {
 *     const allowedColors = [colors.GREEN, colors.BLUE, colors.RED]
 *     return (
 *         <ColorPaletteSynced
 *             allowedColors={allowedColors}
 *             globalConfigKey="displayColor"
 *         />
 *     );
 * }
 * ```
 */
class ColorPaletteSynced extends React.Component<ColorPaletteSyncedProps> {
    /** @hidden */
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        ...colorPaletteStylePropTypes,
        ...sharedColorPalettePropTypes,
    };
    /** @hidden */
    render() {
        const {globalConfigKey, disabled, onChange, ...restOfProps} = this.props;
        return (
            <Synced
                globalConfigKey={globalConfigKey}
                render={({value, canSetValue, setValue}) => {
                    let currentColor;
                    if (typeof value === 'string' || value === null || value === undefined) {
                        currentColor = value;
                    } else {
                        spawnError(
                            'ColorPaletteSynced only works with a global config value that is a string, null, or undefined',
                        );
                    }
                    return (
                        <ColorPalette
                            {...restOfProps}
                            color={currentColor}
                            onChange={newValue => {
                                setValue(newValue);
                                if (onChange) {
                                    onChange(newValue);
                                }
                            }}
                            disabled={disabled || !canSetValue}
                        />
                    );
                }}
            />
        );
    }
}

export default ColorPaletteSynced;
