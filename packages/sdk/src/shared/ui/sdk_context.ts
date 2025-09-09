import * as React from 'react';
import {invariant} from '../error_utils';
import {type SdkMode} from '../../sdk_mode';

export const SdkContext = React.createContext<SdkMode['SdkT'] | null>(null);
export const useSdk = <SdkModeT extends SdkMode>(): SdkModeT['SdkT'] => {
    const sdk = React.useContext(SdkContext);
    invariant(
        sdk,
        'This component can only be used in a block. Make sure to use `initializeBlock` at the root of this component tree.',
    );
    return sdk;
};
