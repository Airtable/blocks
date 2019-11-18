/** @module @airtable/blocks/ui: Input */ /** */
import * as React from 'react';
import {spawnError} from '../error_utils';
import {GlobalConfigKey} from '../global_config';
import Input, {sharedInputPropTypes, SharedInputProps, SupportedInputType} from './input';
import useSynced from './use_synced';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';

/**
 * Props for the {@link InputSynced} component. Also accepts:
 * * {@link InputStyleProps}
 */
interface InputSyncedProps extends SharedInputProps {
    /** A string key or array key path in {@link GlobalConfig}. The input value will always reflect the value stored in {@link GlobalConfig} for this key. Changing the input value will update {@link GlobalConfig}. */
    globalConfigKey: GlobalConfigKey;
}

/**
 * A wrapper around the {@link Input} component that syncs with {@link GlobalConfig}.
 *
 * @example
 * ```js
 * import {InputSynced} from '@airtable/blocks/ui';
 * import React from 'react';
 *
 * function ApiKeyInput() {
 *     return (
 *         <InputSynced
 *             globalConfigKey="apiKey"
 *             disabled={!canEditApiKey}
 *         />
 *     );
 * }
 * ```
 */
function InputSynced(props: InputSyncedProps, ref: React.Ref<HTMLInputElement>) {
    const {
        globalConfigKey,
        type = SupportedInputType.text,
        disabled,
        onChange,
        ...restOfProps
    } = props;
    const {value, setValue, canSetValue} = useSynced(globalConfigKey);

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
}

const ForwardedRefInputSynced = React.forwardRef<HTMLInputElement, InputSyncedProps>(InputSynced);

ForwardedRefInputSynced.propTypes = {
    globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
    ...sharedInputPropTypes,
};

ForwardedRefInputSynced.displayName = 'InputSynced';

export default ForwardedRefInputSynced;
