// @flow
import PropTypes from 'prop-types';
import * as React from 'react';
import {spawnError} from '../error_utils';
import {type GlobalConfigKey} from '../global_config';
import ColorPalette, {
    stylePropTypes,
    type SharedColorPaletteProps,
    type StyleProps,
} from './color_palette';
import Synced from './synced';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';

/**
 * @typedef {object} ColorPaletteSyncedProps
 * @property {GlobalConfigKey} globalConfigKey The key, or path to a key, in global config.
 * @property {Array<string>} allowedColors The list of {@link colors} to display in the color palette.
 * @property {number} [squareMargin] The margin between color squares in the color palette.
 * @property {string} [className=''] Additional class names to apply to the color palette, separated by spaces.
 * @property {object} [style={}] Additional styles to apply to the color palette.
 * @property {boolean} [disabled=false] If set to `true`, the color palette will not allow color selection.
 * @property {function} [onChange] A function to be called when the selected color changes.
 */
type ColorPaletteSyncedProps = {|
    globalConfigKey: GlobalConfigKey,
    ...SharedColorPaletteProps,
    ...StyleProps,
|};

/**
 * A wrapper around the {@link ColorPalette} component that syncs with global config.
 *
 * @example
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
 */
class ColorPaletteSynced extends React.Component<ColorPaletteSyncedProps> {
    static propTypes = {
        globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        allowedColors: PropTypes.arrayOf(PropTypes.string).isRequired,
        squareMargin: PropTypes.number,
        className: PropTypes.string,
        style: PropTypes.object,
        ...stylePropTypes,
    };
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
