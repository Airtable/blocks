/** @module @airtable/blocks/ui: SelectButtons */ /** */
import * as React from 'react';
import {spawnError} from '../../shared/error_utils';
import {type GlobalConfigKey} from '../../shared/types/global_config';
import useSynced from '../../shared/ui/use_synced';
import SelectButtons, {type SharedSelectButtonsProps} from './select_buttons';

/**
 * Props for the {@link SelectButtonsSynced} component. Also accepts:
 * * {@link SelectButtonsStyleProps}
 *
 * @docsPath UI/components/SelectButtonsSynced
 * @groupPath UI/components/SelectButtons
 */
interface SelectButtonsSyncedProps extends SharedSelectButtonsProps {
    /** A string key or array key path in {@link GlobalConfig}. The selected option will always reflect the value stored in {@link GlobalConfig} for this key. Selecting a new option will update {@link GlobalConfig}. */
    globalConfigKey: GlobalConfigKey;
}

/**
 *  A wrapper around the {@link SelectButtons} component that syncs with {@link GlobalConfig}.
 *
 * [[ Story id="selectbuttons--synced-example" title="SelectButtonsSynced example" ]]
 *
 * @docsPath UI/components/SelectButtonsSynced
 * @groupPath UI/components/SelectButtons
 * @component
 */
const SelectButtonsSynced = (props: SelectButtonsSyncedProps, ref: React.Ref<HTMLDivElement>) => {
    const {globalConfigKey, onChange, disabled, ...restOfProps} = props;
    const [value, setValue, canSetValue] = useSynced(globalConfigKey);

    let selectValue;
    if (value === null || value === undefined) {
        selectValue = null;
    } else if (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean'
    ) {
        selectValue = value;
    } else {
        throw spawnError(
            'SelectButtonsSynced only works with a global config value that is a string, number, boolean, null or undefined.',
        );
    }

    return (
        <SelectButtons
            {...restOfProps}
            ref={ref}
            value={selectValue}
            onChange={(newValue) => {
                setValue(newValue);
                if (onChange) {
                    onChange(newValue);
                }
            }}
            disabled={disabled || !canSetValue}
        />
    );
};

const ForwardedRefSelectButtonsSynced = React.forwardRef<HTMLDivElement, SelectButtonsSyncedProps>(
    SelectButtonsSynced,
);

ForwardedRefSelectButtonsSynced.displayName = 'SelectButtonsSynced';

export default ForwardedRefSelectButtonsSynced;
