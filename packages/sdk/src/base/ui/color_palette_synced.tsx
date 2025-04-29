/** @module @airtable/blocks/ui: ColorPalette */ /** */
import * as React from 'react';
import {spawnError} from '../../shared/error_utils';
import {GlobalConfigKey} from '../../shared/types/global_config';
import globalConfigSyncedComponentHelpers from '../../shared/ui/global_config_synced_component_helpers';
import Synced from './synced';
import ColorPalette, {
    colorPaletteStylePropTypes,
    sharedColorPalettePropTypes,
    SharedColorPaletteProps,
} from './color_palette';

/**
 * Props for the {@link ColorPaletteSynced} component. Also accepts:
 * * {@link ColorPaletteStyleProps}
 *
 * @docsPath UI/components/ColorPaletteSynced
 * @groupPath UI/components/ColorPalette
 */
interface ColorPaletteSyncedProps extends SharedColorPaletteProps {
    /** A string key or array key path in {@link GlobalConfig}. The selected color will always reflect the value stored in {@link GlobalConfig} for this key. Selecting a new color will update {@link GlobalConfig}. */
    globalConfigKey: GlobalConfigKey;
}

/**
 * A wrapper around the {@link ColorPalette} component that syncs with {@link GlobalConfig}.
 *
 * [[ Story id="colorpalette--synced-example" title="Synced color palette example" ]]
 *
 * @component
 * @docsPath UI/components/ColorPaletteSynced
 * @groupPath UI/components/ColorPalette
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
