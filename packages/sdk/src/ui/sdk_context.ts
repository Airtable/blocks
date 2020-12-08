import * as React from 'react';
import Sdk from '../sdk';
import {invariant} from '../error_utils';

export const SdkContext = React.createContext<Sdk | null>(null);
export const useSdk = () => {
    const sdk = React.useContext(SdkContext);
    invariant(
        sdk,
        'This component can only be used in a block. Make sure to use `initializeBlock` at the root of this component tree.',
    );
    return sdk;
};
