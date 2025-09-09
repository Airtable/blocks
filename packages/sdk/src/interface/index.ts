import {__injectSdkIntoWarning} from '../shared/warning';
import getAirtableInterface from '../injected/airtable_interface';
import {type InterfaceSdkMode} from '../sdk_mode';
import {InterfaceBlockSdk} from './sdk';
import {__injectSdkIntoInitializeBlock} from './ui/initialize_block';

/** @internal */
export function __reset() {
    const __sdk = new InterfaceBlockSdk(getAirtableInterface<InterfaceSdkMode>());

    __injectSdkIntoInitializeBlock(__sdk);
    __injectSdkIntoWarning(__sdk);
}

__reset();
