/** @module @airtable/blocks/ui: Input */ /** */
import * as React from 'react';
import {spawnError} from '../../shared/error_utils';
import {type GlobalConfigKey} from '../../shared/types/global_config';
import useSynced from '../../shared/ui/use_synced';
import Input, {type SharedInputProps, SupportedInputType} from './input';

/**
 * Props for the {@link InputSynced} component. Also accepts:
 * * {@link InputStyleProps}
 *
 * @docsPath UI/components/InputSynced
 * @groupPath UI/components/Input
 */
interface InputSyncedProps extends SharedInputProps {
    /** A string key or array key path in {@link GlobalConfig}. The input value will always reflect the value stored in {@link GlobalConfig} for this key. Changing the input value will update {@link GlobalConfig}. */
    globalConfigKey: GlobalConfigKey;
}

/**
 * A wrapper around the {@link Input} component that syncs with {@link GlobalConfig}.
 *
 * [[ Story id="input--example-synced" title="Synced input example" ]]
 *
 * @docsPath UI/components/InputSynced
 * @groupPath UI/components/Input
 * @component
 */
const InputSynced = (props: InputSyncedProps, ref: React.Ref<HTMLInputElement>) => {
    const {
        globalConfigKey,
        type = SupportedInputType.text,
        disabled,
        onChange,
        ...restOfProps
    } = props;
    const [value, setValue, canSetValue] = useSynced(globalConfigKey);

    let inputValue;
    if (value === null || value === undefined) {
        inputValue = '';
    } else if (typeof value === 'string') {
        inputValue = value;
    } else {
        throw spawnError(
            'InputSynced only works with a global config value that is a string, null or undefined.',
        );
    }
    return (
        <Input
            {...restOfProps}
            ref={ref}
            disabled={disabled || !canSetValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setValue(e.target.value);
                if (onChange) {
                    onChange(e);
                }
            }}
            value={inputValue}
            type={type}
        />
    );
};

const ForwardedRefInputSynced = React.forwardRef<HTMLInputElement, InputSyncedProps>(InputSynced);

ForwardedRefInputSynced.displayName = 'InputSynced';

export default ForwardedRefInputSynced;
