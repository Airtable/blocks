/** @module @airtable/blocks/ui: FieldPicker */ /** */
import * as React from 'react';
import getSdk from '../get_sdk';
import Field from '../models/field';
import {GlobalConfigKey} from '../types/global_config';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';
import FieldPicker, {sharedFieldPickerPropTypes, SharedFieldPickerProps} from './field_picker';
import useSynced from './use_synced';
import useWatchable from './use_watchable';

/**
 * Props for the {@link FieldPickerSynced} component. Also accepts:
 * * {@link SelectStyleProps}
 *
 * @docsPath UI/components/FieldPickerSynced
 * @groupPath UI/components/FieldPicker
 */
interface FieldPickerSyncedProps extends SharedFieldPickerProps {
    /** A string key or array key path in {@link GlobalConfig}. The selected field will always reflect the field id stored in {@link GlobalConfig} for this key. Selecting a new field will update {@link GlobalConfig}. */
    globalConfigKey: GlobalConfigKey;
}

/**
 * A wrapper around the {@link FieldPicker} component that syncs with {@link GlobalConfig}.
 *
 * [[ Story id="modelpickers--fieldpickersynced-example" title="Synced field picker example" ]]
 *
 * @docsPath UI/components/FieldPickerSynced
 * @groupPath UI/components/FieldPicker
 * @component
 */
const FieldPickerSynced = (props: FieldPickerSyncedProps, ref: React.Ref<HTMLSelectElement>) => {
    const {globalConfigKey, onChange, disabled, table, ...restOfProps} = props;
    const [fieldId, setFieldId, canSetFieldId] = useSynced(globalConfigKey);

    useWatchable(getSdk().base, ['tables']);
    useWatchable(table, ['fields']);

    function _getFieldFromGlobalConfigValue(): Field | null {
        if (!table || table.isDeleted) {
            return null;
        }
        return typeof fieldId === 'string' && table ? table.getFieldByIdIfExists(fieldId) : null;
    }

    return (
        <FieldPicker
            {...restOfProps}
            ref={ref}
            table={table}
            field={_getFieldFromGlobalConfigValue()}
            onChange={field => {
                setFieldId(field ? field.id : null);
                if (onChange) {
                    onChange(field);
                }
            }}
            disabled={disabled || !canSetFieldId}
        />
    );
};

const ForwardedRefFieldPickerSynced = React.forwardRef<HTMLSelectElement, FieldPickerSyncedProps>(
    FieldPickerSynced,
);

ForwardedRefFieldPickerSynced.displayName = 'FieldPickerSynced';

ForwardedRefFieldPickerSynced.propTypes = {
    globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
    ...sharedFieldPickerPropTypes,
};

export default ForwardedRefFieldPickerSynced;
