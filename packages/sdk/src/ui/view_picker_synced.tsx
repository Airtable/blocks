/** @module @airtable/blocks/ui: ViewPicker */ /** */
import * as React from 'react';
import getSdk from '../get_sdk';
import View from '../models/view';
import {GlobalConfigKey} from '../types/global_config';
import ViewPicker, {sharedViewPickerPropTypes, SharedViewPickerProps} from './view_picker';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';
import useSynced from './use_synced';
import useWatchable from './use_watchable';

/**
 * Props for the {@link ViewPickerSynced} component. Also accepts:
 * * {@link SelectStyleProps}
 *
 * @docsPath UI/components/ViewPickerSynced
 * @groupPath UI/components/ViewPicker
 */
interface ViewPickerSyncedProps extends SharedViewPickerProps {
    /** A string key or array key path in {@link GlobalConfig}. The selected view will always reflect the view id stored in {@link GlobalConfig} for this key. Selecting a new view will update {@link GlobalConfig}. */
    globalConfigKey: GlobalConfigKey;
}

/**
 * A wrapper around the {@link ViewPicker} component that syncs with {@link GlobalConfig}.
 *
 * [[ Story id="modelpickers--viewpickersynced-example" title="Synced view picker example" ]]
 *
 * @docsPath UI/components/ViewPickerSynced
 * @groupPath UI/components/ViewPicker
 * @component
 */
const ViewPickerSynced = (props: ViewPickerSyncedProps, ref: React.Ref<HTMLSelectElement>) => {
    const {globalConfigKey, table, onChange, disabled, ...restOfProps} = props;
    const {value: viewId, canSetValue: canSetViewId, setValue: setViewId} = useSynced(
        globalConfigKey,
    );

    useWatchable(getSdk().base, ['tables']);
    useWatchable(table, ['views']);

    function _getViewFromGlobalConfigValue(): View | null {
        if (!table || table.isDeleted) {
            return null;
        }
        return typeof viewId === 'string' && table ? table.getViewByIdIfExists(viewId) : null;
    }

    return (
        <ViewPicker
            {...restOfProps}
            ref={ref}
            table={table}
            view={_getViewFromGlobalConfigValue()}
            onChange={view => {
                setViewId(view ? view.id : null);
                if (onChange) {
                    onChange(view);
                }
            }}
            disabled={disabled || !canSetViewId}
        />
    );
};

const ForwardedRefViewPickerSynced = React.forwardRef<HTMLSelectElement, ViewPickerSyncedProps>(
    ViewPickerSynced,
);

ForwardedRefViewPickerSynced.displayName = 'ViewPickerSynced';

ForwardedRefViewPickerSynced.propTypes = {
    globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
    ...sharedViewPickerPropTypes,
};

export default ForwardedRefViewPickerSynced;
