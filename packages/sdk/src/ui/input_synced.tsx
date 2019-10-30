/** @module @airtable/blocks/ui: Input */ /** */
import * as React from 'react';
import {spawnError} from '../error_utils';
import {GlobalConfigKey} from '../global_config';
import Input, {
    inputStylePropTypes,
    InputStyleProps,
    sharedInputPropTypes,
    SharedInputProps,
    ValidInputType,
} from './input';
import useSynced from './use_synced';
import globalConfigSyncedComponentHelpers from './global_config_synced_component_helpers';

/**
 * @typedef {object} InputSyncedProps
 */
interface InputSyncedProps extends SharedInputProps, InputStyleProps {
    /** The key, or path to a key, in global config. */
    globalConfigKey: GlobalConfigKey;
}

/**
 * A wrapper around the `UI.Input` component that syncs with global config.
 *
 * @example
 * ```js
 * import {UI} from '@airtable/blocks/ui';
 * import {globalConfig} from '@airtable/blocks';
 * import React from 'react';
 *
 * function ApiKeyInput() {
 *     return (
 *         <UI.InputSynced
 *             globalConfigKey="apiKey"
 *             disabled={!canEditApiKey}
 *         />
 *     );
 * }
 * ```
 */
function InputSynced(props: InputSyncedProps, ref: React.Ref<HTMLInputElement>) {
    const {globalConfigKey, type = ValidInputType.text, disabled, onChange, ...restOfProps} = props;
    const {value, setValue, canSetValue} = useSynced(globalConfigKey);

    let inputValue;
    if (value === null || value === undefined) {
        // If an input gets null or undefined for value, React treats it as uncontrolled
        // and will throw warnings when it becomes controlled.
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

const ForwardedRefInputSynced = React.forwardRef(InputSynced);

ForwardedRefInputSynced.propTypes = {
    globalConfigKey: globalConfigSyncedComponentHelpers.globalConfigKeyPropType,
    ...sharedInputPropTypes,
    ...inputStylePropTypes,
};

ForwardedRefInputSynced.displayName = 'InputSynced';

export default ForwardedRefInputSynced;
